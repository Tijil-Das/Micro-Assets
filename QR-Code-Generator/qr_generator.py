#!/usr/bin/env python3
"""
QR Code Generator CLI
Micro-Assets (https://github.com/Tijil-Das/Micro-Assets)

Generates clean, production-ready QR codes from arbitrary text or URL input.
Simultaneously exports:
  1. An infinitely scalable vector SVG (.svg)
  2. An ultra-sharp, high-resolution (300 DPI) JPEG (.jpg)

Guaranteed to save output files strictly in this tool's directory.
"""

import argparse
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Enforce output directory strictly to this script's directory
TOOL_DIR = Path(__file__).resolve().parent


def sanitize_filename(name: str) -> str:
    """Strip illegal filename characters and any user-supplied extension."""
    clean = re.sub(r'[<>:"/\\|?*]', "", name.strip())
    # Remove common image extensions if typed by the user
    for ext in (".svg", ".jpg", ".jpeg", ".png"):
        if clean.lower().endswith(ext):
            clean = clean[: -len(ext)]
    return clean or "qrcode"


def generate_qr(text: str, base_filename: str = "qrcode") -> tuple[Path, Path]:
    """Generate both SVG and high-resolution JPG in the tool directory."""
    try:
        import qrcode
        import qrcode.constants
        import qrcode.image.svg
        from PIL import Image
    except ImportError as e:
        print("\n[ERROR] Missing required dependencies.")
        print("Please install requirements using:")
        print("    pip install -r requirements.txt\n")
        raise e

    safe_name = sanitize_filename(base_filename)
    svg_path = TOOL_DIR / f"{safe_name}.svg"
    jpg_path = TOOL_DIR / f"{safe_name}.jpg"

    # 1. Create QR with High Error Correction (H ~30% recovery)
    qr = qrcode.QRCode(
        version=None,  # Auto-fit version based on text length
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=60,  # Generates ~2400-3000px base image
        border=4,     # Standard 4-module quiet zone
    )
    qr.add_data(text)
    qr.make(fit=True)

    # 2. Render and save Vector SVG (Single-path, zero loss)
    svg_factory = qrcode.image.svg.SvgPathImage
    svg_img = qr.make_image(image_factory=svg_factory)
    with open(svg_path, "wb") as f:
        svg_img.save(f)

    # 3. Render and save High-Resolution 300 DPI JPG
    pil_img = qr.make_image(fill_color="black", back_color="white")
    pil_img = pil_img.convert("RGB")

    # Ensure minimum 2400x2400 resolution using integer scaling with Nearest Neighbor
    width, height = pil_img.size
    min_dim = min(width, height)
    if min_dim < 2400:
        scale_factor = (2400 // min_dim) + (1 if 2400 % min_dim else 0)
        new_size = (width * scale_factor, height * scale_factor)
        pil_img = pil_img.resize(new_size, resample=Image.Resampling.NEAREST)

    pil_img.save(
        jpg_path,
        format="JPEG",
        quality=95,
        dpi=(300, 300),
        subsampling=0,  # 4:4:4 chroma subsampling for crisp edge contrast
    )

    return svg_path, jpg_path


def format_size(num_bytes: int) -> str:
    """Format bytes into readable size."""
    if num_bytes < 1024:
        return f"{num_bytes} B"
    elif num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.1f} KB"
    return f"{num_bytes / (1024 * 1024):.2f} MB"


def main():
    parser = argparse.ArgumentParser(
        description="Micro-Assets QR Code Generator CLI (SVG + High-Res JPG)"
    )
    parser.add_argument(
        "text",
        nargs="?",
        default=None,
        help="Text or URL to encode in the QR code",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=None,
        help="Base filename (without extension, defaults to 'qrcode')",
    )

    args = parser.parse_args()

    print("\n" + "=" * 54)
    print("        Micro-Assets QR Code Generator CLI")
    print("=" * 54)

    text = args.text
    base_name = args.output

    # Interactive input if arguments were not provided
    if not text:
        try:
            print("\nEnter the text or URL to encode:")
            text = input("> ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nOperation cancelled.")
            sys.exit(0)

    if not text:
        print("\n[ERROR] No text provided. Aborting.\n")
        sys.exit(1)

    if not base_name:
        try:
            prompt_name = input("Output filename [press Enter for 'qrcode']: ").strip()
            base_name = prompt_name if prompt_name else "qrcode"
        except (KeyboardInterrupt, EOFError):
            base_name = "qrcode"

    print("\n[*] Generating QR code...")
    try:
        svg_file, jpg_file = generate_qr(text, base_name)
    except Exception as err:
        print(f"\n[ERROR] Failed to generate QR code: {err}")
        sys.exit(1)

    from PIL import Image

    with Image.open(jpg_file) as im:
        jpg_res = f"{im.width} x {im.height} px"

    print("\n[+] Successfully generated QR assets in directory:")
    print(f"    Directory : {TOOL_DIR}\n")
    print(f"    1. Vector SVG   : {svg_file.name}")
    print(f"       - Path       : {svg_file}")
    print(f"       - Type       : Scalable Vector Graphics (Infinite Resolution)")
    print(f"       - Size       : {format_size(svg_file.stat().st_size)}")
    print()
    print(f"    2. High-Res JPG : {jpg_file.name}")
    print(f"       - Path       : {jpg_file}")
    print(f"       - Resolution : {jpg_res} @ 300 DPI (Print Ready)")
    print(f"       - Quality    : 95% JPEG (4:4:4 Chroma)")
    print(f"       - Size       : {format_size(jpg_file.stat().st_size)}")
    print("\n" + "=" * 54 + "\n")


if __name__ == "__main__":
    main()
