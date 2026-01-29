import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './app/helper/jwtToken';

export async function middleware(request: NextRequest) {
  const protectedPaths = ['/cart'];
  const adminPaths = ['/admin'];
  
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );
  const isAdminPath = adminPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  const publicPaths = ['/home', '/login', '/register'];
  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  const token = request.cookies.get('auth-token')?.value;

  let isAuthenticated = false;
  let userRole = null; 


  if (token) {
    try {
      const user = await verifyToken(token);      
      isAuthenticated = true;
      userRole = user.role; 
    } catch (error) {
      isAuthenticated = false;
    }
  }

  let adminAndMod;

  if (userRole === "admin" || userRole === "moderator") {
    adminAndMod = true;
  } else {
    adminAndMod = false;
  }
  


  if (isAdminPath && !adminAndMod) {
    return NextResponse.redirect(new URL('/home', request.url));
  }



  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicPath && isAuthenticated) {
 
    // if (userRole === 'admin' && request.nextUrl.pathname !== '/admin') {
    //   return NextResponse.redirect(new URL('/admin', request.url));
    // }

  }

  if (request.nextUrl.pathname === '/' && isAuthenticated) {
    let redirectUrl = '/home';
    if (adminAndMod) {
      redirectUrl = "/admin"
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } else {
      redirectUrl === '/home'
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }
  

  if (request.nextUrl.pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  if (request.nextUrl.pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  if (request.nextUrl.pathname === '/register' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/login', '/register', '/', '/admin/:path*', '/cart'],
};