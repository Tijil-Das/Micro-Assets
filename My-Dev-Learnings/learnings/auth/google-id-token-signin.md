---
title: "Using Google ID Token Sign-In with Supabase"
date: 2026-07-20
category: auth
tags: [google, oauth, supabase, jwt, id-token, gis-sdk, frontend, security]
project: CircuitIQ
project-context: "Building the user authentication system for the landing page"
discovered-while: "Implementing Google OAuth sign-in via Supabase — testing the sign-in modal for the first time"
triggered-by: user-feedback
difficulty: intermediate
time-to-resolve: ~2 hours
status: complete
portfolio-worthy: yes
source-files: ["auth.js", "index.html"]
commit: ece27b3
---

# Using Google ID Token Sign-In with Supabase

---

## The Problem

When building CircuitIQ's authentication, I integrated Google Sign-In using Supabase's standard redirect-based OAuth (`supabase.auth.signInWithOAuth`). 

The result: the Google sign-in screen showed **`fgwsqljkvfabscvmfuzm.supabase.co`** in the "to continue to" line — not "CircuitIQ." This looks untrustworthy to real users and undermines the product's credibility. No amount of app name configuration in Google Cloud Console could remove the Supabase domain from that line, because Google hardcodes the OAuth redirect handler's domain in that prompt.

---

## The Context

### How standard Supabase OAuth works (the redirect flow)
```
User clicks "Sign in with Google"
    ↓
Browser navigates to: https://<project-ref>.supabase.co/auth/v1/authorize
    ↓
Supabase redirects to Google OAuth
    ↓
Google shows: "to continue to fgwsqljkvfabscvmfuzm.supabase.co"  ← THE PROBLEM
    ↓
User authenticates, Google redirects back to Supabase callback URL
    ↓
Supabase redirects back to your app with the session
```

The key insight: **Google's account picker shows the domain of whichever server handles the OAuth redirect**. Since Supabase's servers are the callback handler, Supabase's domain appears — permanently. Google's security model explicitly requires this to prevent phishing, and this behavior cannot be overridden without a custom Supabase domain (a paid feature on Pro/Enterprise plans).

### The alternative: Google Identity Services (GIS) SDK with ID Tokens
The GIS SDK (released 2021, replacing the old Google Sign-In SDK) supports a fundamentally different flow:

```
User clicks "Sign in with Google" on CircuitIQ
    ↓
Google's popup/One Tap widget renders directly ON CircuitIQ's page
    ↓
Google shows: "to continue to CircuitIQ" (or the verified app name)  ← FIXED
    ↓
User authenticates, Google returns a signed JWT (ID token) to the JS callback in auth.js
    ↓
auth.js sends that ID token to Supabase via signInWithIdToken()
    ↓
Supabase verifies the token's signature server-side and creates the session
```

**The crucial difference:** the OAuth flow happens *inside your page's JavaScript context*, not via a page-level redirect to Supabase. Google talks to your page. Your page talks to Supabase. Supabase's URL never appears in the Google UI.

### What is an ID token?
An ID token is a **signed JWT** issued by Google after authentication. It contains:
- `sub`: Google's unique user ID
- `email`, `name`, `picture`
- `aud`: Your Google Client ID (proves the token was issued *for your app*)
- `exp`: Expiry timestamp
- `iss`: `accounts.google.com` (proves it came from Google)
- `iat`: Issue time

