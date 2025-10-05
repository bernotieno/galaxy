import { NextResponse } from 'next/server'
import { nasaAPI } from '@/lib/nasa-api'

export async function GET() {
  try {
    const authenticated = nasaAPI.isAuthenticated()

    return NextResponse.json({
      authenticated,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error checking NASA API status:', error)
    return NextResponse.json(
      {
        authenticated: false,
        error: 'Failed to check authentication status'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const success = await nasaAPI.authenticate(username, password)

    return NextResponse.json({
      authenticated: success,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error authenticating with NASA API:', error)
    return NextResponse.json(
      {
        authenticated: false,
        error: 'Authentication failed'
      },
      { status: 500 }
    )
  }
}