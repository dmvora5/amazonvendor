"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useGetInventoryQuery } from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function DataTableDemo() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, isSuccess, isError, error, refetch } = useGetInventoryQuery({
    time: "7d",
    page,
    limit,
  } );

  useEffect(() => {
    if (!error) return;
    parseAndShowErrorInToast(error);
  }, [error]);

  console.log({ data, isLoading, isSuccess, isError, error });
  const totalPages = Math.ceil(((data as any)?.count || 0) / limit);
  const currentPage = page;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPaginationNumbers = () => {
    const maxPagesToShow = 5; // Adjust how many pages to display before adding "..."
    const pageNumbers = [];

    if (totalPages <= maxPagesToShow) {
      // Show all pages if they are few
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push("...");
      }

      // Show surrounding pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="w-full rounded-2xl">
      <div className="flex items-center py-4 justify-between">
        {/* <Link href={PAGE_ROUTES.SUPERADMIN.CREATEUSER} className="p-2">
          <Button variant="link">FBA Inventory</Button>
        </Link> */}
      </div>
      {!isLoading ? (
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
                {((data as any)?.results || []).map(
                  (row: any, index: number) => (
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
                  )
                )}
              </tbody>
            </table>
          </div>
          <Pagination className="p-4">
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  // disabled={currentPage === 1}
                />
              </PaginationItem>

              {/* Page Numbers */}
              {renderPaginationNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page as number)}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  // disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
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
