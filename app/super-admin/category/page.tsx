"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/apis/usersApis";
import { parseAndShowErrorInToast } from "@/utils";
import { Edit } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CategoryTables() {
  const router = useRouter();
  const { data, isLoading, isSuccess, error } = useGetAllCategoryQuery({});
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  useEffect(() => {
    if (!error) return;
    parseAndShowErrorInToast(error);
  }, [error]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSelectedCategory((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle updating the category
  const handleSaveChanges = async () => {
    try {
      await updateCategory(selectedCategory).unwrap();
      toast.success("Category updated successfully");
      setSelectedCategory(null); // Close modal after success
    } catch (err) {
      parseAndShowErrorInToast(err);
    }
  };

  return (
    <div className="w-full rounded-2xl">
      {isLoading && (
        <Image
          src="/assets/icons/loader.svg"
          alt="loader"
          width={24}
          height={24}
          className="animate-spin bg-brand mx-auto absolute top-[50%] left-[50%]"
        />
      )}

      {isSuccess && (
        <div className="flex-1 p-6 overflow-hidden">
          <div className="relative overflow-x-auto overflow-y-hidden shadow-md sm:rounded-lg h-full">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg">
              <thead className="text-xs uppercase bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    Actions
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    0 to 2000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    2000 to 5000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    5000 to 10000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    10000 to 30000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    30000 to 60000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    60000 to 80000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    80000 to 100000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    100000 to 150000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    150000 to 200000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    200000 to 350000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    350000 to 500000
                  </th>
                  <th className="px-6 py-4 text-left font-semibold min-w-52">
                    More Than 500000
                  </th>
                </tr>
              </thead>
              <tbody>
                {((data as any) || []).map((row: any, index: number) => (
                  <tr
                    key={row.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-200  dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-700 rounded-lg transition duration-200 ease-in-out`}
                  >
                    <td className="px-6 py-4">{row.category}</td>
                    <td className="px-6 py-4">
                      {/* Edit Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setSelectedCategory(row)}
                            className="text-[#006838] hover:bg-[#006838] hover:text-white"
                            variant="link"
                          >
                            <Edit />
                          </Button>
                        </DialogTrigger>
                        {selectedCategory && (
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>
                                Edit Category{" "}
                                {selectedCategory &&
                                  `- ${selectedCategory?.category}`}
                              </DialogTitle>
                            </DialogHeader>

                            {/* Form Fields */}
                            <div className="grid gap-4 py-4">
                              {[
                                { id: "sr_0_to_2k", label: "0 to 2000" },
                                { id: "sr_2k_to_5k", label: "2000 to 5000" },
                                { id: "sr_5k_to_10k", label: "5000 to 10000" },
                                {
                                  id: "sr_10k_to_30k",
                                  label: "10000 to 30000",
                                },
                                {
                                  id: "sr_30k_to_60k",
                                  label: "30000 to 60000",
                                },
                                {
                                  id: "sr_60k_to_80k",
                                  label: "60000 to 80000",
                                },
                                {
                                  id: "sr_80k_to_100k",
                                  label: "80000 to 100000",
                                },
                                {
                                  id: "sr_100k_to_150k",
                                  label: "100000 to 150000",
                                },
                                {
                                  id: "sr_150k_to_200k",
                                  label: "150000 to 200000",
                                },
                                {
                                  id: "sr_200k_to_350k",
                                  label: "200000 to 350000",
                                },
                                {
                                  id: "sr_350k_to_500k",
                                  label: "350000 to 500000",
                                },
                                { id: "sr_gt_500k", label: "More Than 500000" },
                              ]
                                .reduce((rows, item, index, arr) => {
                                  if (index % 2 === 0) {
                                    rows.push([item, arr[index + 1] || null]); // Pairing two items in one row
                                  }
                                  return rows;
                                }, [] as any[][])
                                .map(([item1, item2]) => (
                                  <div
                                    key={item1.id}
                                    className="grid grid-cols-8 items-center gap-4"
                                  >
                                    {/* First Input */}
                                    <Label
                                      htmlFor={item1.id}
                                      className="col-span-2 text-right"
                                    >
                                      {item1.label}
                                    </Label>
                                    <Input
                                      id={item1.id}
                                      value={selectedCategory[item1.id] || ""}
                                      onChange={handleInputChange}
                                      className="col-span-2"
                                    />

                                    {/* Second Input (if exists) */}
                                    {item2 && (
                                      <>
                                        <Label
                                          htmlFor={item2.id}
                                          className="col-span-2 text-right"
                                        >
                                          {item2.label}
                                        </Label>
                                        <Input
                                          id={item2.id}
                                          value={
                                            selectedCategory[item2.id] || ""
                                          }
                                          onChange={handleInputChange}
                                          className="col-span-2"
                                        />
                                      </>
                                    )}
                                  </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <DialogFooter>
                              <Button
                                type="button"
                                className="bg-blue-500"
                                onClick={handleSaveChanges}
                                disabled={isUpdating}
                              >
                                {isUpdating ? "Saving..." : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>
                    </td>
                    <td className="px-6 py-4">{row.sr_0_to_2k}</td>
                    <td className="px-6 py-4">{row.sr_2k_to_5k}</td>
                    <td className="px-6 py-4">{row.sr_5k_to_10k}</td>
                    <td className="px-6 py-4">{row.sr_10k_to_30k}</td>
                    <td className="px-6 py-4">{row.sr_30k_to_60k}</td>
                    <td className="px-6 py-4">{row.sr_60k_to_80k}</td>
                    <td className="px-6 py-4">{row.sr_80k_to_100k}</td>
                    <td className="px-6 py-4">{row.sr_100k_to_150k}</td>
                    <td className="px-6 py-4">{row.sr_150k_to_200k}</td>
                    <td className="px-6 py-4">{row.sr_200k_to_350k}</td>
                    <td className="px-6 py-4">{row.sr_350k_to_500k}</td>
                    <td className="px-6 py-4">{row.sr_gt_500k}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryTables;
