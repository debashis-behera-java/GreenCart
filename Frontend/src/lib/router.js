export function navigate(path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  window.history.pushState({}, "", p);
  window.scrollTo(0, 0);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
export function currentPath() {
  return window.location.pathname || "/";
}
