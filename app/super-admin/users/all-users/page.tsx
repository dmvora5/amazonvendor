"use client"



import { ArrowUpDown, ChevronDown, Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"


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
import { useDeleteUserMutation, useGetAllUsersQuery } from "@/redux/apis/usersApis";
import UsersTable from "@/components/super-admin/UsersTable"
import { parseAndShowErrorInToast } from "@/utils"





function DataTableDemo() {

    const router = useRouter();

    // const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(false);


    const { data, isLoading, isSuccess, isError, error } =
        useGetAllUsersQuery({});

    const [submit, deleteUserOption] = useDeleteUserMutation();

    console.log('deleteUserOption', deleteUserOption)

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
            toast.success('User deleted successfully');
        }
    }, [deleteUserOption?.isSuccess])

    console.log({ data, isLoading, isSuccess, isError, error })

    // async function deleteUser(id: string) {
    //     try {
    //         // setLoading(true);
    //         const response = await axiosInstance.delete(API_ROUTES.SUPERADMIN.DELETEUESR + id + "/");
    //         console.log('response', response)
    //         if (response.status === 200) {
    //             toast.success('User deleted successfully');
    //             // await fetchUsers();
    //         }
    //     } catch (err) {
    //         if (err instanceof AxiosError) {
    //             toast.error(err.response?.data?.detail)
    //         }
    //     } finally {
    //         // setLoading(false);
    //     }
    // }

    function gotoDetailsPage(id: string) {
        router.push(PAGE_ROUTES.SUPERADMIN.USERDETAILS + id);
    }



    // async function fetchUsers() {
    //     try {
    //         setLoading(true);
    //         const response = await axiosInstance.get(API_ROUTES.SUPERADMIN.GETALLUSERS);
    //         if (response.status === 200) {
    //             setData(response.data);
    //         }
    //     } catch (err) {
    //         console.log('err', err)
    //     } finally {
    //         setLoading(false);
    //     }
    // }
    // console.log('data', data)

    // useEffect(() => {
    //     fetchUsers();
    // }, [])



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
            {isSuccess ?
                <UsersTable isLoading={isLoading || deleteUserOption.isLoading} gotoDetailsPage={gotoDetailsPage} deleteUser={submit} data={data} />
                : <p className="w-full text-center"> Loading...</p>
            }
        </div>
    )
}


export default DataTableDemo