Supabase's `signInWithIdToken` accepts this token, independently verifies it against Google's public keys, and creates an authenticated session. This verification happens server-side (Supabase's backend) — your frontend never needs to validate the JWT itself.

---

## The Solution

### Step 1: Load the GIS SDK

Add Google's client library to `index.html`. The `async defer` attributes ensure it doesn't block page render.

```html
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Step 2: Update authentication logic

The key changes:
1. Remove `signInWithOAuth` and its redirect logic entirely.
2. Read the Google Client ID from an environment variable (`VITE_GOOGLE_CLIENT_ID`).
3. Initialize the GIS SDK with a callback that receives the ID token.
4. Trigger the One Tap prompt. If the browser suppresses One Tap (it does in some cases), fall back to rendering Google's official button.
5. Pass the ID token to Supabase.

### Step 3: Add the environment variable

```
VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
```

This must also be added to the Cloudflare Pages environment variables (Production + Preview) since Vite injects `import.meta.env.*` at build time.

### Step 4: Configure Google Cloud Console — Critical Change

Because the flow now runs from CircuitIQ's domain (not Supabase's), the Google OAuth credential must allow CircuitIQ's domain as an **Authorized JavaScript Origin**, not just a redirect URI.

In [Google Cloud Console → Credentials → OAuth 2.0 Client → Edit](https://console.cloud.google.com/apis/credentials):
- **Authorized JavaScript origins**: Add `https://localhost:1234` (dev) and `https://<circuitiq>.pages.dev` (prod)
- The Supabase callback URL in **Authorized redirect URIs** is no longer needed for this flow.

---

## The Code

### `auth.js` — `signInWithGoogle` function

```javascript
export function signInWithGoogle() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.error('VITE_GOOGLE_CLIENT_ID is not set in your .env file')
    return
  }

  const initAndPrompt = () => {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        // response.credential is a signed JWT from Google
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        })

        if (error) {
          console.error('Supabase signInWithIdToken error:', error)
        } else {
          closeSigninPanel()
          // supabase.auth.onAuthStateChange fires 'SIGNED_IN' here automatically
        }
      },
      use_fedcm_for_prompt: true, // Enables the FedCM API (Chrome 108+) for better UX
    })

    window.google.accounts.id.prompt((notification) => {
      // One Tap may be suppressed if:
      //   - User previously dismissed it ("Not now")
      //   - Browser blocks third-party cookies
      //   - User already signed in (though this shouldn't happen here)
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Fallback: render Google's official sign-in button
        window.google.accounts.id.renderButton(
          document.getElementById('google-gsi-btn-container'),
          { theme: 'filled_black', size: 'large', width: 320, text: 'continue_with' }
        )
        document.getElementById('google-gsi-btn-container').style.display = 'flex'
      }
    })
  }

  // SDK may not be loaded yet if called immediately on page load
  if (window.google?.accounts?.id) {
    initAndPrompt()
  } else {
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(interval)
        initAndPrompt()
      }
    }, 100)
  }
}
```

### `index.html` — Modal with fallback container

```html
<!-- The click handler calls signInWithGoogle() which triggers One Tap -->
<button class="btn btn-secondary-full" id="google-signin-btn">
  <svg><!-- Google icon --></svg>
  Continue with Google
</button>

<!-- Hidden by default. GIS SDK renders its button here if One Tap is suppressed. -->
<div id="google-gsi-btn-container" style="display: none; margin-top: 1rem; justify-content: center;"></div>
```

---

## Key Takeaways

- **The OAuth redirect flow always shows the redirect handler's domain** on Google's account picker. If Supabase handles the redirect, users see Supabase's domain — permanently, by Google's design, not a configuration issue.
- **Google ID Token Sign-In (`signInWithIdToken`) eliminates the redirect entirely.** The authentication happens JavaScript-side on your page. Only the resulting signed token crosses to Supabase.
- **The GIS SDK has two UX modes:** One Tap (a floating prompt) and a rendered button. Always implement the fallback button — One Tap is suppressed by browsers in multiple legitimate scenarios.
- **`use_fedcm_for_prompt: true`** opts into the FedCM API (Federated Credential Management), which is the modern, privacy-preserving mechanism Chrome uses for identity flows. Enable it now — it's the future standard.
- **ID tokens are short-lived JWTs.** Supabase verifies the signature and expiry against Google's public keys on its own servers. You never need to validate the JWT client-side.

---

## What NOT to Do

- **Do not attempt a reverse proxy to mask `supabase.co`.** This breaks the OAuth handshake because redirect URIs must match exactly what is registered in Google Cloud Console. You'll get `redirect_uri_mismatch` errors. Multiple developers have tried this; it does not work reliably.
- **Do not hardcode the Google Client ID.** It belongs in an environment variable (`VITE_GOOGLE_CLIENT_ID`). Even though it's not a secret per se, environment variables are the right mechanism — they allow changing it per-environment without a code change.
- **Do not skip the fallback button.** If you only implement One Tap and it gets suppressed, users will click your button and nothing will happen. Silent failures in auth are the worst user experience.
- **Do not call `google.accounts.id.initialize()` more than once.** The GIS SDK does not support re-initialization. If you need to change the callback, you must `revoke()` first. Structure your code so initialization happens once.

---

## Connections

**Related learnings (to document):**
- Supabase `onAuthStateChange` listener pattern
- Storing Supabase session and restoring on page load
- Cloudflare Workers JWT verification (server-side auth)

**Official references:**
- [Google Identity Services: Sign In with Google for Web](https://developers.google.com/identity/gsi/web/guides/overview)
- [Supabase: Sign in with ID Token](https://supabase.com/docs/reference/javascript/auth-signinwithidtoken)
- [FedCM: Federated Credential Management API](https://developers.google.com/privacy-sandbox/3pcd/fedcm)
- [Google: Migrating from legacy Sign-In to GIS](https://developers.google.com/identity/gsi/web/guides/migration)

---

## Portfolio Notes

Strong signal for a mid-to-senior frontend or full-stack role.

**How I'd frame it:** *"While building CircuitIQ's auth system, I noticed Supabase's redirect-based OAuth was displaying the Supabase domain on Google's sign-in screen instead of CircuitIQ. I investigated the root cause — Google's security model hardcodes the redirect handler's domain — and replaced the flow with Google's GIS SDK ID Token approach. This eliminates the Supabase redirect entirely, runs the auth flow directly on the page, and shows the correct app name to users."*

**What it demonstrates:**
1. I don't accept suboptimal UX without understanding why it's happening.
2. I understand OAuth 2.0 well enough to choose between redirect and ID token flows.
3. I can navigate SDK documentation and integrate non-trivial client-side libraries.
4. I understand JWT verification and where it should happen (server-side, not client).
5. I handle edge cases — One Tap suppression — instead of leaving silent failures.

Belongs in a case study. The "found the real cause, fixed the root" arc is the kind of thing that differentiates candidates in interviews.
