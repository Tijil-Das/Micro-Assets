/**
 * Cloudflare Worker: Visitor Feedback Handler
 * Obstacle Avoidance Car — St. Aloysius School Computer Science Exhibition
 *
 * Receives visitor feedbacks from the website, authenticates with a secret passcode,
 * and commits the review to GitHub: Website/Data/feedbacks.json in Tijil-Das/Micro-Assets.
 */

export default {
  async fetch(request, env, ctx) {
    // 1. CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400"
    };

    // Preflight OPTIONS check
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health check GET
    if (request.method === "GET") {
      return new Response(JSON.stringify({ status: "ok", service: "obstacle-car-feedback-worker" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed. Use POST." }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Passcode Verification
    const authHeader = request.headers.get("Authorization") || "";
    const expectedPasscode = env.PASSCODE || "aloysius-robotics-2026";
    const bearerPrefix = "Bearer ";

    if (!authHeader.startsWith(bearerPrefix) || authHeader.slice(bearerPrefix.length).trim() !== expectedPasscode) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid passcode" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 3. Parse and Validate Payload
    let payload;
    try {
      payload = await request.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const name = (payload.name || "").trim();
    const role = (payload.role || "Visitor").trim();
    const message = (payload.message || "").trim();

    if (!name || !message) {
      return new Response(JSON.stringify({ error: "Name and feedback message are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 4. GitHub Configuration
    const owner = env.GITHUB_REPO_OWNER || "Tijil-Das";
    const repo = env.GITHUB_REPO_NAME || "Micro-Assets";
    const path = env.GITHUB_FILE_PATH || "CS-Exhibition/Obstacle Avoidance Robot/Website/Data/feedbacks.json";
    const branch = env.GITHUB_BRANCH || "main";
    const githubToken = env.GITHUB_TOKEN;

    if (!githubToken) {
      return new Response(JSON.stringify({ error: "Worker misconfigured: GITHUB_TOKEN secret missing in Cloudflare." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const ghHeaders = {
      "Authorization": `Bearer ${githubToken}`,
      "User-Agent": "Obstacle-Car-Feedback-Worker",
      "Accept": "application/vnd.github.v3+json"
    };

    // 5. Fetch Existing Database File from GitHub
    let existingList = [];
    let fileSha = null;

    try {
      const getRes = await fetch(githubApiUrl, { headers: ghHeaders });
      if (getRes.status === 200) {
        const fileData = await getRes.json();
        fileSha = fileData.sha;
        // GitHub sends base64 content with possible newlines
        const rawContent = atob(fileData.content.replace(/\s/g, ''));
        const decodedText = decodeURIComponent(escape(rawContent));
        existingList = JSON.parse(decodedText);
        if (!Array.isArray(existingList)) existingList = [];
      } else if (getRes.status === 404) {
        // File does not exist yet; will create new
        existingList = [];
      } else {
        const errText = await getRes.text();
        return new Response(JSON.stringify({ error: `GitHub API error fetching database: ${errText}` }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: `Network error reaching GitHub: ${err.message}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 6. Create New Feedback Entry
    const newFeedback = {
      id: "fb_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      name: name,
      role: role,
      message: message,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      timestamp: Date.now()
    };

    // Prepend new feedback so newest appears first
    existingList.unshift(newFeedback);

    // 7. Commit Updated Database to GitHub
    const updatedJsonString = JSON.stringify(existingList, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(updatedJsonString)));

    const putBody = {
      message: `Add visitor feedback from ${name} [skip ci]`,
      content: base64Content,
      branch: branch
    };
    if (fileSha) {
      putBody.sha = fileSha;
    }

    try {
      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: "PUT",
        headers: { ...ghHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(putBody)
      });

      if (!putRes.ok) {
        const ghErr = await putRes.text();
        return new Response(JSON.stringify({ error: `Failed to commit to GitHub: ${ghErr}` }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({ success: true, feedback: newFeedback }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: `Error saving feedback to GitHub: ${err.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
