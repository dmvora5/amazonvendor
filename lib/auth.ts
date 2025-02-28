import { AuthOptions } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'



export const authOptions: AuthOptions = {
    providers: [
        CredentialProvider({
            name: "Credentials",
            type: "credentials",
            credentials: {},
            async authorize(credentials: any) {
                const { email, password } = credentials

                try {
                    // ** Login API Call to match the user credentials and receive user data in response along with his role
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}users/login/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password })
                    })

                    const data = await res.json()

                    if (![200, 201].includes(res.status)) {
                        throw new Error(JSON.stringify(data))
                    }

                    // if ([200, 201].includes(res.status) && data?.response?.userData?.isEmailVerified === false) {
                    //     throw new Error(JSON.stringify(data))
                    // }

                    if (data?.user && data?.tokens) {
                        return { ...data?.user, access_token: data?.tokens?.access }
                    }

                    return null
                } catch (e: any) {
                    throw new Error(e.message)
                }

            },
        })
    ],
    // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 // ** 30 days
    },
    pages: {
        signIn: '/'
    },
    callbacks: {
        /*
    * While using `jwt` as a strategy, `jwt()` callback will be called before
    * the `session()` callback. So we have to add custom parameters in `token`
    * via `jwt()` callback to make them accessible in the `session()` callback
    */
        async jwt({ token, user, trigger, session }: any) {
            if (user) {

                /*
                 * For adding custom parameters to user in session, we first need to add those parameters
                 * in token which then will be available in the `session()` callback
                 */
                token.name = user.name
                token.is_superuser = user.is_superuser
               

                /**
                 * Custom data: added by Dev
                 * Include access_token and user data for session callback
                 */
                token.access_token = user.access_token
                token.user = user
            }


            // if (trigger === 'update' && session?.user) {
            //     token.user = { ...token.user, ...session?.user }
            // }

            // if (trigger === 'update' && session?.userAccess) {
            //     token.user = { ...session?.userAccess?.user }
            //     token.access_token = session?.userAccess?.access_token

            //     // token.originalAuth = session?.userAccess?.originalAuth

            //     if (!token.originalAuth && session?.userAccess?.originalAuth) {
            //         token.originalAuth = session?.userAccess?.originalAuth
            //     } else if (
            //         token.originalAuth &&
            //         typeof session?.userAccess?.originalAuth !== 'undefined' &&
            //         !session?.userAccess?.originalAuth
            //     ) {
            //         token.originalAuth = undefined
            //     }
            // }

            if (token?.user) {
                const userKeysToKeep = [
                    "email",
                    "first_name",
                    "last_name",
                    "is_superuser"
                ]

                token.user = Object.fromEntries(Object.entries(token?.user)?.filter(([key]) => userKeysToKeep?.includes(key)))
            }

            return token
        },
        async session({ session, token }: any) {
            if (session.user) {
                // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
                // session.user.name = token.name

                /**
                 * Custom data: added by Dev
                 * Include access_token and user data in the session object
                 */
                session.access_token = token.access_token
                session.user = token.user;


                if (token?.originalAuth) {
                    session.originalAuth = token?.originalAuth
                }
            }

            return session
        }

    }
}