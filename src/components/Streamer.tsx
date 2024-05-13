// components/Streamer.tsx
'use client'

import React, { useState } from 'react'

const Streamer: React.FC = () => {
  const [data, setData] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  const startStreaming = () => {
    const eventSource = new EventSource('/api/chat')

    eventSource.onmessage = (event) => {
      const newEvent = JSON.parse(event.data)
      if (newEvent.message === 'Stream completed') {
        eventSource.close()
      } else {
        setData((prevData) => [...prevData, newEvent.message])
      }
    }

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err)
      setError('Failed to fetch data stream.')
      eventSource.close()
    }
  }

  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <h2 className='text-xl font-bold'>Data stream with EventSource</h2>
      <button
        onClick={startStreaming}
        className='bg-blue-800 text-white py-1 px-3 rounded-lg'
      >
        Start streaming
      </button>
      {error && <p>Error: {error}</p>}
      <ul className='flex flex-col justify-center items-center'>
        {data.map((dataItem, index) => (
          <li key={index}>{dataItem}</li>
        ))}
      </ul>
    </div>
  )
}

export default Streamer
