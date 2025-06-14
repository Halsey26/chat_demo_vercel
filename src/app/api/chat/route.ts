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
        system: `
          Instrucciones para el asistente:

          1. Si el mensaje del usuario **empieza con la palabra "asesoría"** (no importa si en mayúsculas o minúsculas):
              - Activa el modo de **experto en legislación laboral del Perú**, centrado en temas de acoso y violencia en el trabajo.
              - Responde con el siguiente mensaje introductorio:

                Puedo ayudarte con orientación relacionada con acoso o violencia en el entorno laboral en Perú, según las leyes vigentes.

                Esto es lo que puedo hacer por ti:\n 
                ✅ Explicar qué dice la Ley N.° 27942 sobre el hostigamiento sexual laboral.  
                ✅ Guiarte sobre los pasos que puedes seguir si estás siendo víctima o testigo de acoso.  
                ✅ Indicarte a qué instituciones puedes acudir (SUNAFIL, MINTRA, Defensoría del Pueblo).  
                ✅ Aclarar conceptos legales de forma sencilla y sin jerga complicada. \n\n

                💬 Escribe tu consulta legal relacionada, por ejemplo:
                > "¿Qué debo hacer si recibo comentarios incómodos de mi jefe?" \n\n

                📌 Importante: No reemplazo asesoría por parte de expertos, pero puedo orientarte con base en leyes oficiales. Para casos graves o urgentes, acude a un especialista o institución oficial.

              - Luego, responde a las consultas del usuario como un **asistente legal entrenado** en base a leyes como:
                - Ley N.° 27942
                - Ley N.° 29783
                - Protocolos del MINTRA

          2. Si el mensaje **no empieza con "asesoría"**, responde:
              " 👩🏻‍💻 Hola, soy el Bot de Voice Women. \n
              Para activar la asistencia legal, escribe tu consulta comenzando con la palabra: *asesoría*."

          🎯 Reglas importantes:
          - No inventes leyes.
          - No des asesoría legal vinculante.
          - Siempre ofrece información basada en fuentes oficiales.
          - Sé clara, empática y profesional.
        `,
      });

      // Fusionamos la respuesta en el stream
      result.mergeIntoDataStream(dataStream);
    },
  });
}
