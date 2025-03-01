'use client';

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import { showErrorInToast } from "@/utils";
import { useRouter } from "next/navigation";
import { PAGE_ROUTES } from "@/constant/routes";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { userApi } from "@/redux/apis/usersApis";


export default function LoginPage() {


  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    (async () => {
      const session: any = await getSession();
      if (session && session.user?.is_superuser) {
        router.push(PAGE_ROUTES.SUPERADMIN.ALLUSERS);
      }
    })()
  }, [])

  const formSchema = z.object({
    // fullName: z.string({ message: "fullName mustbe a string" }).min(2, { message: "fullName must be at least 2 characters long" }),
    email: z.string({ message: "email must be a string" }).email({ message: "email must be a valid email" }),
    password: z.string({ message: "password must be a string" }).min(8, { message: "password must be at least 8 characters long" }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setLoading(true)
    try {
      const res: any = await signIn('credentials', {
        email: values?.email,
        password: values?.password,
        redirect: false
      })

      if (!res?.ok) {
        return showErrorInToast(res);
      }

      if (res && res.ok) {
        const session: any = await getSession();
        toast.success("Login sussfully!");
        //change in future
        if (session?.user?.is_superuser) {
          dispatch(userApi.util.invalidateTags(["Auth"] as any));
          router.push(PAGE_ROUTES.SUPERADMIN.ALLUSERS)
        }
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    // <div className="flex h-screen w-screen items-center justify-center bg-gray-100 p-4">
    <div className="grid w-full h-screen grid-cols-1 md:grid-cols-5 bg-white shadow-lg overflow-hidden rounded-xl">
      <div className="hidden md:flex items-center justify-center bg-gray-200 p-8 md:col-span-3">
        <img
          src="/images/man-with-laptop.png"
          alt="Image"
          className="w-3/4 object-contain"
        />
      </div>
      <div className="flex flex-col justify-center w-full h-full md:col-span-2 max-w-lg mx-auto bg-white rounded-xl">
        <h2 className="text-4xl font-extrabold text-center text-brand">Welcome</h2>
        <p className="text-center text-gray-600 mb-6 text-lg">Login to Your Account</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="h-24">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-light">Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} id="email" type="email" placeholder="Enter Email Address" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="h-24">
              <div className="relative">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-light">Password</FormLabel>
                      <FormControl>
                        <Input {...field} id="password" type={showPassword ? "text" : "password"} placeholder="Enter Password" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm pr-10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 top-8 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-6 h-6 text-gray-500" /> : <Eye className="w-6 h-6 text-gray-500" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-base">
              <div className="flex items-center space-x-2">

              </div>
              <Link href="/forget-password" className="text-green-600 hover:underline text-sm">Forgot Password?</Link>
            </div>
            <Button disabled={loading} type="submit" className="w-full h-14 bg-brand hover:bg-brand-100 text-xl font-semibold rounded-lg shadow-md">
              {loading ? (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              ) : "Log In"}
            </Button>
          </form>
        </Form>


      </div>
    </div>
    // </div>
  );
}
