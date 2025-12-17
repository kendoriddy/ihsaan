import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Note: Since authentication uses localStorage (client-side only),
  // we cannot check authentication in middleware. The client-side
  // RequireAuth component and admin layout will handle protection.
  // This middleware is kept for potential future server-side auth implementation.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

