'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export type Order = {
  amazon_order_id: string;
  merchant_order_id: string;
  purchase_date: string;
  last_updated_date: string;
  order_status: string;
  fulfillment_channel: string;
  sales_channel: string;
  order_channel: string;
  url: string;
  ship_service_level: string;
  product_name: string;
  sku: string;
  asin: string;
  item_status: string;
  quantity: number;
  currency: string;
  item_price: number;
  item_tax: number;
  shipping_price: number;
  shipping_tax: number;
  gift_wrap_price: number;
  gift_wrap_tax: number;
  item_promotion_discount: number;
  ship_promotion_discount: number;
  ship_city: string;
  ship_state: string;
  ship_postal_code: string;
  ship_country: string;
  promotion_ids: string;
  is_business_order: boolean;
  purchase_order_number: string;
  price_designation: string;
  is_iba: boolean;
  buyer_citizen_name: string;
  buyer_citizen_id: string;
  order_invoice_type: string;
  invoice_business_legal_name: string;
  invoice_business_address: string;
  invoice_business_tax_id: string;
  invoice_business_tax_office: string;
};

const ThirtyDaysTable = ({ isLoading, data }: any) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Order>[] = [
    { accessorKey: "amazon_order_id", header: "Amazon Order ID" },
    { accessorKey: "merchant_order_id", header: "Merchant Order ID" },
    { accessorKey: "purchase_date", header: "Purchase Date" },
    { accessorKey: "last_updated_date", header: "Last Updated Date" },
    { accessorKey: "order_status", header: "Order Status" },
    { accessorKey: "fulfillment_channel", header: "Fulfillment Channel" },
    { accessorKey: "sales_channel", header: "Sales Channel" },
    { accessorKey: "order_channel", header: "Order Channel" },
    { accessorKey: "url", header: "URL" },
    { accessorKey: "ship_service_level", header: "Ship Service Level" },
    { accessorKey: "product_name", header: "Product Name" },
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "asin", header: "ASIN" },
    { accessorKey: "item_status", header: "Item Status" },
    { accessorKey: "quantity", header: "Quantity" },
    { accessorKey: "currency", header: "Currency" },
    { accessorKey: "item_price", header: "Item Price" },
    { accessorKey: "item_tax", header: "Item Tax" },
    { accessorKey: "shipping_price", header: "Shipping Price" },
    { accessorKey: "shipping_tax", header: "Shipping Tax" },
    { accessorKey: "gift_wrap_price", header: "Gift Wrap Price" },
    { accessorKey: "gift_wrap_tax", header: "Gift Wrap Tax" },
    { accessorKey: "item_promotion_discount", header: "Item Promotion Discount" },
    { accessorKey: "ship_promotion_discount", header: "Ship Promotion Discount" },
    { accessorKey: "ship_city", header: "Ship City" },
    { accessorKey: "ship_state", header: "Ship State" },
    { accessorKey: "ship_postal_code", header: "Ship Postal Code" },
    { accessorKey: "ship_country", header: "Ship Country" },
    { accessorKey: "promotion_ids", header: "Promotion IDs" },
    { accessorKey: "is_business_order", header: "Is Business Order" },
    { accessorKey: "purchase_order_number", header: "Purchase Order Number" },
    { accessorKey: "price_designation", header: "Price Designation" },
    { accessorKey: "is_iba", header: "Is IBA" },
    { accessorKey: "buyer_citizen_name", header: "Buyer Citizen Name" },
    { accessorKey: "buyer_citizen_id", header: "Buyer Citizen ID" },
    { accessorKey: "order_invoice_type", header: "Order Invoice Type" },
    { accessorKey: "invoice_business_legal_name", header: "Invoice Business Legal Name" },
    { accessorKey: "invoice_business_address", header: "Invoice Business Address" },
    { accessorKey: "invoice_business_tax_id", header: "Invoice Business Tax ID" },
    { accessorKey: "invoice_business_tax_office", header: "Invoice Business Tax Office" },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="rounded-2xl border p-5 bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
      </Table>
    </div>
  );
};

export default ThirtyDaysTable;
