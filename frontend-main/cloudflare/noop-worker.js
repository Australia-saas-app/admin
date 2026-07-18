/**
 * No-op Cloudflare Worker.
 * This project is hosted on a GCP VM (Docker), not Cloudflare Workers.
 * This file exists so Cloudflare Workers Builds / `wrangler deploy` succeed
 * instead of failing on a missing OpenNext output path.
 *
 * Disconnect Workers Builds in the Cloudflare dashboard to remove the GitHub check entirely:
 * Workers & Pages → frontend → Settings → Builds → Disconnect
 */
export default {
  async fetch() {
    return new Response(
      [
        "System DB frontend is hosted on Google Cloud (Compute Engine / Docker).",
        "This Cloudflare Worker is intentionally a no-op placeholder.",
        "Disconnect Workers Builds in the Cloudflare dashboard if you are not using Cloudflare hosting.",
      ].join("\n"),
      {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8" },
      }
    );
  },
};
