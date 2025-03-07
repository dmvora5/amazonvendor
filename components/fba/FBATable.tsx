'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
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
import { Button } from "../ui/button";

export type InventoryItem = {
  sku: string;
  fnsku: string;
  asin: string;
  productName: string;
  condition: string;
  yourPrice: number;
  mfnListingExists: boolean;
  mfnFulfillableQuantity: number;
  afnListingExists: boolean;
  afnWarehouseQuantity: number;
  afnFulfillableQuantity: number;
  afnUnsellableQuantity: number;
  afnReservedQuantity: number;
  afnTotalQuantity: number;
  perUnitVolume: number;
  afnInboundWorkingQuantity: number;
  afnInboundShippedQuantity: number;
  afnInboundReceivingQuantity: number;
  afnResearchingQuantity: number;
  afnReservedFutureSupply: number;
  afnFutureSupplyBuyable: number;
  afnFulfillableQuantityLocal: number;
  afnFulfillableQuantityRemote: number;
  totalPending: number;
  totalNewInbound: number;
  totalInbound: number;
  totalAsinStockedQuantity: number;
  sevenDays: number;
  eightToFourteenDays: number;
  fourteenDays: number;
  fifteenToThirtyDays: number;
  thirtyDays: number;
  reorder: boolean;
  saleRateCalculation: number;
  order: number;
  twoWeeksSalesRate: number;
  twoWeeksOrder: number;
  sixWeeksSalesRate: number;
  sixWeeksOrder: number;
  twoMonthsSalesRate: number;
  twoMonthsOrder: number;
  threeMonthsSalesRate: number;
  threeMonthsOrder: number;
  fourWeeksSalesRateBasedOn14DaysSale: number;
  fourWeeksOrderBasedOn14DaysSale: number;
  listOrderFormula: string;
};

const FBATable = ({ isLoading, data }: any) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<InventoryItem>[] = [
    { accessorKey: "sku", header: "SKU" },
    { accessorKey: "fnsku", header: "FNSKU" },
    { accessorKey: "asin", header: "ASIN" },
    { accessorKey: "productName", header: "Product Name" },
    { accessorKey: "condition", header: "Condition" },
    { accessorKey: "yourPrice", header: "Your Price" },
    { accessorKey: "mfnListingExists", header: "MFN Listing Exists" },
    { accessorKey: "mfnFulfillableQuantity", header: "MFN Fulfillable Quantity" },
    { accessorKey: "afnListingExists", header: "AFN Listing Exists" },
    { accessorKey: "afnWarehouseQuantity", header: "AFN Warehouse Quantity" },
    { accessorKey: "afnFulfillableQuantity", header: "AFN Fulfillable Quantity" },
    { accessorKey: "afnUnsellableQuantity", header: "AFN Unsellable Quantity" },
    { accessorKey: "afnReservedQuantity", header: "AFN Reserved Quantity" },
    { accessorKey: "afnTotalQuantity", header: "AFN Total Quantity" },
    { accessorKey: "perUnitVolume", header: "Per Unit Volume" },
    { accessorKey: "afnInboundWorkingQuantity", header: "AFN Inbound Working Quantity" },
    { accessorKey: "afnInboundShippedQuantity", header: "AFN Inbound Shipped Quantity" },
    { accessorKey: "afnInboundReceivingQuantity", header: "AFN Inbound Receiving Quantity" },
    { accessorKey: "afnResearchingQuantity", header: "AFN Researching Quantity" },
    { accessorKey: "afnReservedFutureSupply", header: "AFN Reserved Future Supply" },
    { accessorKey: "afnFutureSupplyBuyable", header: "AFN Future Supply Buyable" },
    { accessorKey: "totalPending", header: "Total Pending" },
    { accessorKey: "totalNewInbound", header: "Total New Inbound" },
    { accessorKey: "totalInbound", header: "Total Inbound" },
    { accessorKey: "totalAsinStockedQuantity", header: "Total ASIN Stocked Quantity" },
    { accessorKey: "saleRateCalculation", header: "Sale Rate Calculation" },
    { accessorKey: "order", header: "Order" },
    { accessorKey: "twoWeeksSalesRate", header: "2 Weeks Sales Rate" },
    { accessorKey: "twoWeeksOrder", header: "2 Weeks Order" },
    { accessorKey: "sixWeeksSalesRate", header: "6 Weeks Sales Rate" },
    { accessorKey: "sixWeeksOrder", header: "6 Weeks Order" },
    { accessorKey: "listOrderFormula", header: "List Order Formula" },
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
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  return (
    <div className="rounded-2xl border p-5 bg-white">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FBATable;
