// app/dashboard/error.tsx
'use client';

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={() => reset()}
        className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
