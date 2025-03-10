"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useGetInventoryPivotQuery } from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";
import Image from "next/image";

function DataTableDemo() {
  const router = useRouter();

  const { data, isLoading, isSuccess, isError, error } =
    useGetInventoryPivotQuery("14d");

  useEffect(() => {
    if (!error) return;
    parseAndShowErrorInToast(error);
  }, [error]);

  console.log({ data, isLoading, isSuccess, isError, error });

  // function gotoDetailsPage(id: string) {
  //   router.push(PAGE_ROUTES.SUPERADMIN.USERDETAILS + id);
  // }

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
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    ASIN
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Total Quantity
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {((data as any) || []).map((row: any, index: number) => (
                  <tr
                    key={row.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-700 rounded-lg transition duration-200 ease-in-out`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.asin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.total_quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Image
          src="/assets/icons/loader.svg"
          alt="loader"
          width={24}
          height={24}
          className="animate-spin bg-brand mx-auto absolute top-[50%] left-[50%]"
        />
      )}
    </div>
  );
}

export default DataTableDemo;
