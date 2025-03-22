"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { PAGE_ROUTES } from "@/constant/routes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useGetAllInventoryListQuery } from "@/redux/apis/usersApis";
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

  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetAllInventoryListQuery({
      page,
      limit,
    });

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
                    Item Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Item Description
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Listing ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Seller SKU
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Open Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Image URL
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Item is Marketplace
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Product ID Type
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Zshop Shipping Fee
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Item Note
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Item Condition
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Zshop Category1
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Zshop Browse Path
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Zshop Storefront Feature
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    ASIN1
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    ASIN2
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    ASIN3
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Will Ship Internationally
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Expedited Shipping
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Zshop Boldface
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Product ID
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Bid for Featured Placement
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Add/Delete
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Pending Quantity
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Fulfillment Channel
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Merchant Shipping Group
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Minimum Order Quantity
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
                        {row.item_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.item_description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.listing_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.seller_sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.open_date
                          ? new Date(row.open_date).toLocaleString()
                          : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.image_url}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.item_is_marketplace ? "Yes" : "No"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.product_id_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.zshop_shipping_fee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.item_note}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.item_condition}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.zshop_category1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.zshop_browse_path}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.zshop_storefront_feature}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.asin1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.asin2}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.asin3}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.will_ship_internationally}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.expedited_shipping}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.zshop_boldface}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.product_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.bid_for_featured_placement}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.add_delete}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.pending_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.fulfillment_channel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.merchant_shipping_group}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap transform transition-all duration-300 ease-in-out hover:scale-105 hover:translate-x-2 hover:translate-y-2 hover:shadow-2xl rounded-md">
                        {row.minimum_order_quantity}
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
