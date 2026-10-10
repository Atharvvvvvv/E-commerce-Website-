import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const pathname = nextUrl.pathname;

      const isAdminRoute = pathname.startsWith("/admin");
      const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

      if (isAdminRoute) {
        if (!isLoggedIn) {
          const redirectUrl = new URL("/login", nextUrl);
          redirectUrl.searchParams.set("callbackUrl", pathname);
          return Response.redirect(redirectUrl);
        }
        if (role !== "ADMIN") {
          // Non-admin logged in user attempting to access admin section
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (isAuthRoute && isLoggedIn) {
        // Logged-in users visiting /login or /register are redirected to home
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
  providers: [], // Configured with Credentials in auth.ts
} satisfies NextAuthConfig;
