// app/api/stream/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = async (data: Record<string, any>) => {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  sendEvent({ message: 'Stream started' });

  const intervalId = setInterval(() => {
    sendEvent({ message: 'Streaming data...', time: new Date().toISOString() });
  }, 2000);

  req.signal.addEventListener('abort', () => {
    clearInterval(intervalId);
    writer.close();
  });

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Content-Encoding': 'none',
    },
  });
}
