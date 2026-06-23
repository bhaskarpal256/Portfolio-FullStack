import { api } from "./api.js"

export const sendMessage = (data) => 
    api.post("/public/message", data);

export const getAllMessages = () => 
    api.get("/messages");

export const markMessageAsRead = (id) => 
    api.patch(`/messages/${id}/read`);

export const deleteMessage = (id) =>
  api.delete(`/messages/${id}`);