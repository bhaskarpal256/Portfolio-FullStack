import { api } from "./api.js";

export const getSkills = () => 
    api.get("/skills");

export const createSkill = (data) => 
    api.post("/skills", data); 

export const updateSkill = (id, data) => 
    api.patch(`/skills/${id}`, data);

export const deleteSkill = (id) => 
    api.delete(`/skills/${id}`);
