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
        {/* <Link href={PAGE_ROUTES.SUPERADMIN.CREATEUSER} className="p-2">
          <Button variant="link">FBA Inventory</Button>
        </Link> */}
      </div>
      {isSuccess ? (
        <div className="flex-1 p-6 overflow-hidden">
          <div className="relative overflow-x-auto overflow-y-hidden shadow-md sm:rounded-lg h-full">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
              {/* Table Header */}
              <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">SKU</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">FNSKU</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">ASIN</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">Product Name</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">Condition</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">Your Price</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">MFN Listing Exists</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">MFN Fulfillable Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Listing Exists</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Warehouse Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Fulfillable Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Unsellable Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Reserved Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Total Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">Per Unit Volume</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Inbound Working Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Inbound Shipped Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Inbound Receiving Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Researching Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Reserved Future Supply</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">AFN Future Supply Buyable</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">Total Pending</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">Total New Inbound</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">Total Inbound</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">Total ASIN Stocked Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">Sale Rate Calculation</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">Order</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">2 Weeks Sales Rate</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">2 Weeks Order</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">6 Weeks Sales Rate</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">6 Weeks Order</th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">List Order Formula</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {(data as any || []).map((row: any, index: number) => (
                  <tr
                    key={row.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-700 rounded-lg transition duration-200 ease-in-out`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.first_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.email}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      ) : (
        <p className="w-full text-center"> Loading...</p>
      )}
    </div>
  );
}

export default DataTableDemo;
