import toast from "react-hot-toast";

export const showSuccess = (message, id) => { return toast.success(message, id ? {id} : {}) }

export const showError = (error, id) => { 
    const message = typeof error === "string" ? error : error.response?.data?.message || "Something went wrong";
    return toast.error(message, id ? {id} : {})  }

export const showLoading = (message) => { return toast.loading(message) }