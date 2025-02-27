'use client';

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react";

export default function ForgetPasswordForm() {
    const { data } = useSession();

    console.log('data', data)

    const [otp, setOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [responseOtp, setResponseOtp] = useState(true);


    const forgetPasswordFormSchema = z.object({
        email: z.string({ message: "email must be a string" }).email({ message: "email must be a valid email" }),
    })

    const forgetPasswordForm = useForm<z.infer<typeof forgetPasswordFormSchema>>({
        resolver: zodResolver(forgetPasswordFormSchema),
        defaultValues: {
            email: "",
        }
    })

    function forgetPasswordOnSubmit(values: z.infer<typeof forgetPasswordFormSchema>) {
        console.log(values)
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

    function resetPasswordOnSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
        console.log(values)
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
                <h2 className="text-4xl font-extrabold text-center text-brand">Forget Password</h2>
                <p className="text-center text-gray-600 mb-6 text-lg">Reset Your Password</p>
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
                                                <Input {...field} id="email" type="email" placeholder="Enter Email Address" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex items-center justify-between text-base">

                            </div>
                            <Button className="w-full h-14 bg-brand hover:bg-brand-100 text-xl font-semibold rounded-lg shadow-md">Send Otp</Button>
                            <Link href="/">
                                <Button className="w-full hover:bg-brand-100 text-md font-semibold rounded-lg" variant="link">Login</Button>
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
                                <p>3:00</p>
                                <Button type="button" variant="link" className="text-green-600 hover:underline text-sm">Resend</Button>
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
                            <div className="h-24">
                                <div className="relative">
                                    <FormField
                                        control={resetPasswordForm.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-lg font-light">Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input {...field} id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Enter Password" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm pr-10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 top-8 flex items-center"
                                        onClick={() => setShowPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-6 h-6 text-gray-500" /> : <Eye className="w-6 h-6 text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                            <Button className="w-full h-14 bg-brand hover:bg-brand-100 text-xl font-semibold rounded-lg shadow-md">Reset Password</Button>
                        </form>
                    </Form>}
            </div>
        </div>
    );
}
