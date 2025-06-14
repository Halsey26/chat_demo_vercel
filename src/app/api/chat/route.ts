// Archivo: src/app/chat/route.ts
import { openai } from "@ai-sdk/openai";
import {  
  streamText, 
  createDataStreamResponse, 
  Message 
} from "ai";

// Opcional: límite de streaming en segundos
export const maxDuration = 30;

export async function POST(req: Request) {
  // Recibimos solo los mensajes de la petición
  const { messages }: { messages: Message[] } = await req.json();

  return createDataStreamResponse({
    execute: async (dataStream) => {
      // Llamamos directamente al modelo y dejamos que gestione el streaming
      const result = streamText({
        model: openai("gpt-4o-mini"),
        messages,
      });

      // Fusionamos la respuesta en el stream
      result.mergeIntoDataStream(dataStream);
    },
  });
}
