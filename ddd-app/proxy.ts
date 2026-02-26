import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Set visitor_id cookie if not already set
  if (!request.cookies.get('visitor_id')) {
    const visitorId = crypto.randomUUID()
    response.cookies.set('visitor_id', visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
