import { type NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();
  let eventCount = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
