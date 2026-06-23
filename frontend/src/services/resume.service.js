import { api } from "./api.js"

export const updateResume = (data) => 
    api.patch("/resume", data);

export const resumePdfUpdate = (data) => 
    api.patch("/resume/update-pdf", data);

export const getResume = () => 
    api.get("/resume");

