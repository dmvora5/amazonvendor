import { toast } from "react-toastify";




export const showErrorInToast = (response: any) => {
    if(response?.error) {
        const parsedError = JSON.parse(response.error);
        if(parsedError?.details) {
           return toast.error(parsedError.details[0]);
        }
    }

    toast.error("Error not handled yet")
}