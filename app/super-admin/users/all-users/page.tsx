"use client"



import { Button } from "@/components/ui/button"




import Link from "next/link"
import { PAGE_ROUTES } from "@/constant/routes"
import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useDeleteUserMutation, useGetAllUsersQuery } from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils"
import { Edit, Trash } from "lucide-react"
import LoadingSpinner from "@/components/Loader"
import Image from "next/image"





function DataTableDemo() {

    const router = useRouter();

    // const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(false);


    const { data, isLoading, isSuccess, isError, error } =
        useGetAllUsersQuery({});

    const [deleteUser, deleteUserOption] = useDeleteUserMutation();

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
                {/* <Link href={PAGE_ROUTES.SUPERADMIN.CREATEUSER} className="p-2">
                    <Button variant="link">
                        Add User
                    </Button>
                </Link> */}
                {/* <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm bg-white rounded-full p-5"
                /> */}

            </div>
            {isLoading &&
                <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={24}
                    height={24}
                    className="animate-spin bg-brand mx-auto absolute top-[50%] left-[50%]"
                />
            }
            {isSuccess &&
                <div className="flex-1 p-6 overflow-hidden">
                    <div className="relative overflow-x-auto overflow-y-hidden shadow-md sm:rounded-lg h-full">
                        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
                            {/* Table Header */}
                            <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold min-w-52">Frist Name</th>
                                    <th className="px-6 py-4 text-left font-semibold min-w-52">Last Name</th>
                                    <th className="px-6 py-4 text-left font-semibold min-w-52">Email</th>
                                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
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
                                        {/* Actions Column */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                            <Button
                                                disabled={isLoading || deleteUserOption.isLoading}
                                                onClick={() => gotoDetailsPage(row?.id)}
                                                className="text-[#006838] hover:bg-[#006838] hover:text-white transition-all duration-200"
                                                variant="link"
                                            >
                                                <Edit />
                                            </Button>
                                            <Button
                                                disabled={isLoading || deleteUserOption.isLoading}
                                                onClick={() => deleteUser(row?.id)}
                                                className="text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                                                variant="link"
                                            >
                                                <Trash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            }


        </div>
    )
}


export default DataTableDemo