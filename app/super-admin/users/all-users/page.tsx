"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";
import { Check, Cross, Edit, Trash, X } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import ProcessLoader from "@/components/ProcessLoader";
import ApiState from "@/components/ApiState";
import SuperAdminCheck from "@/components/SuperAdminCheck";

function UserTables() {
  const router = useRouter();
  const { data, isLoading, isSuccess, isError, error, isFetching } = useGetAllUsersQuery(
    {}
  );
  const [deleteUser, deleteUserOption] = useDeleteUserMutation();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!deleteUserOption.error) return;
    parseAndShowErrorInToast(deleteUserOption.error);
  }, [deleteUserOption.error]);

  useEffect(() => {
    if (!error) return;
    parseAndShowErrorInToast(error);
  }, [error]);

  useEffect(() => {
    if (deleteUserOption?.isSuccess) {
      toast.success("User deleted successfully");
    }
  }, [deleteUserOption?.isSuccess]);

  function gotoDetailsPage(id: string) {
    router.push(PAGE_ROUTES.SUPERADMIN.USERDETAILS + id);
  }

  return (
    <div className="w-full rounded-2xl">
      <SuperAdminCheck />
      <ApiState error={error} isSuccess={isSuccess}>
        <ApiState.ArthorizeCheck />
      </ApiState>

      <ApiState error={deleteUserOption.error} isSuccess={deleteUserOption.isSuccess}>
        <ApiState.ArthorizeCheck />
      </ApiState>
      {(isLoading || isFetching || deleteUserOption.isLoading) ? (
        <ProcessLoader className="mx-auto absolute top-[50%] left-[50%]" />
      ) : (
        <div className="flex-1 p-6 overflow-hidden">
          <div className="relative overflow-x-auto overflow-y-hidden shadow-md sm:rounded-lg h-full">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
              <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    First Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Last Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    2FA-Enable
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {((data as any) || []).map((row: any, index: number) => (
                  <tr
                    key={row.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-700 rounded-lg transition duration-200 ease-in-out`}
                  >
                    <td className="px-6 py-4">{row.first_name}</td>
                    <td className="px-6 py-4">{row.last_name}</td>
                    <td className="px-6 py-4">{row.email}</td>
                    <td className="px-6 py-4">{row?.two_factor_enabled ?<Check color="green" />: <X color="red" />}</td>
                    <td className="px-6 py-4 flex space-x-2">
                      <Button
                        onClick={() => gotoDetailsPage(row?.id)}
                        className="text-[#006838] hover:bg-[#006838] hover:text-white transition-all duration-200"
                        variant="link"
                      >
                        <Edit />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedUserId(row?.id)}
                            className="text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                            variant="link"
                          >
                            <Trash />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm Deletion
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this user?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                selectedUserId && deleteUser(selectedUserId)
                              }
                              className="bg-red-600 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTables;
