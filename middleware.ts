// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      const protectedPaths = [
        /\/shipping/,
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      const path = req.nextUrl.pathname;
      if (protectedPaths.some((p) => p.test(path))) {
        return !!token;
      }
      return true;
    },
  },
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};