// This script handles client-side navigation for dynamic routes
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on a 404 page that might be a dynamic route
  if (document.title.includes("404") || document.body.innerHTML.includes("Page Not Found")) {
    const path = window.location.pathname

    // Extract potential dynamic route patterns
    const blogPostMatch = path.match(/\/blog\/(\d+)/)
    const productMatch = path.match(/\/product\/(\d+)/)
    const creatorMatch = path.match(/\/creator\/([^/]+)/)

    // Redirect to data fetching page if it's a known dynamic route
    if (blogPostMatch || productMatch || creatorMatch) {
      const dynamicSegment = blogPostMatch?.[1] || productMatch?.[1] || creatorMatch?.[1]
      const routeType = blogPostMatch ? "blog" : productMatch ? "product" : "creator"

      // Redirect to a client-side data fetching page
      window.location.href = `/dynamic-route.html?type=${routeType}&id=${dynamicSegment}`
    }
  }
})
