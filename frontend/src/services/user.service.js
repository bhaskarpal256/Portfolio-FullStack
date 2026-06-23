import { api } from "./api.js";

export const updateAccountDetails = (data) => 
    api.patch("/me", data);

export const changeCurrentPassword = (data) => 
    api.patch("/me/change-password", data);

export const updateUserAvatar = (data) => 
    api.patch("/me/update-avatar", data);





