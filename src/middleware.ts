import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export default withAuth(
  async function middleware(request) {
    const pathname = request.nextUrl.pathname;

    const isLoggedInUser = await getToken({ req: request });

    const authPages = ["/auth/login"];
    const sensitivePages = ["/dashboard"];
    const isAuthPage = authPages.some((route) => route === pathname);
    const isSensitivePage = sensitivePages.some((route) =>
      pathname.startsWith(route)
    );

    if (isLoggedInUser && isAuthPage)
      return NextResponse.redirect(new URL("/dashboard", request.url));
    else if (!isLoggedInUser && isSensitivePage)
      return NextResponse.redirect(new URL("/auth/login", request.url));
    else if (pathname === "/")
      return NextResponse.redirect(new URL("/dashboard", request.url));
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/auth/login", "/dashboard/:path*"],
};
