import { NextResponse } from 'next/server'

export function middleware(request) {
    // For now, just pass through - auth check done on client side
    return NextResponse.next()
}

export const config = {
    matcher: []
}
