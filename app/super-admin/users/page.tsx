"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddUserMutation } from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";
import ApiState from "@/components/ApiState";
import SuperAdminCheck from "@/components/SuperAdminCheck";

const userFormSchema = z.object({
  first_name: z.string().min(1, { message: "First Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  last_name: z.string().min(2, { message: "Last Name must be at least 2 characters" }),
  password: z
    .string({ message: "password must be a string" })
    .min(8, { message: "password must be at least 8 characters long" }),
  has_category_access: z.boolean().default(false),
  has_cm_access: z.boolean().default(false),
  has_order_access: z.boolean().default(false),
  has_product_db_access: z.boolean().default(false),
  has_scraped_data_access: z.boolean().default(false),
  has_fba_access: z.boolean().default(false),
  has_current_inventory_access: z.boolean().default(false),
  has_all_inventory_access: z.boolean().default(false),
  has_order_history_access: z.boolean().default(false),
  has_shipped_history_access: z.boolean().default(false),
});

export default function CreateUserForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [submit, { isLoading, error, isSuccess }] = useAddUserMutation();

  useEffect(() => {
    if (!error) return;
    parseAndShowErrorInToast(error);
  }, [error]);

  useEffect(() => {
    if (!isSuccess) return;
    router.push("/super-admin/users/all-users"); // Or PAGE_ROUTES.SUPERADMIN.ALLUSERS if you prefer
  }, [isSuccess]);

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      has_category_access: false,
      has_cm_access: false,
      has_order_access: false,
      has_product_db_access: false,
      has_scraped_data_access: false,
      has_fba_access: false,
      has_current_inventory_access: false,
      has_all_inventory_access: false,
      has_order_history_access: false,
      has_shipped_history_access: false,

    },
  });

  const { control, handleSubmit } = form;

  async function onSubmit(data: any) {
    console.log('data', data)
    await submit(data);
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center space-y-6">
        <SuperAdminCheck />
        <div className="p-10 m-16 bg-white rounded-2xl shadow-lg border w-4/5">
          <div className="flex p-2 justify-between">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
          </div>
          <ApiState error={error} isSuccess={isSuccess}>
            <ApiState.ArthorizeCheck />
          </ApiState>

          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-6"
            >
              {/* User Details */}
              <div className="flex gap-4">
                <FormField
                  control={control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="text-lg font-light">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Enter First Name"
                          className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="text-lg font-light">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Enter Last Name"
                          className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel className="text-lg font-light">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Enter Email Address"
                          className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="relative w-1/2">
                  <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-light">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            {...field}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm pr-10"
                          />
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
                    {showPassword ? (
                      <EyeOff className="w-6 h-6 text-gray-500" />
                    ) : (
                      <Eye className="w-6 h-6 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Permissions</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "has_category_access", label: "Category Access" },
                  { name: "has_cm_access", label: "CM Access" },
                  { name: "has_order_access", label: "Order Access" },
                  { name: "has_product_db_access", label: "Product DB Access" },
                  { name: "has_scraped_data_access", label: "Scraped Data Access" },
                  { name: "has_fba_access", label: "Fba Inventory Access" },
                  { name: "has_current_inventory_access", label: "Current Inventory Access" },
                  { name: "has_all_inventory_access", label: "All Inventory Access" },
                  { name: "has_order_history_access", label: "Order History Access" },
                  { name: "has_shipped_history_access", label: "Shipped History Access" },
                ].map(({ name, label }) => (
                  <FormField
                    key={name}
                    control={control}
                    name={name as any}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            id={name}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={isLoading}
                            className="h-5 w-5"
                          />
                        </FormControl>
                        <FormLabel htmlFor={name} className="select-none">
                          {label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <Button
                  disabled={isLoading}
                  className="text-center bg-brand w-20 p-4"
                  type="submit"
                >
                  {isLoading ? (
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="loader"
                      width={24}
                      height={24}
                      className="animate-spin"
                    />
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
