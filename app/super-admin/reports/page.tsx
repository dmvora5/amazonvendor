"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { FixedSizeList as List } from "react-window"; // Import react-window
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetReportQuery,
  useUpdateReportMutation,
} from "@/redux/apis/usersApis";
import Image from "next/image";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ReactSelect from "react-select";
import ProcessLoader from "@/components/ProcessLoader";
import axios, { AxiosError } from "axios"
import { API_ROUTES } from "@/constant/routes";
import { parseAndShowErrorInToast } from "@/utils";
import { getSession } from "next-auth/react";

const options = [
  { value: "fba_inventory", label: "FBA Inventory" },
  { value: "all_inventory", label: "All Inventory" },
  { value: "channel_max", label: "Channel Max" },
  { value: "order_history", label: "Order History" },
  { value: "current_inventory", label: "Current Inventory" },
  // { value: "project_database", label: "Project Database" },
  { value: "shipped_history", label: "Shipped History" },
];

const InputComponent = memo(
  ({
    originalData,
    data,
    index,
    keyData,
    setData,
    setDirty,
    disabled,
  }: any) => {
    const row = data[index];
    const [state, setState] = useState<string>(row[keyData]);
    const [initialOrder] = useState(originalData[index]?.Order || 0);

    const handleChange = (e: any) => {
      const { name, value } = e.target;
      setState(value);

      // Clone the data to avoid mutating originalData
      const updatedData = [...data];

      // if (keyData.includes("Supplier ")) {
      //   const supplierColumns = Object.keys(updatedData[index]).filter((key) =>
      //     key.includes("Supplier ")
      //   );
      //   let totalSupplierValue = 0;

      //   supplierColumns.forEach((supplierColumn) => {
      //     totalSupplierValue +=
      //       parseFloat(updatedData[index][supplierColumn]) || 0;
      //   });

      //   updatedData[index]["Total New Inbound"] = totalSupplierValue;
      //   let updatedOrder = initialOrder - totalSupplierValue;

      //   updatedData[index]["Order"] = updatedOrder;
      // }

      // Now setData updates `data`, not `originalData`
      // setData(updatedData);
    };

    const handleBlur = (e: any) => {
      const newData: any = [...data];
      newData[index][keyData] = e.target.value;
      const oriNewData: any = [...originalData];

      if (keyData.includes("Supplier")) {
        const supplierColumns = Object.keys(newData[index]).filter((key) =>
          key.includes("Supplier")
        );
        let totalSupplierValue = 0;

        supplierColumns.forEach((supplierColumn) => {
          totalSupplierValue += parseFloat(newData[index][supplierColumn]) || 0;
        });

        let updatedOrder = initialOrder - totalSupplierValue;

        if (updatedOrder < 0) {
          supplierColumns.forEach((supplierColumn) => {
            newData[index][supplierColumn] = oriNewData[index][supplierColumn];
          });
          // newData[index]["Order"] = oriNewData[index]["Order"];
          newData[index]["Total New Inbound"] =
            oriNewData[index]["Total New Inbound"];
        } else {
          // newData[index]["Order"] = updatedOrder;
          newData[index]["Total New Inbound"] = totalSupplierValue;
        }
        setData(newData);
        setDirty(true);
      } else {
        // Update `data`, not `originalData`
        setData(newData);
        setDirty(true);
      }
    };

    // const handleBlur = (e: any) => {
    //   const newData: any = [...data];
    //   newData[index][keyData] = e.target.value;

    //   // If the "Supplier A Order" or "Supplier B Order" column is updated, recalculate "Order"
    //   // if (keyData === "Supplier A Order" || keyData === "Supplier B Order") {
    //   //   const supplierAOrder = parseFloat(newData[index]["Supplier A Order"]) || 0;
    //   //   const supplierBOrder = parseFloat(newData[index]["Supplier B Order"]) || 0;
    //   //   newData[index]["Order"] = supplierAOrder + supplierBOrder;
    //   // }

    //   setData(newData);
    //   setDirty(true); // Set dirty flag when data is changed
    // };

    return (
      <Input
        value={state}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  }
);

const ExcelEditor = () => {
  const [data, setData] = useState<any[]>([]); // Holds filtered data
  const [originalData, setOriginalData] = useState<any[]>([]); // Holds original data
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>(""); // Selected column for new column
  const [selectedValue, setSelectedValue] = useState<string>("current_inventory");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [openSumModel, setOpenSumModel] = useState(false);
  const [selectedSumColumns, setSelectedSumColumns] = useState<string[]>([]);
  const [newSumColumnName, setSumNewColumnName] = useState("");
  const [selectedDateColumns, setSelectedDateColumns] = useState<string[]>([]);

  const [originalDataTemp, setOriginalDatatmp] = useState<any[]>([]); // Holds original data


  const rowHeight = 50;
  const containerHeight = 500;
  const columnWidth = 250;

  const listRef = useRef<any>(null);

  const columnOptions = Object.keys(originalData[0] || {})
    .filter((key) => key.startsWith("Supplier"))
    .map((key) => ({
      value: key,
      label: key,
    }));

  const {
    data: queryData,
    isLoading,
    error,
    isFetching,
  } = useGetReportQuery(selectedValue);

  const [submit, uploadOptions] = useUpdateReportMutation();

  const fetchCSVFromBackend = useCallback(async (url: string) => {
    try {
      setLoading(true);

      const response = await fetch(url);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      const wb = XLSX.read(arrayBuffer, { type: "array" });  // Using array instead of string type
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json: any = XLSX.utils.sheet_to_json(sheet, { defval: null }); // Default empty cells to null
      console.log('json', json)

      setOriginalData(JSON.parse(JSON.stringify(json))); // Save original data
      setData(json); // Also set filtered data initially to the original data
      if (json.length) {
        const key = Object.keys(json[0]);
        setSelectedColumn(key[0]);
      }
    } catch (error) {
      console.log("Error fetching CSV/TSV:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!(queryData as any)?.file_url) return;
    fetchCSVFromBackend((queryData as any)?.file_url);
  }, [queryData, fetchCSVFromBackend]);

  useEffect(() => {
    if (!uploadOptions.isSuccess) return;
    setDirty(false);
  }, [uploadOptions.isSuccess]);

  // // Function to handle adding a new column after the selected column
  // const handleAddColumn = () => {
  //   if (newColumnName.trim() && selectedColumn) {
  //     const headerObject = { ...originalData[0] }; // Copy the header object
  //     const headerKeys = Object.keys(headerObject); // Get all the column keys
  //     const selectedIndex = headerKeys.indexOf(selectedColumn); // Find the index of the selected column

  //     if (selectedIndex === -1) return; // If selected column is not found, return

  //     // Step 1: Insert the new column key into the header keys array at the correct position
  //     headerKeys.splice(selectedIndex + 1, 0, newColumnName); // Insert after selected column

  //     // Step 2: Rebuild the header object with the new column added
  //     const newHeaderObject: any = {};
  //     headerKeys.forEach((key) => {
  //       newHeaderObject[key] = headerObject[key] || null; // Keep existing keys and add the new column with an empty value
  //     });

  //     // Step 3: Update each row in originalData to reflect the new column (set the new column to null or empty string)
  //     const updatedData = originalData.map((row, index) => {
  //       if (index === 0) return newHeaderObject; // If it's the header row, update it

  //       const updatedRow = { ...row };

  //       // Add new column with null or empty string for all rows
  //       updatedRow[newColumnName] = null; // New column with null value for existing rows

  //       // Ensure rows are updated correctly according to the new column order
  //       const reorderedRow: any = {};
  //       headerKeys.forEach((key) => {
  //         reorderedRow[key] = updatedRow[key] || null; // Ensure each row has the same order as header
  //       });

  //       return reorderedRow;
  //     });

  //     // Step 4: Update both the header and the rows with the new column
  //     // setOriginalData([newHeaderObject, ...updatedData]); // Set the updated header and rows
  //     setData([newHeaderObject, ...updatedData]); // Update filtered data (if used for searching)

  //     setNewColumnName(""); // Clear input after adding
  //     setDirty(true); // Mark as dirty after making changes
  //   }
  // };

  const handleAddColumn = () => {
    if (newColumnName.trim() && selectedColumn) {
      const headerKeys = Object.keys(originalData[0] || {});
      const selectedIndex = headerKeys.indexOf(selectedColumn);

      if (selectedIndex === -1) return;

      // Insert new column key after the selected column
      headerKeys.splice(selectedIndex + 1, 0, newColumnName);

      // Update each row with the new column at the correct position
      const updatedData = originalData.map((row) => {
        const updatedRow = { ...row, [newColumnName]: "" };

        const reorderedRow: any = {};
        headerKeys.forEach((key) => {
          reorderedRow[key] = updatedRow[key] || "";
        });

        return reorderedRow;
      });

      // Update the data (only once, no duplication of first row)
      setOriginalData(updatedData); // update your full source data
      setData(updatedData); // update visible data (filtered, if applicable)
      setNewColumnName("");
      setDirty(true);
    }
  };

  // Handle search
  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setData(originalData); // Reset to original data when search term is cleared
    } else {
      const filteredData = originalData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(term)
        )
      );
      setData(filteredData);
    }
  };

  // Table Row component
  const Row = ({ index, style }: any) => {
    const row = data[index];
    const oRow = originalData;
    return (
      <div
        style={style}
        className="flex border-b hover:bg-gray-50 overflow-x-hidden"
      >
        {Object.keys(row).map((key) => (
          <div
            key={key}
            className="px-4 py-2 flex-shrink-0"
            style={{ width: columnWidth }}
          >
            <InputComponent
              originalData={originalData}
              data={data}
              index={index}
              keyData={key}
              setData={setData}
              setDirty={setDirty}
              disabled={uploadOptions.isLoading}
            />
          </div>
        ))}
      </div>
    );
  };

  // Table Header component
  const Header = () => {
    if (!data || data.length === 0) return null;

    // Match keys that are dates in format: DD.MM.YY
    const isDateKey = (key: string) => /^\d{2}\.\d{2}\.\d{2}$/.test(key);

    return (
      <thead className="bg-gray-100 text-sm font-semibold text-gray-700 sticky top-0 z-10">
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th
              key={key}
              className="relative px-4 py-3 text-left"
              style={{ width: columnWidth }}
            >
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1">
                  {isDateKey(key) && (
                    <input
                      type="checkbox"
                      value={key}
                      checked={selectedDateColumns.includes(key)}
                      onChange={(e) => handleDateCheckboxChange(e, key)}
                    />
                  )}
                  <span>{key}</span>
                </div>

                {key !== "Action" && (
                  <button
                    disabled={uploadOptions.isLoading}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleRemoveColumn(key)}
                  >
                    <span className="text-lg">×</span>
                  </button>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const handleDateCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const checked = e.target.checked;

    let updatedData = [...data];

    updatedData = updatedData.map((row, idx) => {
      const oriRow = originalData[idx];
      const value = parseFloat(row[key]) || 0;
      let currentInbound = parseFloat(row["Total New Inbound"]) || 0;

      if (checked) {
        // Checkbox Checked => Subtract
        currentInbound -= value;
      } else {
        // Checkbox Unchecked => Add back
        currentInbound += value;
      }

      if (currentInbound < 0) {
        // If goes negative, revert the row
        const supplierColumns = Object.keys(row).filter((key) =>
          key.includes("Supplier")
        );
        const newRow = { ...row };
        supplierColumns.forEach((col) => {
          newRow[col] = oriRow[col];
        });
        newRow[key] = oriRow[key];
        newRow["Total New Inbound"] = oriRow["Total New Inbound"];
        return newRow;
      } else {
        return {
          ...row,
          "Total New Inbound": currentInbound,
        };
      }
    });

    if (checked) {
      setSelectedDateColumns((prev) => [...prev, key]);
    } else {
      setSelectedDateColumns((prev) => prev.filter((col) => col !== key));
    }

    setData(updatedData);
    setDirty(true);
  };

  // Handle column removal
  const handleRemoveColumn = (columnName: string) => {
    setOriginalData((prevData) =>
      prevData.map((row) => {
        const { [columnName]: _, ...rest } = row;
        return rest;
      })
    );

    setData((prevData) =>
      prevData.map((row) => {
        const { [columnName]: _, ...rest } = row;
        return rest;
      })
    );
    setDirty(true);
  };

  // Upload the CSV data
  const handleUploadCSV = async () => {
    try {
      setLoading(true)
      // Convert JSON data to CSV or TSV format
      const delimiter = "\t"; // We assume TSV for now, you can change this dynamically
      const sheet = XLSX.utils.json_to_sheet(data);

      let csvData = XLSX.utils.sheet_to_csv(sheet); // Default is CSV
      if (delimiter === "\t") {
        csvData = XLSX.utils.sheet_to_csv(sheet, { FS: delimiter }); // Convert to TSV if needed
      }

      // Create a FormData object
      const formData = new FormData();

      // Create a Blob from CSV or TSV data
      const csvBlob = new Blob([csvData], { type: "text/csv" });

      // Append the file to the FormData object
      formData.append("file", csvBlob, "data.csv"); // Use appropriate file extension based on format
      formData.append("report_type", selectedValue);
      formData.append("selected_date", selectedDateColumns.join(","));

      const session: any = await getSession();

      const { data: response } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}report/upload/update-report/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${session?.access_token}`
        }
      })

      setDirty(false);
      if (response?.file_url) {
        fetchCSVFromBackend(response?.file_url)
      }

    } catch (err: any) {
      if (err instanceof AxiosError) {
        parseAndShowErrorInToast(err?.response);
      } else {
        parseAndShowErrorInToast(err)
      }
    } finally {
      setLoading(false);
    }


    // await submit(formData);
    // await fetchCSVFromBackend()
  };

  const handleSumColumnModel = () => {
    setOpenSumModel(true); // open the modal
  };

  const handleCloseSumColumnModel = () => {
    setOpenSumModel(false); // open the modal
    setSelectedSumColumns([]); // Clear selected columns
    setSumNewColumnName(""); // Clear the sum column name input
  };

  const handleCreateSumColumn = () => {
    if (!newSumColumnName || selectedSumColumns.length === 0) {
      alert("Please select columns and enter a column name.");
      return;
    }

    // Check if the new sum column name already exists
    if (Object.keys(originalData[0]).includes(newSumColumnName)) {
      alert("Column name already exists. Please choose a different name.");
      return;
    }

    // Calculate the sum for the selected columns
    const updatedData = originalData.map((row) => {
      const sum = selectedSumColumns.reduce((acc, col) => {
        const val = parseFloat(row[col]) || 0; // Handle non-numeric values by defaulting to 0
        return acc + val;
      }, 0);

      // Create a new row with the sum and without the selected sum columns
      const newRow = { ...row, [newSumColumnName]: sum };

      // Remove the selected sum columns from the new row
      selectedSumColumns.forEach((col) => {
        delete newRow[col];
      });

      return newRow;
    });

    // Update the data with the new sum column
    setData(updatedData);
    setOpenSumModel(false); // Close the modal
    setSelectedSumColumns(selectedSumColumns || []); // Clear selected columns
    setSumNewColumnName(""); // Clear the sum column name input
    setDirty(true);
  };

  return (
    <div className="w-[95%] mx-auto p-6 bg-white rounded-lg shadow-lg">

      <div className="mb-4 space-x-2 flex items-center">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search"
          className="mr-4 p-3 border border-gray-300 rounded-md"
        />
        <Button onClick={handleSumColumnModel} color="primary">
          SUM
        </Button>
        <Input
          type="text"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="New Column Name"
          className="mr-2 w-2/5 p-3 border border-gray-300 rounded-md"
        />

        {/* Dropdown to select the column after which to insert the new column */}
        <Select onValueChange={setSelectedColumn} value={selectedColumn}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Column to Insert After" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Column</SelectLabel>
              {Object.keys(originalData[0] || {}).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button onClick={handleAddColumn} color="primary">
          Add Column
        </Button>

        <div className="p-2 ml-auto">
          <Select onValueChange={(e: any) => {
            setSelectedValue(e)
            setDirty(false)
          }} value={selectedValue}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a report" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Report Type</SelectLabel>
                {options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {(dirty && selectedValue === "current_inventory") && (
          <Button
            className="w-[120px]"
            disabled={uploadOptions.isLoading || loading}
            onClick={handleUploadCSV}
            color="primary"
          >
            {uploadOptions.isLoading ? (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="animate-spin mx-auto"
              />
            ) : (
              "Save Changes"
            )}
          </Button>
        )}
      </div>

      {isLoading || loading || isFetching ? (
        <div className="h-[600px] w-full flex items-center justify-center">
          <ProcessLoader />
        </div>
      ) : (
        <div className="overflow-x-auto max-h-[620px]">
          <div className="relative">
            <table className="min-w-max table-auto">
              <Header />
            </table>
            <List
              height={containerHeight}
              itemCount={data.length}
              itemSize={rowHeight}
              width={
                data.length > 0 ? columnWidth * Object.keys(data[0]).length : 0
              }
              ref={listRef}
            >
              {Row}
            </List>
          </div>
        </div>
      )}

      {/* <div className="mt-6 flex justify-between">
        {dirty && (
          <div className="mt-6 flex justify-center">
            <Button
              className="w-[120px]"
              disabled={uploadOptions.isLoading}
              onClick={handleUploadCSV}
              color="primary"
            >
              {uploadOptions.isLoading ? (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin mx-auto"
                />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        )}
      </div> */}
      <Dialog open={openSumModel} onOpenChange={setOpenSumModel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sum Columns</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Multi-select dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Columns to Sum:
              </label>
              <ReactSelect
                options={columnOptions}
                isMulti
                value={selectedSumColumns.map((col) => ({
                  value: col,
                  label: col,
                }))}
                onChange={(selected: any) => {
                  const cols = selected.map((item: any) => item.value);
                  setSelectedSumColumns(cols);
                }}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                New Column Name (DD.MM.YY):
              </label>
              <input
                type="text"
                value={newSumColumnName}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow only numbers and dots, and limit to format like 02.01.25
                  if (/^[\d.]{0,8}$/.test(val)) {
                    setSumNewColumnName(val);
                  }
                }}
                className="w-full border px-2 py-1 rounded-md"
                placeholder="e.g., 19.12.24"
                pattern="\d{2}\.\d{2}\.\d{2}"
                title="Format should be DD.MM.YY"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseSumColumnModel}>
              Cancel
            </Button>
            <Button onClick={handleCreateSumColumn}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExcelEditor;
