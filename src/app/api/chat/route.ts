import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest, response:NextResponse) {
    try {
       console.log("Client connected for events");
        // Set headers for SSE
        const headers = new Headers({
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        });
        let i = 0;
    
        // This function creates a ReadableStream that pushes an event every second
        const stream = new ReadableStream({
          start(controller) {
            const pushEvent = () => {
              const data = `data: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`;
              if (i < 5) {
                controller.enqueue(new TextEncoder().encode(data));
              }
              if (i == 5){
                clearInterval(intervalId);
                controller.close();
              }
              i += 1
              console.log("Event sent: " + data);
            };
    
    
            const intervalId = setInterval(pushEvent, 1000);
    
            // When the client closes connection, clean up
            request.signal.addEventListener('abort', () => {
              clearInterval(intervalId);
              controller.close();
              console.log("Client disconnected");
            });
          }
        });
    
        return new NextResponse(stream, { headers });
      } catch (error) {
        console.log(`Error in setting up event stream`);
        return new NextResponse("Failed to setup event stream", { status: 500 });
      }
    
}