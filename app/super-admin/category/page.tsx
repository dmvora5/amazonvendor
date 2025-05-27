"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
  useAddCategoryMutation,
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProcessLoader from "@/components/ProcessLoader";
import ApiState from "@/components/ApiState";

function CategoryTables() {
  const { data, isLoading, isSuccess, error } = useGetAllCategoryQuery({});
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [addCategory, { isLoading: isAdding, error: isE , isSuccess: isS}] = useAddCategoryMutation();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  console.log("🚀 ~ CategoryTables ~ selectedCategory:", selectedCategory);

  useEffect(() => {
    if (error) {
      parseAndShowErrorInToast(error);
    }
  }, [error]);

  // Handle input changes in the modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setSelectedCategory((prev: any) => ({
      ...prev,
      [id]:
        id === "category"
          ? value
          : value === ""
            ? ""
            : parseInt(value, 10) || 0,
    }));
  };

  // Handle saving new or updated category
  const handleSaveChanges = async () => {
    try {
      const formattedData = {
        ...selectedCategory,
        ...Object.fromEntries(
          priceFields.map(({ id }) => [
            id,
            selectedCategory[id] === "" ? 0 : selectedCategory[id],
          ])
        ),
      };

      if (selectedCategory?.id) {
        await updateCategory(formattedData).unwrap();
        toast.success("Category updated successfully");
      } else {
        await addCategory(formattedData).unwrap();
        toast.success("Category added successfully");
      }

      setSelectedCategory(null); // Close modal
    } catch (err) {
      parseAndShowErrorInToast(err);
    }
  };

  // List of fields for price ranges
  const priceFields = [
    { id: "sr_0_to_2k", label: "0 to 2000" },
    { id: "sr_2k_to_5k", label: "2000 to 5000" },
    { id: "sr_5k_to_10k", label: "5000 to 10000" },
    { id: "sr_10k_to_30k", label: "10000 to 30000" },
    { id: "sr_30k_to_60k", label: "30000 to 60000" },
    { id: "sr_60k_to_80k", label: "60000 to 80000" },
    { id: "sr_80k_to_100k", label: "80000 to 100000" },
    { id: "sr_100k_to_150k", label: "100000 to 150000" },
    { id: "sr_150k_to_200k", label: "150000 to 200000" },
    { id: "sr_200k_to_350k", label: "200000 to 350000" },
    { id: "sr_350k_to_500k", label: "350000 to 500000" },
    { id: "sr_gt_500k", label: "More Than 500000" },
  ];

  return (
    <div className="w-full rounded-2xl">
      {/* Loader */}
      {isLoading && (
        <ProcessLoader className="mx-auto absolute top-[50%] left-[50%]" />
      )}

      {/* Add Category Button (Left-Aligned) */}
      <div className="flex justify-end items-center mb-4">
        <Button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={() =>
            setSelectedCategory({
              category: "",
              ...Object.fromEntries(priceFields.map(({ id }) => [id, ""])),
            })
          }
        >
          Add Category
        </Button>
      </div>
      <ApiState error={error} isSuccess={isSuccess}>
        <ApiState.ArthorizeCheck />
      </ApiState>

      <ApiState error={isE} isSuccess={isS}>
        <ApiState.ArthorizeCheck />
      </ApiState>


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
                  {priceFields.map((field) => (
                    <th
                      key={field.id}
                      className="px-6 py-4 text-left font-semibold min-w-52"
                    >
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {((data as any) || []).map((row: any, index: number) => (
                  <tr
                    key={row.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-200 dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-700 rounded-lg transition duration-200`}
                  >
                    <td className="px-6 py-4">{row.category}</td>
                    <td className="px-6 py-4">
                      {/* Edit Button */}
                      <Button
                        onClick={() => setSelectedCategory(row)}
                        className="text-[#006838] hover:bg-[#006838] hover:text-white"
                        variant="link"
                      >
                        <Edit />
                      </Button>
                    </td>
                    {priceFields.map((field) => (
                      <td key={field.id} className="px-6 py-4">
                        {row[field.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      <Dialog
        open={!!selectedCategory}
        onOpenChange={() => setSelectedCategory(null)}
      >
        {selectedCategory && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedCategory?.id ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>

            {/* Form Fields */}
            <div className="grid gap-4 py-4">
              {/* Category Name (Inline Label & Input) */}
              <div className="flex items-center gap-4">
                <Label htmlFor="category" className="font-medium min-w-[150px]">
                  Category Name
                </Label>
                <Input
                  id="category"
                  value={selectedCategory.category || ""}
                  onChange={handleInputChange}
                  className="flex-1"
                />
              </div>

              {/* Price Fields (Two per Row with Inline Labels) */}
              <div className="grid grid-cols-2 gap-4">
                {priceFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-4">
                    {/* Field Label */}
                    <Label
                      htmlFor={field.id}
                      className="min-w-[150px] text-right font-medium"
                    >
                      {field.label}
                    </Label>
                    {/* Field Input */}
                    <Input
                      id={field.id}
                      value={
                        selectedCategory[field.id] === 0
                          ? "0"
                          : selectedCategory[field.id] || ""
                      }
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
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
    </div>
  );
}

export default CategoryTables;
