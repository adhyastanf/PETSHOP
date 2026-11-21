/**
 * Removes auth tokens from a backend auth response before it is returned to the browser.
 *
 * Tokens are delivered only as httpOnly cookies by the Next.js route handlers.
 * Returning them in the JSON body would make them readable by client-side JavaScript
 * (and by any XSS payload), which defeats the purpose of httpOnly cookies.
 */
export function withoutTokens(data: unknown): unknown {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accessToken, refreshToken, ...safe } = data as Record<string, unknown>;
  return safe;
}
