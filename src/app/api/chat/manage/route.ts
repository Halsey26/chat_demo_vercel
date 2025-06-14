import { NextRequest, NextResponse } from "next/server";
import {
  createChat,
  getChat,
  updateChatMessages,
  deleteChat,
  clearChatMessages,
  getAllChats,
} from "./actions";

// Endpoint para crear o gestionar chats
export async function POST(request: NextRequest) {
  try {
    const { action, chatId, title, messages, email } = await request.json();
    
    // Verificar si hay email (obligatorio para operaciones de usuario)
    if (!email && (action === "create" || action === "getAll")) {
      return NextResponse.json(
        {
          success: false,
          error: "Se requiere un correo electrónico para esta operación"
        },
        { status: 400 }
      );
    }

    switch (action) {
      case "create":
        const createResult = await createChat(title, messages || [], "private", email);
        return NextResponse.json(createResult);

      case "get":
        const getResult = await getChat(chatId);
        return NextResponse.json(getResult);

      case "update":
        const updateResult = await updateChatMessages(chatId, messages);
        return NextResponse.json(updateResult);

      case "delete":
        const deleteResult = await deleteChat(chatId);
        return NextResponse.json(deleteResult);

      case "clear":
        const clearResult = await clearChatMessages(chatId);
        return NextResponse.json(clearResult);
      case "getAll":
        const getAllResult = await getAllChats(email);
        return NextResponse.json(getAllResult);

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Acción no válida",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error en endpoint de gestión de chat:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error en la gestión del chat",
      },
      { status: 500 }
    );
  }
}
