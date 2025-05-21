import { getAssetFromKV } from "@cloudflare/kv-asset-handler"

/**
 * The DEBUG flag will do two things:
 * 1. We will skip caching on the edge, which makes it easier to debug
 * 2. We will return an error message on exception in your Response
 */
const DEBUG = false

/**
 * Handle requests to your domain
 */
async function handleRequest(event) {
  try {
    // Get the static asset from KV
    const options = {}
    if (DEBUG) {
      options.cacheControl = {
        bypassCache: true,
      }
    }

    const page = await getAssetFromKV(event, options)

    // Allow headers to be altered
    const response = new Response(page.body, page)

    // Add security headers
    response.headers.set("X-XSS-Protection", "1; mode=block")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self'; connect-src 'self' https:;",
    )

    return response
  } catch (e) {
    // If an error is thrown, handle it
    if (DEBUG) {
      return new Response(e.message || e.toString(), {
        status: 500,
      })
    }

    // Otherwise, serve the 404 page
    try {
      const notFoundResponse = await getAssetFromKV(event, {
        mapRequestToAsset: (req) => new Request(`${new URL(req.url).origin}/404.html`, req),
      })

      return new Response(notFoundResponse.body, {
        ...notFoundResponse,
        status: 404,
      })
    } catch (e) {
      return new Response("Not Found", { status: 404 })
    }
  }
}

/**
 * Handle all requests to your domain
 */
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event))
})
