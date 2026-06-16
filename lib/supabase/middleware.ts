import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isAccountRoute = pathname.startsWith("/account");
    const isLoginRoute = pathname.startsWith("/account/login");
    const isProPortalRoute =
      pathname.startsWith("/pro/dashboard") ||
      pathname.startsWith("/pro/orders") ||
      pathname.startsWith("/pro/quotes") ||
      pathname.startsWith("/pro/samples") ||
      pathname.startsWith("/pro/pricing");

    if (isAccountRoute && !isLoginRoute && !user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/account/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (isLoginRoute && user) {
      return NextResponse.redirect(new URL("/account/orders", request.url));
    }

    if (isProPortalRoute && !user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/account/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  } catch {
    return supabaseResponse;
  }

  return supabaseResponse;
}
