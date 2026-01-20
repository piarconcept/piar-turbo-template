import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["es", "ca", "en"],
  defaultLocale: "ca",
  localeDetection: true
});

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"]
};