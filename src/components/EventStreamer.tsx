import React, { useState } from 'react'

const EventStreamer: React.FC = () => {
  const [data, setData] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  const startStreaming = () => {
    const eventSource = new EventSource('/api/stream')

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data)
      console.log(newData)
      setData((prevData) => [...prevData, newData.message])
    }

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error)
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
        {data.map((dataItem: string, index: number) => (
          <li key={index}>{dataItem}</li>
        ))}
      </ul>
    </div>
  )
}

export default EventStreamer
