"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useGetInventoryQuery } from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";

function DataTableDemo() {
  const router = useRouter();

  const { data, isLoading, isSuccess, isError, error } =
    useGetInventoryQuery("7d");

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
                    Amazon Order ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Merchant Order ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Purchase Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Last Updated Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Order Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Fulfillment Channel
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Sales Channel
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Order Channel
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    URL
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Ship Service Level
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    ASIN
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Item Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Currency
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Item Price
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Item Tax
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Shipping Price
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Shipping Tax
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Gift Wrap Price
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Gift Wrap Tax
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Item Promotion Discount
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Ship Promotion Discount
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Ship City
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Ship State
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Ship Postal Code
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Ship Country
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Promotion IDs
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Is Business Order
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Purchase Order Number
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Price Designation
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Is IBA
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Buyer Citizen Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Buyer Citizen ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Order Invoice Type
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Invoice Business Legal Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Invoice Business Address
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Invoice Business Tax ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Invoice Business Tax Office
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
                      {row.amazon_order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.merchant_order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.purchase_date
                        ? new Date(row.purchase_date).toLocaleString()
                        : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.last_updated_date
                        ? new Date(row.last_updated_date).toLocaleString()
                        : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.order_status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.fulfillment_channel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.sales_channel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.order_channel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.url}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.ship_service_level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.asin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.item_status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.item_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.item_tax}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.shipping_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.shipping_tax}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.gift_wrap_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.gift_wrap_tax}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.item_promotion_discount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.ship_promotion_discount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.ship_city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.ship_state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.ship_postal_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.ship_country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.promotion_ids}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.is_business_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.purchase_order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.price_designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.is_iba ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.buyer_citizen_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.buyer_citizen_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.order_invoice_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.invoice_business_legal_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.invoice_business_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.invoice_business_tax_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                      {row.invoice_business_tax_office}
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
