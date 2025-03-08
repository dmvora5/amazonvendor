"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useGetFBAInventoryQuery } from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";

function DataTableDemo() {
  const router = useRouter();

  const { data, isLoading, isSuccess, isError, error } =
    useGetFBAInventoryQuery({});

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
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    FNSKU
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    ASIN
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Condition
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Your Price
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    MFN Listing Exists
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    MFN Fulfillable Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Listing Exists
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Warehouse Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Fulfillable Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Unsellable Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Reserved Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Total Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Per Unit Volume
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Inbound Working Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Inbound Shipped Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Inbound Receiving Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Researching Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Reserved Future Supply
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Future Supply Buyable
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Fulfillable Quantity Local
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    AFN Fulfillable Quantity Remote
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Total Pending
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Total New Inbound
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Total Inbound
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Total ASIN Stocked Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    7 Days
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    8-14 Days
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    14 Days
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    15-30 Days
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    30 Days
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Re-Order
                  </th>
                  {/* <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Sale Rate Calculation
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Order
                  </th> */}
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    2 Weeks Sales Rate
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    2 Weeks Order
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    6 Weeks Sales Rate
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    6 Weeks Order
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    2 Months Sales Rate
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    2 Months Order
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    3 Months Sales Rate
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    3 Months Order
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    4 weeks sales rate based on 14 days sale
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    4 weeks order based on 14 days sale
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    List Order Formula
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {((data as any) || []).map((row: any, index: number) => (
                  <tr
                    key={row.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-700 rounded-lg transition duration-200 ease-in-out`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.fnsku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.asin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.condition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.your_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.mfn_listing_exists ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.mfn_fulfillable_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_listing_exists ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_warehouse_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_fulfillable_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_unsellable_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_reserved_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_total_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.per_unit_volume}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_inbound_working_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_inbound_shipped_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_inbound_receiving_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_researching_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_reserved_future_supply}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_future_supply_buyable}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_fulfillable_quantity_local}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.afn_fulfillable_quantity_remote}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.total_pending}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.total_new_inbound}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.total_inbound}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.total_asin_stocked_quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.days_7}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.days_8_14}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.days_14}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.days_15_30}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.days_30}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.reorder ? "Yes" : "No"}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">{row.sale_rate_calculation}</td> */}
                    {/* <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">{row.order}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.sale_rate_2_weeks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.order_2_weeks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.sales_rate_6_weeks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.order_6_weeks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.sales_rate_2_months}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.order_2_months}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.sales_rate_3_months}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.order_3_months}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.sales_rate_4_weeks_based_on_14_days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.order_4_weeks_based_on_14_days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.list_order_formula}
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
