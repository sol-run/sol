import { getAssetFromKV } from "@cloudflare/kv-asset-handler"

// Define default options
const defaultOptions = {
  ASSET_NAMESPACE: "__STATIC_CONTENT",
  ASSET_MANIFEST: "__STATIC_CONTENT_MANIFEST",
  cacheControl: {
    browserTTL: 60 * 60 * 24 * 365, // 1 year
    edgeTTL: 60 * 60 * 24 * 7, // 7 days
    bypassCache: false,
  },
  defaultMimeType: "text/html",
}

// Export default function for ES Module format Worker
export default {
  async fetch(request, env, ctx) {
    try {
      // Get the URL from the request
      const url = new URL(request.url)

      // Handle API routes or dynamic routes
      if (url.pathname.startsWith("/api/")) {
        // For API routes, you would implement your API logic here
        return new Response(JSON.stringify({ message: "API route" }), {
          headers: { "Content-Type": "application/json" },
        })
      }

      // Serve static assets from KV
      const options = {
        ...defaultOptions,
        mapRequestToAsset: (req) => {
          // Handle Next.js dynamic routes
          const url = new URL(req.url)

          // If the URL doesn't have a file extension, serve index.html
          if (!url.pathname.includes(".")) {
            url.pathname = "/index.html"
          }

          return new Request(url.toString(), req)
        },
      }

      return await getAssetFromKV(
        {
          request,
          waitUntil: (promise) => ctx.waitUntil(promise),
        },
        options,
      )
    } catch (e) {
      // Return 404 for missing assets
      return new Response("Not Found", { status: 404 })
    }
  },
}
