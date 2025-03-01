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


function findFirstStringError(value: any): string | undefined {
    if (typeof value === "string") {
      return value;
    }
  
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = findFirstStringError(item);
        if (found) {
          return found;
        }
      }
      return undefined;
    }
  
    if (value && typeof value === "object") {
      for (const key of Object.keys(value)) {
        const found = findFirstStringError(value[key]);
        if (found) {
          return found;
        }
      }
      return undefined;
    }
  
    return undefined;
  }
  
  export function parseAndShowErrorInToast(error: unknown) {
    let message: string | undefined;
  
    // 1) If it's a standard Error object, use its message.
    if (error instanceof Error) {
      message = error.message;
    } 
    // 2) If it's a string, that's our message.
    else if (typeof error === "string") {
      message = error;
    } 

    else {
      const data = (error && typeof error === "object" && "data" in error)
        ? (error as any).data
        : error;
  
      message = findFirstStringError(data);
    }
  
    // 4) Show the first found string or a generic fallback.
    toast.error(message || "Something went wrong");
  
    // Optional: log for debugging
    console.log("parseAndShowErrorInToast -> error:", error);
  }
  