"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import { parseAndShowErrorInToast } from "@/utils";
import { useAddCategoryMutation } from "@/redux/apis/usersApis";
import Image from "next/image";
import ApiState from "@/components/ApiState";
// import Image from "next/image"; // Only needed if you plan to show a spinner/loader graphic

// ----- Zod Schema -----
const categoryFormSchema = z.object({
    sr_0_to_2k: z.string().min(1, { message: "This field is required" }),
    sr_2k_to_5k: z.string().min(1, { message: "This field is required" }),
    sr_5k_to_10k: z.string().min(1, { message: "This field is required" }),
    sr_10k_to_30k: z.string().min(1, { message: "This field is required" }),
    sr_30k_to_60k: z.string().min(1, { message: "This field is required" }),
    sr_60k_to_80k: z.string().min(1, { message: "This field is required" }),
    sr_80k_to_100k: z.string().min(1, { message: "This field is required" }),
    sr_100k_to_150k: z.string().min(1, { message: "This field is required" }),
    sr_150k_to_200k: z.string().min(1, { message: "This field is required" }),
    sr_200k_to_350k: z.string().min(1, { message: "This field is required" }),
    sr_350k_to_500k: z.string().min(1, { message: "This field is required" }),
    sr_gt_500k: z.string().min(1, { message: "This field is required" }),
});

export default function CreateCategoryForm() {
    const router = useRouter();
    const [submitCategory, { isLoading, error, isSuccess }] =
        useAddCategoryMutation();

    // Handle API Errors
    useEffect(() => {
        if (error) parseAndShowErrorInToast(error);
    }, [error]);

    // On successful creation, redirect
    useEffect(() => {
        if (isSuccess) {
            router.push(PAGE_ROUTES.SUPERADMIN.ALLCATEGORIES);
        }
    }, [isSuccess, router]);

    // Initialize form
    const form = useForm({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            sr_0_to_2k: "",
            sr_2k_to_5k: "",
            sr_5k_to_10k: "",
            sr_10k_to_30k: "",
            sr_30k_to_60k: "",
            sr_60k_to_80k: "",
            sr_80k_to_100k: "",
            sr_100k_to_150k: "",
            sr_150k_to_200k: "",
            sr_200k_to_350k: "",
            sr_350k_to_500k: "",
            sr_gt_500k: "",
        },
    });

    const { control, handleSubmit } = form;

    async function onSubmit(data: any) {
        // Adjust the payload as needed for your API
        await submitCategory(data);
    }

    return (
        <div className="flex flex-col justify-center items-center space-y-6">
            <div className="p-10 m-16 bg-white rounded-2xl shadow-lg border w-4/5">
                <div className="flex p-2 justify-between">
                    <h2 className="text-xl font-semibold mb-4">Create Category</h2>
                    {/* <Link href={PAGE_ROUTES.SUPERADMIN.ALLCATEGORIES}>
            <Button variant="link">All Categories</Button>
          </Link> */}
                </div>
                <ApiState error={error} isSuccess={isSuccess}>
                    <ApiState.ArthorizeCheck />
                </ApiState>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                        {/* Example: Two columns, six rows (edit to your preference) */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* sr_0_to_2k */}
                            <FormField
                                control={control}
                                name="sr_0_to_2k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 0 to 2k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_2k_to_5k */}
                            <FormField
                                control={control}
                                name="sr_2k_to_5k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 2k to 5k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_5k_to_10k */}
                            <FormField
                                control={control}
                                name="sr_5k_to_10k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 5k to 10k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_10k_to_30k */}
                            <FormField
                                control={control}
                                name="sr_10k_to_30k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 10k to 30k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_30k_to_60k */}
                            <FormField
                                control={control}
                                name="sr_30k_to_60k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 30k to 60k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_60k_to_80k */}
                            <FormField
                                control={control}
                                name="sr_60k_to_80k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 60k to 80k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_80k_to_100k */}
                            <FormField
                                control={control}
                                name="sr_80k_to_100k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 80k to 100k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_100k_to_150k */}
                            <FormField
                                control={control}
                                name="sr_100k_to_150k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 100k to 150k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_150k_to_200k */}
                            <FormField
                                control={control}
                                name="sr_150k_to_200k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 150k to 200k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_200k_to_350k */}
                            <FormField
                                control={control}
                                name="sr_200k_to_350k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 200k to 350k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_350k_to_500k */}
                            <FormField
                                control={control}
                                name="sr_350k_to_500k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR 350k to 500k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* sr_gt_500k */}
                            <FormField
                                control={control}
                                name="sr_gt_500k"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SR &gt; 500k</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="Enter value"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-4">
                            <Button disabled={isLoading} variant="outline" className="mr-2 w-20">
                                Cancel
                            </Button>
                            <Button disabled={isLoading} className="w-20" type="submit">
                                {
                                    isLoading ? (
                                        <Image
                                            src="/assets/icons/loader.svg"
                                            alt="loader"
                                            width={24}
                                            height={24}
                                            className="animate-spin"
                                        />
                                    ) : "Create"
                                }
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
