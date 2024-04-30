import { NextRequest, NextResponse } from "next/server";
import Negotiator from 'negotiator';
import {match} from '@formatjs/intl-localematcher'

const locales = ['en-US', 'zh-CN'];
const defaultLocale = 'en-US';

function getLocale(request: NextRequest) {
  const acceptLanguages = {
    'accept-language': request.headers.get('accept-language') || 'en-US,en;q=0.5',
  };

  const languages = new Negotiator({ headers: acceptLanguages }).languages();


  return match(languages, locales, defaultLocale);
}
 
export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
 
  if (pathnameHasLocale) return;
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
};