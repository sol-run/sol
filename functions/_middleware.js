export default {
  async fetch(request, env, ctx) {
    // This middleware allows Cloudflare Pages to handle dynamic routes
    return await env.ASSETS.fetch(request)
  },
}
