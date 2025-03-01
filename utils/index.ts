import { toast } from "react-toastify";




export const showErrorInToast = (response: any) => {
    if (response?.error) {
        const parsedError = JSON.parse(response.error);
        if (parsedError?.details) {
            return toast.error(parsedError.details[0]);
        }
    }

    toast.error("Error not handled yet")
}


export const parseAndShowErrorInToast = (error: any) => {
    if (error?.data?.detail) {
        if (Array.isArray(error.data?.detail)) {
            return toast.error(error.data.detail.at(0));
        }
        return toast.error(error.data.detail);
    }

    if (error?.data?.details) {
        if (Array.isArray(error.data?.details)) {
            return toast.error(error.data.details.at(0));
        }
        return toast.error(error.data.details);
    }
    if (error?.data?.password) {
        if (Array.isArray(error.data?.password)) {
            return toast.error(error.data.password.at(0));
        }
        return toast.error(error.data.password);
    }

    if(error.data?.non_field_errors) {
        if (Array.isArray(error.data?.non_field_errors)){
            return toast.error(error.data.non_field_errors.at(0));
        }
        return toast.error(error.data.non_field_errors);
    }

    if(error.data?.message) {
        if (Array.isArray(error.data?.message)){
            return toast.error(error.data.message.at(0));
        }
        return toast.error(error.data.message);
    }

    console.log('error', error);
    return toast.error("something went wrong");
}