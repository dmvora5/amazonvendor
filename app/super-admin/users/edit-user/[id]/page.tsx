"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";

import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useEditUserQuery,
  useUpdateUserMutation,
} from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";
import ApiState from "@/components/ApiState";
import SuperAdminCheck from "@/components/SuperAdminCheck";

const userFormSchema = z.object({
  id: z.string(),
  first_name: z.string().min(1, { message: "First Name is required" }),
  last_name: z.string().min(2, { message: "Last Name must be at least 2 characters" }),

  // Add your boolean permissions here
  has_reports_access: z.boolean().default(false),
  has_category_access: z.boolean().default(false),
  has_cm_access: z.boolean().default(false),
  has_order_access: z.boolean().default(false),
  has_product_db_access: z.boolean().default(false),
  has_scraped_data_access: z.boolean().default(false),
});

export default function EditUserForm() {
  const query = useParams();
  const router = useRouter();

  const { data, isLoading, error, isSuccess } = useEditUserQuery(query?.id, {
    skip: !query?.id,
  });

  const [submit, updateUserOptions] = useUpdateUserMutation();

  useEffect(() => {
    if (!error) return;
    parseAndShowErrorInToast(error);
  }, [error]);

  useEffect(() => {
    if (!updateUserOptions?.error) return;
    parseAndShowErrorInToast(updateUserOptions?.error);
  }, [updateUserOptions?.error]);

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: "",
      first_name: "",
      last_name: "",
      has_reports_access: false,
      has_category_access: false,
      has_cm_access: false,
      has_order_access: false,
      has_product_db_access: false,
      has_scraped_data_access: false,
    },
  });

  const { control, handleSubmit, setValue } = form;

  // Set form values when data arrives
  useEffect(() => {
    if (!data) return;

    setValue("id", String((data as any).id));
    setValue("first_name", (data as any).first_name ?? "");
    setValue("last_name", (data as any).last_name ?? "");

    // Set permissions boolean values safely (fallback to false)
    setValue("has_reports_access", Boolean((data as any).has_reports_access));
    setValue("has_category_access", Boolean((data as any).has_category_access));
    setValue("has_cm_access", Boolean((data as any).has_cm_access));
    setValue("has_order_access", Boolean((data as any).has_order_access));
    setValue("has_product_db_access", Boolean((data as any).has_product_db_access));
    setValue("has_scraped_data_access", Boolean((data as any).has_scraped_data_access));
  }, [data, setValue]);

  // On successful update, show toast and redirect
  useEffect(() => {
    if (updateUserOptions.isSuccess) {
      toast.success("User updated successfully");
      router.push("/super-admin/users/all-users"); // or PAGE_ROUTES.SUPERADMIN.ALLUSERS
    }
  }, [updateUserOptions.isSuccess, router]);

  async function onSubmit(data: any) {
    await submit(data);
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center space-y-6">
        <SuperAdminCheck />

        <div className="p-10 m-16 bg-white rounded-2xl shadow-lg border w-3/5">
          <div className="flex p-2 justify-between">
            <h2 className="text-xl font-semibold mb-4">Update User</h2>
          </div>
          <ApiState error={error} isSuccess={isSuccess}>
            <ApiState.ArthorizeCheck />
          </ApiState>

          <ApiState
            error={updateUserOptions.error}
            isSuccess={updateUserOptions.isSuccess}
          >
            <ApiState.ArthorizeCheck />
          </ApiState>

          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col space-y-6"
            >
              {/* Hidden ID */}
              <FormField
                control={control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* First Name */}
              <FormField
                control={control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-light">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading || updateUserOptions.isLoading}
                        placeholder="Enter First Name"
                        className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-light">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading || updateUserOptions.isLoading}
                        placeholder="Enter Last Name"
                        className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Permissions Checkboxes */}
              <h3 className="text-lg font-semibold mt-6 mb-2">Permissions</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "has_reports_access", label: "Reports Access" },
                  { name: "has_category_access", label: "Category Access" },
                  { name: "has_cm_access", label: "CM Access" },
                  { name: "has_order_access", label: "Order Access" },
                  { name: "has_product_db_access", label: "Product DB Access" },
                  { name: "has_scraped_data_access", label: "Scraped Data Access" },
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
                            disabled={isLoading || updateUserOptions.isLoading}
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
                  disabled={isLoading || updateUserOptions.isLoading}
                  className="text-center bg-brand w-20 p-4"
                  type="submit"
                >
                  {isLoading || updateUserOptions.isLoading ? (
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="loader"
                      width={24}
                      height={24}
                      className="animate-spin"
                    />
                  ) : (
                    "Update"
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
