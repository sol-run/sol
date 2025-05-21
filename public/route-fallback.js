// This script helps handle client-side routing for static exports
;(() => {
  // Check if this is a direct page load or a client-side navigation
  if (window.location.pathname.indexOf(".") === -1) {
    // Get the current path
    const path = window.location.pathname

    // If the path doesn't end with a slash and doesn't contain a file extension
    if (!path.endsWith("/") && path.indexOf(".") === -1) {
      // Redirect to the same path with a trailing slash
      window.location.replace(path + "/")
    }
  }
})()
