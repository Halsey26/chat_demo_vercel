import { Message } from "ai";

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  visibility: "public" | "private";
  email?: string;
  createdAt: Date;
};

const chats = new Map<string, Chat>();

// Crear un nuevo chat
export async function createChat(
  title: string,
  messages: Message[],
  visibility: "public" | "private" = "private",
  email?: string
) {
  try {
    const id = crypto.randomUUID();
    const chat: Chat = {
      id,
      title,
      messages,
      visibility,
      email,
      createdAt: new Date(),
    };
    chats.set(id, chat);
    return { success: true, chat };
  } catch (error) {
    console.error("Error creando chat:", error);
    return { success: false, error: "Error al crear el chat" };
  }
}

// Obtener un chat por ID
export async function getChat(chatId: string) {
  try {
    const chat = chats.get(chatId);
    if (!chat) {
      return { success: false, error: `Chat con ID ${chatId} no encontrado` };
    }

    chat.messages.sort((a, b) => {
      const aTime = a.createdAt?.getTime() || 0;
      const bTime = b.createdAt?.getTime() || 0;
      return aTime - bTime;
    });

    return { success: true, chat };
  } catch (error) {
    console.error("Error obteniendo chat:", error);
    return { success: false, error: "Error al obtener el chat" };
  }
}

// Actualizar los mensajes de un chat
export async function updateChatMessages(chatId: string, messages: Message[]) {
  try {
    const chat = chats.get(chatId);
    if (!chat) {
      return { success: false, error: "Chat no encontrado" };
    }
    chat.messages = messages;
    return { success: true };
  } catch (error) {
    console.error("Error actualizando mensajes:", error);
    return { success: false, error: "Error al actualizar los mensajes" };
  }
}

// Eliminar un chat
export async function deleteChat(chatId: string) {
  try {
    chats.delete(chatId);
    return { success: true };
  } catch (error) {
    console.error("Error eliminando chat:", error);
    return { success: false, error: "Error al eliminar el chat" };
  }
}

// Limpiar mensajes de un chat
export async function clearChatMessages(chatId: string) {
  try {
    const chat = chats.get(chatId);
    if (chat) {
      chat.messages = [];
    }
    return { success: true };
  } catch (error) {
    console.error("Error limpiando mensajes:", error);
    return { success: false, error: "Error al limpiar los mensajes" };
  }
}

// Obtener todos los chats (opcionalmente filtrado por email)
export async function getAllChats(email?: string) {
  try {
    const allChats = Array.from(chats.values());
    const filtered = email
      ? allChats.filter((chat) => chat.email === email)
      : allChats;

    return { success: true, chats: filtered };
  } catch (error) {
    console.error("Error obteniendo todos los chats:", error);
    return { success: false, error: "Error al obtener todos los chats" };
  }
}
