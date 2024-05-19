# This is a Next.js demo application with a streaming UI

Create a streaming UI similar to a generative AI application (example: ChatGPT)
with event source in the frontend.

## Implementing API route for streaming data:

```
    import { type NextRequest, NextResponse } from "next/server";

    export const runtime = "edge";

    export async function GET(req: NextRequest) {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();
      let eventCount = 0;

      const sendEvent = async (data: Record<string, any>) => {
        writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      sendEvent({ message: "Stream started" });

      const intervalId = setInterval(() => {
        if (eventCount < 5) {
          sendEvent({ message: `Streaming data: ${eventCount}`, time: new Date().toISOString() });
          eventCount++;
        }
        else if (eventCount === 5) {
            sendEvent({ message: `Stopping the stream now`, time: new Date().toISOString() });
            eventCount++;
          } 

        else {
          clearInterval(intervalId);
          sendEvent({ message: "Stream completed" });
          writer.close();
        }
      }, 2000);

      req.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
        writer.close();
      });

      return new NextResponse(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Content-Encoding": "none",
        },
      });
    }
```

## Implementing a React component for streaming UI:

```
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
```

