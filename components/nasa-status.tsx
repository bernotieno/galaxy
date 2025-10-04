"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Satellite, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface NASAStatusProps {
  onAuthenticate?: (username: string, password: string) => Promise<boolean>
}

export function NASAStatus({ onAuthenticate }: NASAStatusProps) {
  const [status, setStatus] = useState<'unknown' | 'authenticated' | 'failed' | 'loading'>('unknown')
  const [showCredentials, setShowCredentials] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const checkAuthStatus = async () => {
    setStatus('loading')
    try {
      // Check if NASA API is authenticated
      const response = await fetch('/api/nasa/status')
      if (response.ok) {
        const data = await response.json()
        setStatus(data.authenticated ? 'authenticated' : 'failed')
      } else {
        setStatus('failed')
      }
    } catch (error) {
      console.error('Error checking NASA API status:', error)
      setStatus('failed')
    }
  }

  const handleAuthenticate = async () => {
    if (!username || !password) return

    setStatus('loading')
    try {
      if (onAuthenticate) {
        const success = await onAuthenticate(username, password)
        setStatus(success ? 'authenticated' : 'failed')
        if (success) {
          setShowCredentials(false)
          setPassword('') // Clear password for security
        }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setStatus('failed')
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'authenticated':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'loading':
        return <AlertCircle className="w-4 h-4 text-yellow-500 animate-pulse" />
      default:
        return <Satellite className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'authenticated':
        return <Badge variant="success" className="bg-green-100 text-green-800">Connected</Badge>
      case 'failed':
        return <Badge variant="destructive">Disconnected</Badge>
      case 'loading':
        return <Badge variant="secondary">Connecting...</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          NASA API Status
        </CardTitle>
        <CardDescription>
          Real-time Earth observation data connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Connection Status:</span>
          {getStatusBadge()}
        </div>

        {status === 'failed' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              NASA API authentication failed. Real data unavailable - using mock data.
            </AlertDescription>
          </Alert>
        )}

        {status === 'authenticated' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Connected to NASA APIs. Using real satellite data.
            </AlertDescription>
          </Alert>
        )}

        {(status === 'failed' || status === 'unknown') && !showCredentials && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCredentials(true)}
            className="w-full"
          >
            <Satellite className="w-4 h-4 mr-2" />
            Connect to NASA APIs
          </Button>
        )}

        {showCredentials && (
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                NASA Earthdata Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Enter your username"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                NASA Earthdata Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAuthenticate}
                disabled={!username || !password || status === 'loading'}
                className="flex-1"
              >
                {status === 'loading' ? 'Connecting...' : 'Connect'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCredentials(false)
                  setPassword('')
                }}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Need an account?{' '}
              <a
                href="https://urs.earthdata.nasa.gov/users/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Sign up for NASA Earthdata
              </a>
            </p>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={checkAuthStatus}
          className="w-full text-xs"
        >
          Refresh Status
        </Button>
      </CardContent>
    </Card>
  )
}