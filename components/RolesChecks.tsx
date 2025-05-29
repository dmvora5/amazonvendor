import { getSession, signOut } from "next-auth/react";
import { useEffect } from "react";

const RolesChecks = ({ access }: { access: string }) => {


    useEffect(() => {
        (async () => {
            const session: any = await getSession();
            if (!session?.user?.is_superuser && !session?.user[access]) {
                await signOut({
                    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
                })
            }
        })()
    }, [])

    return <></>
}

export default RolesChecks