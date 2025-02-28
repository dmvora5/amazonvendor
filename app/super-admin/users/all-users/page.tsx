"use client"

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
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { ArrowUpDown, ChevronDown, Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { API_ROUTES, PAGE_ROUTES } from "@/constant/routes"
import { useEffect, useState } from "react"
import axiosInstance from "@/utils/axiosInstance"
import Image from "next/image"
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "react-toastify";


export type User = {
    id: string
    first_name: string
    last_name: string
    email: string
}



function DataTableDemo() {

    const router = useRouter();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({});


    async function deleteUser(id: string) {
        try {
            setLoading(true);
            const response = await axiosInstance.delete(API_ROUTES.SUPERADMIN.DELETEUESR + id + "/");
            console.log('response', response)
            if(response.status === 200) {
                await fetchUsers();
            }
        } catch (err) {
            if(err instanceof AxiosError) {
                toast.error(err.response?.data?.detail)
            }
        } finally {
            setLoading(false);
        }
    }

    function gotoDetailsPage(id: string) {
        router.push(PAGE_ROUTES.SUPERADMIN.USERDETAILS + id);
    }

    const columns: ColumnDef<User>[] = [

        {
            accessorKey: "first_name",
            header: "Frist Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("first_name")}</div>
            ),
        },
        {
            accessorKey: "last_name",
            header: "Last Name",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("last_name")}</div>
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                        {/* <ArrowUpDown /> */}
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
        },

        {
            accessorKey: "id",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const id: any = row.getValue('id');
                return (
                    <div className="flex gap-2 justify-center">
                        <Button
                            size="sm"
                            className="bg-brand"
                            disabled={loading}
                            onClick={() => gotoDetailsPage(id)}
                        >
                            <Edit />
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button disabled={loading} variant="destructive" size="sm"><Trash /></Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] space-y-6 text-center">
                                <DialogHeader>
                                    <DialogTitle>Delete User</DialogTitle>
                                </DialogHeader>
                                <Separator />
                                <h1 className="text-4xl">

                                    Are You Sure!
                                </h1>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                            Close
                                        </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button variant="destructive" type="button" onClick={() => deleteUser(id)}>Delete</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            },
        },
    ]

    async function fetchUsers() {
        try {
            setLoading(true);
            const response = await axiosInstance.get(API_ROUTES.SUPERADMIN.GETALLUSERS);
            if (response.status === 200) {
                setData(response.data);
            }
        } catch (err) {
            console.log('err', err)
        } finally {
            setLoading(false);
        }
    }
    console.log('data', data)

    useEffect(() => {
        fetchUsers();
    }, [])

    const table = useReactTable({
        data,
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
    })

    return (
        <div className="w-full rounded-2xl">
            <div className="flex items-center py-4 justify-between">
                <Link href={PAGE_ROUTES.SUPERADMIN.CREATEUSER} className="p-2">
                    <Button variant="link">
                        Add User
                    </Button>
                </Link>
                {/* <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-white rounded-full p-5"
                /> */}

            </div>
            <div className="rounded-2xl border p-5 bg-white">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {loading ?
                                        <p>Loading...</p> : !loading && columns.length == 0 && "No results."}

                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}


export default DataTableDemo