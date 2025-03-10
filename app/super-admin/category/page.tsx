"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useDeleteUserMutation,
  useGetAllCategoryQuery,
} from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";
import { Edit, Trash } from "lucide-react";
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

function CategoryTables() {
  const router = useRouter();
  const { data, isLoading, isSuccess, isError, error } = useGetAllCategoryQuery(
    {}
  );
  // const [deleteUser, deleteUserOption] = useDeleteUserMutation();
  // const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!deleteUserOption.error) return;
  //   parseAndShowErrorInToast(deleteUserOption.error);
  // }, [deleteUserOption.error]);

  useEffect(() => {
    if (!error) return;
    parseAndShowErrorInToast(error);
  }, [error]);

  // useEffect(() => {
  //   if (deleteUserOption?.isSuccess) {
  //     toast.success("User deleted successfully");
  //   }
  // }, [deleteUserOption?.isSuccess]);

  function gotoDetailsPage(id: string) {
    router.push(PAGE_ROUTES.SUPERADMIN.USERDETAILS + id);
  }

  console.log('data', data);

  return (
    <div className="w-full rounded-2xl">
      {isLoading && (
        <Image
          src="/assets/icons/loader.svg"
          alt="loader"
          width={24}
          height={24}
          className="animate-spin bg-brand mx-auto absolute top-[50%] left-[50%]"
        />
      )}
      {isSuccess && (
        <div className="flex-1 p-6 overflow-hidden">
          <div className="relative overflow-x-auto overflow-y-hidden shadow-md sm:rounded-lg h-full">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
              <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_0_to_2k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_2k_to_5k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_5k_to_10k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_10k_to_30k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_30k_to_60k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_60k_to_80k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_80k_to_100k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_100k_to_150k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_150k_to_200k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_200k_to_350k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_350k_to_500k</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SR_gt_500k</th>
                </tr>
              </thead>
              <tbody>
                {((data as any) || []).map((row: any, index: number) => (
                  <tr
                    key={row.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-700 rounded-lg transition duration-200 ease-in-out`}
                  >
                    <td className="px-6 py-4">{row.sr_0_to_2k}</td>
                    <td className="px-6 py-4">{row.sr_2k_to_5k}</td>
                    <td className="px-6 py-4">{row.sr_5k_to_10k}</td>
                    <td className="px-6 py-4">{row.sr_10k_to_30k}</td>
                    <td className="px-6 py-4">{row.sr_30k_to_60k}</td>
                    <td className="px-6 py-4">{row.sr_60k_to_80k}</td>
                    <td className="px-6 py-4">{row.sr_80k_to_100k}</td>
                    <td className="px-6 py-4">{row.sr_100k_to_150k}</td>
                    <td className="px-6 py-4">{row.sr_150k_to_200k}</td>
                    <td className="px-6 py-4">{row.sr_200k_to_350k}</td>
                    <td className="px-6 py-4">{row.sr_350k_to_500k}</td>
                    <td className="px-6 py-4">{row.sr_gt_500k}</td>
                    {/* <td className="px-6 py-4 flex space-x-2">
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
                    </td> */}
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

export default CategoryTables;
