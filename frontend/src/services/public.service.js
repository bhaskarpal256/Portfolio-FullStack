import { api } from "./api.js"

export const getPublicPortfolio = () => 
    api.get("/public");

