import { api } from "./api.js";

export const createProject = (data) =>
    api.post("/projects", data);

export const updateProjectdetails = (id, data) =>
    api.patch(`/projects/${id}`, data);

export const updateProjectImage = (id, data) =>
    api.patch(`/projects/${id}/image`, data);

export const deleteProject = (id) =>
    api.delete(`/projects/${id}`);

export const getProjects = () => 
    api.get("/projects");

export const getProjectById = (id) => 
    api.get(`/projects/${id}`);