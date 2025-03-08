"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import Image from "next/image";

import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEditUserQuery, useUpdateUserMutation } from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";

const userFormSchema = z.object({
  first_name: z.string().min(1, { message: "First Name is required" }),
  last_name: z.string().min(2, { message: "Last Name must be at least 2 characters" }),
  id: z.string()
  // password: z.string({ message: "password must be a string" }).min(8, { message: "password must be at least 8 characters long" }),
  // role: z.string().min(1, { message: "Role is required" }),
  // permissions: z.array(
  //   z.object({
  //     name: z.string(),
  //     value: z.boolean(),
  //   })
  // ),
});

export default function EditUserForm() {

  const query = useParams();
  const router = useRouter();

  // const [loading, setLoading] = useState(true);
  // const [showPassword, setShowPassword] = useState(false);

  const { data, isLoading, error } = useEditUserQuery(query?.id, {
    skip: !query?.id
  })

  const [submit, updateUserOptions] = useUpdateUserMutation();

  useEffect(() => {
    if (!error) return;
    parseAndShowErrorInToast(error);
  },[error]);

  useEffect(() => {
    if (!updateUserOptions?.error) return;
    parseAndShowErrorInToast(updateUserOptions?.error);
  },[updateUserOptions?.error]);

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      id: ""
      // password: "",
      // role: "",
      // permissions: [],
    },
  });
  const { control, handleSubmit, setValue } = form;

  useEffect(() => {
    if (!data) return;

    setValue('first_name', (data as any)?.first_name);
    setValue('last_name', (data as any)?.last_name)
    setValue('id', String((data as any)?.id))

  }, [data]);



  useEffect(() => {
    if(updateUserOptions.isSuccess) {
      toast.success("User updated successfully");
      router.push(PAGE_ROUTES.SUPERADMIN.ALLUSERS);
    }
  },[updateUserOptions.isSuccess])


  // const { fields, update, replace } = useFieldArray({
  //   control,
  //   name: "permissions",
  // });



  // // ✅ Fetch permissions from API
  // async function fetchUserDetails() {
  //   // try {
  //   //   setLoading(true);
  //   //   const response = await fetch("/api/permissions"); // Replace with your actual API endpoint
  //   //   const data = await response.json();

  //   //   // Convert API response to correct format
  //   //   const formattedPermissions = data.permissions.map((perm: string) => ({
  //   //     name: perm,
  //   //     value: false, // Default all permissions to false
  //   //   }));

  //   //   setValue("permissions", formattedPermissions);
  //   // } catch (error) {
  //   //   console.log("Error fetching permissions:", error);
  //   // } finally {
  //   //   setLoading(false);
  //   // }

  // try {
  //   setLoading(true);
  //   const response = await axiosInstance.get(`${API_ROUTES.SUPERADMIN.USERDETAILS}${query.id}/`);
  //   console.log('response', response)
  //   if (response.status === 200) {
  //     form.setValue('first_name', response.data.first_name);
  //     form.setValue('last_name', response.data.last_name)
  //     form.setValue('id', String(response.data.id))

  //   }
  // } catch (err) {
  //   if (err instanceof AxiosError) {
  //     if (err.status === 404) {
  //       toast.error(err.response?.data?.detail);
  //       router.push(PAGE_ROUTES.SUPERADMIN.ALLUSERS);
  //     }
  //   }
  // } finally {
  //   setLoading(false);
  // }



  async function onSubmit(data: any) {

    await submit(data)
    
    // console.log("Form Submitted:", data);
    // try {
    //   setLoading(true);
    //   const response = await axiosInstance.patch(API_ROUTES.SUPERADMIN.UPDATEUSER + data.id + "/", {
    //     first_name: data.first_name,
    //     last_name: data.last_name,
    //   })

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
        <div className="p-10 m-16 bg-white rounded-2xl shadow-lg border w-3/5">
          <div className="flex p-2 justify-between">
            <h2 className="text-xl font-semibold mb-4">Update User</h2>
            {/* <Link href="/super-admin/users/all-users">
              <Button variant="link" className="">
                All Users
              </Button>
            </Link> */}

          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6">
              {/* User Details */}
              {/* <div className="flex gap-4"> */}
              {/* <FormField
                control={control}
                name="id"
                render={({ field }) => (
                  <FormItem className="">
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-lg font-light">First Name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading || updateUserOptions?.isLoading} placeholder="Enter First Name" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-lg font-light">Last Name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading || updateUserOptions?.isLoading} placeholder="Enter Last Name" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              {/* </div> */}

              {/* <div className="flex gap-4"> */}
              {/* <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-lg font-light">Email Address</FormLabel>
                    <FormControl>
                      <Input disabled={loading}  placeholder="Enter Email Address" className="w-full h-14 px-5 border rounded-lg text-lg shadow-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {/* <div className="relative w-1/2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="">
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
                </div> */}
              {/* </div> */}
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
                {/* <Button disabled={isLoading || updateUserOptions?.isLoading} variant="outline" className="mr-2 w-20 p-4">
                  Cancel
                </Button> */}
                <Button disabled={isLoading || updateUserOptions?.isLoading} className=" text-center bg-brand w-20 p-4" type="submit">
                  {isLoading || updateUserOptions?.isLoading ? (
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="loader"
                      width={24}
                      height={24}
                      className="animate-spin"
                    />
                  ) : "Update"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
