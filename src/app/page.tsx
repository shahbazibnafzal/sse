'use client'
import EventStreamer from '@/components/EventStreamer'
import Streamer from '@/components/Streamer'

export default function Home() {
  return (
    <main className='flex justify-center'>
      <div>
        <h1 className='text-2xl font-bold my-2 text-center'>Streaming issue</h1>
        <Streamer />
      </div>
    </main>
  )
}
