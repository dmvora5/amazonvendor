"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddUserMutation } from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";

const userFormSchema = z.object({
  first_name: z.string().min(1, { message: "First Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  last_name: z.string().min(2, { message: "Last Name must be at least 2 characters" }),
  password: z.string({ message: "password must be a string" }).min(8, { message: "password must be at least 8 characters long" }),
  // role: z.string().min(1, { message: "Role is required" }),
  // permissions: z.array(
  //   z.object({
  //     name: z.string(),
  //     value: z.boolean(),
  //   })
  // ),
});

export default function CreateUserForm() {

  const router = useRouter();

  // const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [submit, { isLoading, error, isSuccess }] = useAddUserMutation();


  useEffect(() => {
    if (!error) return;
    parseAndShowErrorInToast(error);
  }, [error]);

  useEffect(() => {
    if (!isSuccess) return;
    router.push(PAGE_ROUTES.SUPERADMIN.ALLUSERS)
  }, [isSuccess]);

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      // role: "",
      // permissions: [],
    },
  });

  const { control, handleSubmit, setValue } = form;
  // const { fields, update, replace } = useFieldArray({
  //   control,
  //   name: "permissions",
  // });

  // ✅ Fetch permissions from API
  // useEffect(() => {
  //   async function fetchPermissions() {
  //     try {
  //       setLoading(true);
  //       const response = await fetch("/api/permissions"); // Replace with your actual API endpoint
  //       const data = await response.json();

  //       // Convert API response to correct format
  //       const formattedPermissions = data.permissions.map((perm: string) => ({
  //         name: perm,
  //         value: false, // Default all permissions to false
  //       }));

  //       // setValue("permissions", formattedPermissions);
  //     } catch (error) {
  //       console.log("Error fetching permissions:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchPermissions();
  // }, [setValue]);

  async function onSubmit(data: any) {
    await submit({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password
    })
    // console.log("Form Submitted:", data);
    // try {
    //   setLoading(true);
    //   const response = await axiosInstance.post(API_ROUTES.SUPERADMIN.CREATEUSER, {
    //     first_name: data.first_name,
    //     last_name: data.last_name,
    //     email: data.email,
    //     password: data.password
    //   })

    //   if(response.status === 201) {
    //     router.push(PAGE_ROUTES.SUPERADMIN.ALLUSERS);
    //   }

    //   console.log('response', response)

    // } catch (err) {
    //   console.log('err', err)
    // } finally {
    //   setLoading(false);
    // }
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center space-y-6">
        <div className="p-10 m-16 bg-white rounded-2xl shadow-lg border w-4/5">
          <div className="flex p-2 justify-between">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <Link href="/super-admin/users/all-users">
              <Button variant="link" className="">
                All Users
              </Button>
            </Link>

          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
              {/* User Details */}
              <div className="flex gap-4">
                <FormField
                  control={control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <Label className="text-lg font-light">First Name</Label>
                      <FormControl>
                        <Input disabled={isLoading} placeholder="Enter First Name" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm" {...field} />
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
                      <FormLabel className="text-lg font-light">Last Name</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} placeholder="Enter Last Name" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm" {...field} />
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
                      <FormLabel className="text-lg font-light">Email Address</FormLabel>
                      <FormControl>
                        <Input disabled={isLoading} placeholder="Enter Email Address" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="relative w-1/2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel className="text-lg font-light">Password</FormLabel>
                        <FormControl>
                          <Input disabled={isLoading} {...field} id="password" type={showPassword ? "text" : "password"} placeholder="Enter Password" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm pr-10" />
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
              {/* <div className="flex">
                <FormField
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}

              {/* Permissions Section */}
              {/* <h5 className="font-semibold">Permissions</h5>
              {loading ? (
                <p>Loading permissions...</p>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 border rounded-lg flex items-center">
                      <FormField
                        control={control}
                        name={`permissions.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <Label className="capitalize">{fields[index].name.replace(/([A-Z])/g, " $1")}</Label>
                          </FormItem>
                        )}
                      />
                    </Card>
                  ))}
                </div>
              )} */}

              {/* Buttons */}
              <div className="flex justify-end mt-4">
                {/* <Button disabled={isLoading} variant="outline" className="mr-2 w-20 p-4">
                  Cancel
                </Button> */}
                <Button disabled={isLoading} className=" text-center bg-brand w-20 p-4" type="submit">
                  {isLoading ? (
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="loader"
                      width={24}
                      height={24}
                      className="animate-spin"
                    />
                  ) : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
