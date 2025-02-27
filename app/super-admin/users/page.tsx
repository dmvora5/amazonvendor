"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Link from "next/link";

const userFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  address: z.string().min(1, { message: "Address is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  permissions: z.array(
    z.object({
      name: z.string(),
      value: z.boolean(),
    })
  ),
});

export default function CreateUserForm() {
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      role: "",
      permissions: [],
    },
  });

  const { control, handleSubmit, setValue } = form;
  const { fields, update, replace } = useFieldArray({
    control,
    name: "permissions",
  });

  // ✅ Fetch permissions from API
  useEffect(() => {
    async function fetchPermissions() {
      try {
        setLoading(true);
        const response = await fetch("/api/permissions"); // Replace with your actual API endpoint
        const data = await response.json();

        // Convert API response to correct format
        const formattedPermissions = data.permissions.map((perm: string) => ({
          name: perm,
          value: false, // Default all permissions to false
        }));

        setValue("permissions", formattedPermissions);
      } catch (error) {
        console.log("Error fetching permissions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, [setValue]);

  function onSubmit(data: any) {
    console.log("Form Submitted:", data);
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
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <Label>Name</Label>
                      <FormControl>
                        <Input placeholder="Enter Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <Label>Role</Label>
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
              </div>

              <div className="flex gap-4">
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <Label>Email Address</Label>
                      <FormControl>
                        <Input placeholder="Enter Email Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <Label>Address</Label>
                      <FormControl>
                        <Input placeholder="Type Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Permissions Section */}
              <h5 className="font-semibold">Permissions</h5>
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
              )}

              {/* Buttons */}
              <div className="flex justify-end mt-4">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
                <Button className="bg-brand" type="submit">
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
