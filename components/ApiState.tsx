'use client'

import { parseAndShowErrorInToast } from "@/utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { toast } from "react-toastify";


const ApiContext = createContext({} as any);

const ApiState = ({ error, isSuccess, children, reset }: any) => {
  return (
    <ApiContext.Provider value={{ error, isSuccess, reset }}>
      {children}
    </ApiContext.Provider>
  );
}

ApiState.SuccessMessage = ({ message }: any) => {
  const { isSuccess, reset } = useContext(ApiContext);
  useEffect(() => {
    if (!isSuccess) return;
    toast.success(message);
    if (reset && typeof reset == 'function') {
      reset();
    }
  }, [isSuccess])

  return <></>
}

ApiState.SuccessRedirect = ({ path }: any) => {
  const { isSuccess } = useContext(ApiContext);
  const router = useRouter();

  useEffect(() => {
    if (!isSuccess) return;
    router.push(path);
  }, [isSuccess])

  return <></>;
}

ApiState.Error = () => {

  const { error } = useContext(ApiContext);
  useEffect(() => {
    if (error) {
      parseAndShowErrorInToast(error);
    }
  }, [error])

  return <></>
}


ApiState.SuccessCallback = ({ callback }: any) => {
  const { isSuccess } = useContext(ApiContext);
  useEffect(() => {
    if (!isSuccess || typeof callback !== 'function') return;
    callback();
  }, [isSuccess]);

  return <></>
}

ApiState.ArthorizeCheck = () => {

  const { error } = useContext(ApiContext);
  useEffect(() => {
    if (error?.status !== 401) return;
    (async () => await signOut({
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
    }))()
  }, [error]);
  return <></>
}

export default ApiState