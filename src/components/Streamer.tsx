import React, { useState } from 'react'

const Streamer = () => {
  const [data, setData] = useState<string[]>([])
  const [error, setError] = useState('')

  const fetchDataStream = async () => {
    try {
      const response = await fetch('/api/chat', { cache: 'no-store' })
      console.log('Response:', response)
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      const processStream = async () => {
        let result
        do {
          result = await reader.read()
          console.log('Result in do while loop:', result)
          if (!result.done) {
            const chunk = decoder.decode(result.value, { stream: true })
            console.log('Chunk received:', chunk)
            // Process JSON chunk if necessary, this assumes the server sends valid JSON per chunk
            setData((prevData) => [...prevData, chunk])
          }
        } while (!result.done)

        console.log('Stream completed')
      }

      processStream()
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to fetch data stream.')
    }
  }

  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <h2 className='text-xl font-bold'>Data stream with fetch</h2>
      <button
        onClick={() => fetchDataStream()}
        className='bg-blue-800 text-white py-1 px-3 rounded-lg'
      >
        Start streaming
      </button>
      {error && <p>Error: {error}</p>}
      <ul className='flex flex-col justify-center items-center'>
        {data &&
          data.map((dataItem: string, index: number) => (
            <li key={index}>{dataItem}</li>
          ))}
      </ul>
    </div>
  )
}

export default Streamer
