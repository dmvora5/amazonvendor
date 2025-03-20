'use client';

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForgetPasswordMutation, useResetPasswordMutation } from "@/redux/apis/usersApis";
import { useEffect } from "react";
import { parseAndShowErrorInToast } from "@/utils";

export default function ForgetPasswordForm() {

    const router = useRouter()


    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [responseOtp, setResponseOtp] = useState(false);


    const [forgetPasswordSubmit, forgetPasswordOption] = useForgetPasswordMutation();
    const [resetPasswordSubmit, resetPasswordOption] = useResetPasswordMutation();

    useEffect(() => {
        if (forgetPasswordOption.isSuccess) {
            setResponseOtp(true);
            toast.success("otp sent successfully");
        }
    }, [forgetPasswordOption.isSuccess])

    useEffect(() => {
        if (forgetPasswordOption.error) {
            parseAndShowErrorInToast(forgetPasswordOption.error);
        }
    }, [forgetPasswordOption.error]);

    useEffect(() => {
        (async () => {
            if (resetPasswordOption.isSuccess) {
                toast.success("Password reset successfully");
                await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
                // router.push(PAGE_ROUTES.AUTH.LOGIN);
            }
        })()
    }, [resetPasswordOption.isSuccess])

    useEffect(() => {
        if (resetPasswordOption.error) {
            parseAndShowErrorInToast(resetPasswordOption.error);
        }
    }, [resetPasswordOption.error]);



    const forgetPasswordFormSchema = z.object({
        email: z.string({ message: "email must be a string" }).email({ message: "email must be a valid email" }),
    })

    const forgetPasswordForm = useForm<z.infer<typeof forgetPasswordFormSchema>>({
        resolver: zodResolver(forgetPasswordFormSchema),
        defaultValues: {
            email: "",
        }
    })

    async function sendOtp(values: any) {
        await forgetPasswordSubmit(values)
        // try {
        //     setLoading(true);
        //     console.log(forgetPasswordForm.getValues())
        //     const response = await axiosInstance.post(API_ROUTES.AUTH.FORGETPASSWORD, {
        //         email: values?.email,
        //     })

        //     if (response.status === 200) {
        //         toast.success("otp sent successfully");
        //         setResponseOtp(true);
        //     }

        //     console.log('response', response)
        // } catch (err) {
        //     console.log('err', err)
        //     if (err instanceof AxiosError) {
        //         toast.error(err.response?.data?.detail?.at(0))
        //     }
        // } finally {
        //     setLoading(false);
        // }
    }

    async function forgetPasswordOnSubmit(values: z.infer<typeof forgetPasswordFormSchema>) {
        await sendOtp(values)
    }

    async function resendOtp() {
        await sendOtp(forgetPasswordForm.getValues())
    }


    const resetPasswordFormSchema = z
        .object({
            otp: z.string().min(6, { message: "OTP must be at least 6 digits long" }),
            password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
            confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Passwords do not match",
            path: ["confirmPassword"], // Targets confirmPassword field for error display
        });


    const resetPasswordForm = useForm<z.infer<typeof resetPasswordFormSchema>>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            otp: "",
            password: "",
            confirmPassword: ""
        }
    })

    async function resetPasswordOnSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
        await resetPasswordSubmit({
            code: values.otp,
            email: forgetPasswordForm.getValues()?.email,
            password: values.password,
            confirm_password: values.confirmPassword
        });

        // console.log(values)
        // try {
        //     setLoading(true);
        //     const response = await axiosInstance.post(API_ROUTES.AUTH.RESETPASSWORD, {
        //         code: values.otp,
        //         email: forgetPasswordForm.getValues()?.email,
        //         password: values.password,
        //         confirm_password: values.confirmPassword
        //     });

        //     if (response.status === 201) {
        //         toast.success("Password reset successfully");
        //         router.push(PAGE_ROUTES.AUTH.LOGIN);
        //     }

        // } catch (err) {
        //     if (err instanceof AxiosError) {
        //         console.log('err', err)
        //         toast.error(err.response?.data?.details?.at(0))
        //     }

        // } finally {
        //     setLoading(false);
        // }
    }



    return (
        <div className="grid w-full h-screen grid-cols-1 md:grid-cols-5 bg-white shadow-lg overflow-hidden rounded-xl">
            <div className="hidden md:flex items-center justify-center bg-gray-200 p-8 md:col-span-3">
                <img
                    src="/images/man-with-laptop.png"
                    alt="Image"
                    className="w-3/4 object-contain"
                />
            </div>
            <div className="flex flex-col justify-center w-full h-full md:col-span-2 max-w-lg mx-auto bg-white rounded-xl">
                <h2 className="text-4xl font-extrabold text-center text-blue-500">Forget Password</h2>
                <p className="text-center text-blue-500 mb-6 text-lg">Reset Your Password</p>
                {!responseOtp &&
                    <Form {...forgetPasswordForm}>
                        <form onSubmit={forgetPasswordForm.handleSubmit(forgetPasswordOnSubmit)} className="space-y-6">
                            <div className="h-24">
                                <FormField
                                    control={forgetPasswordForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-light">Email Address</FormLabel>
                                            <FormControl>
                                                <Input disabled={forgetPasswordOption?.isLoading} {...field} id="email" type="email" placeholder="Enter Email Address" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center justify-between text-base">

                            </div>
                            <Button disabled={forgetPasswordOption?.isLoading} className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-brand-100 text-xl font-semibold rounded-lg shadow-md">
                                {forgetPasswordOption?.isLoading ? (
                                    <Image
                                        src="/assets/icons/loader.svg"
                                        alt="loader"
                                        width={24}
                                        height={24}
                                        className="ml-2 animate-spin"
                                    />
                                ) : "Send OTP"}
                            </Button>
                            <Link href="/">
                                <Button disabled={forgetPasswordOption?.isLoading} className="w-full hover:bg-brand-100 text-md font-semibold rounded-lg" variant="link">Login</Button>
                            </Link>

                        </form>
                    </Form>}
                {responseOtp &&
                    <Form {...resetPasswordForm}>
                        <form onSubmit={resetPasswordForm.handleSubmit(resetPasswordOnSubmit)} className="space-y-6">
                            <div className="h-26">
                                <FormField
                                    control={resetPasswordForm.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-normal mb-2 inline-block">Enter OTP Send to your Email Address</FormLabel>
                                            <FormControl>
                                                <InputOTP maxLength={6} {...field}>
                                                    <InputOTPGroup className="shad-otp">
                                                        <InputOTPSlot index={0} className="shad-otp-slot" />
                                                        <InputOTPSlot index={1} className="shad-otp-slot" />
                                                        <InputOTPSlot index={2} className="shad-otp-slot" />
                                                        <InputOTPSlot index={3} className="shad-otp-slot" />
                                                        <InputOTPSlot index={4} className="shad-otp-slot" />
                                                        <InputOTPSlot index={5} className="shad-otp-slot" />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                           

                            <div className="mt-0 flex justify-between">
                                <p></p>
                                <Button onClick={resendOtp} disabled={resetPasswordOption.isLoading} type="button" variant="link" className="text-blue-500 hover:underline text-sm">Resend</Button>
                            </div>

                            <div className="h-24">
                                <div className="relative">
                                    <FormField
                                        control={resetPasswordForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-light">Password</FormLabel>
                                                <FormControl>
                                                    <Input disabled={resetPasswordOption.isLoading} {...field} id="password" type={showPassword ? "text" : "password"} placeholder="Enter Password" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm pr-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <button
                                        disabled={resetPasswordOption?.isLoading}
                                        type="button"
                                        className="absolute inset-y-0 right-3 top-8 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-6 h-6 text-gray-500" /> : <Eye className="w-6 h-6 text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                            <div className="h-24">
                                <div className="relative">
                                    <FormField
                                        control={resetPasswordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-light">Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input disabled={resetPasswordOption?.isLoading} {...field} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Enter Password" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm pr-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <button
                                        disabled={resetPasswordOption?.isLoading}
                                        type="button"
                                        className="absolute inset-y-0 right-3 top-8 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-6 h-6 text-gray-500" /> : <Eye className="w-6 h-6 text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                            <Button disabled={resetPasswordOption?.isLoading} className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-brand-100 text-xl font-semibold rounded-lg shadow-md">
                                {resetPasswordOption?.isLoading ? (
                                    <Image
                                        src="/assets/icons/loader.svg"
                                        alt="loader"
                                        width={24}
                                        height={24}
                                        className="ml-2 animate-spin"
                                    />
                                ) : "Reset Password"}
                            </Button>
                        </form>
                    </Form>}
            </div>
        </div>
    );
}
