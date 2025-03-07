"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";
import SevenDaysPIVTable from "@/components/sevenDays/SevenDaysPIVTable";

function DataTableDemo() {
  const router = useRouter();

  const { data, isLoading, isSuccess, isError, error } = useGetAllUsersQuery(
    {}
  );

  const [submit, deleteUserOption] = useDeleteUserMutation();

  console.log("deleteUserOption", deleteUserOption);

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

  console.log({ data, isLoading, isSuccess, isError, error });

  function gotoDetailsPage(id: string) {
    router.push(PAGE_ROUTES.SUPERADMIN.USERDETAILS + id);
  }

  return (
    <div className="w-full rounded-2xl">
      <div className="flex items-center py-4 justify-between">
        <Link href={PAGE_ROUTES.SUPERADMIN.CREATEUSER} className="p-2">
          <Button variant="link">sevenDays Inventory PIV</Button>
        </Link>
      </div>
      {isSuccess ? (
        <SevenDaysPIVTable
          isLoading={deleteUserOption.isLoading || isLoading}
          gotoDetailsPage={gotoDetailsPage}
          deleteUser={submit}
          data={data}
        />
      ) : (
        <p className="w-full text-center"> Loading...</p>
      )}
    </div>
  );
}

export default DataTableDemo;
