"use client";

import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
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
import axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";
import { parseAndShowErrorInToast } from "@/utils";
import RolesChecks from "@/components/RolesChecks";

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
    isDuplicate
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
        className={`w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${
          isDuplicate
            ? "bg-red-100 border-red-500 text-red-700 focus:ring-red-500"
            : "focus:ring-blue-500"
        }`}
      />
    );
  }
);

const ExcelEditor = () => {
  const [data, setData] = useState<any[]>([]); // Holds filtered data
  const [originalData, setOriginalData] = useState<any[]>([]); // Holds original data
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>(""); // Selected column for new column
  const [selectedValue, setSelectedValue] =
    useState<string>("product_database");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [openSumModel, setOpenSumModel] = useState(false);
  const [selectedSumColumns, setSelectedSumColumns] = useState<string[]>([]);
  const [newSumColumnName, setSumNewColumnName] = useState("");
  const [selectedDateColumns, setSelectedDateColumns] = useState<string[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [hiddenHeaders, setHiddenHeaders] = useState<string[]>([]);
  const visibleHeaders = headers.filter((h) => !hiddenHeaders.includes(h));
  const [showHiddenColumnModal, setShowHiddenColumnModal] = useState(false);

  const [originalDataTemp, setOriginalDatatmp] = useState<any[]>([]); // Holds original data

  const [selectedSearchColumns, setSelectedSearchColumns] = useState<string[]>(
    []
  );
  const [searchModel, setSearchModel] = useState(false);

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

  const searchcolumnOptions = Object.keys(originalData[0] || {}).map((key) => ({
    value: key,
    label: key,
  }));

  useEffect(() => {
    if (originalData.length > 0) {
      const keys = Object.keys(originalData[0]);
      setHeaders(keys);
      setHiddenHeaders([]); // Reset hidden
    }
  }, [originalData]);

  useEffect(() => {
    if (hiddenHeaders.length === 0) {
      setShowHiddenColumnModal(false);
    }
  }, [hiddenHeaders]);

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

      const wb = XLSX.read(arrayBuffer, { type: "array" }); // Using array instead of string type
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json: any = XLSX.utils.sheet_to_json(sheet, { defval: null }); // Default empty cells to null

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

  const duplicateValues = useMemo(() => {
    const checkColumns = ["Product Code", "FBA SKU", "ASIN"];
    const valueMap: Record<string, Set<string>> = {};
    const duplicateSet = new Set<string>();

    checkColumns.forEach((col) => {
      const seen = new Set<string>();
      const duplicates = new Set<string>();

      data.forEach((row) => {
        const value = row[col];
        if (value && seen.has(value)) {
          duplicates.add(`${col}::${value}`);
        }
        seen.add(value);
      });

      valueMap[col] = duplicates;
    });

    // Flatten all duplicates into one set
    Object.entries(valueMap).forEach(([col, duplicates]) => {
      duplicates.forEach((val) => duplicateSet.add(val));
    });

    return duplicateSet;
  }, [data]);

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
      const filteredData = originalData.filter((row) => {
        if (!selectedSearchColumns.length) {
          return Object.values(row).some((value) =>
            String(value).toLowerCase().includes(term)
          );
        } else {
          const slectedKeysRow = selectedSearchColumns.map(
            (ele: any) => row[ele]
          );
          return Object.values(slectedKeysRow).some((value) =>
            String(value).toLowerCase().includes(term)
          );
        }
      });
      setData(filteredData);
    }
  };

  const handleSearchModel = () => {
    setSearchModel(true);
  };

  const handleCloseSearchColumnModel = () => {
    setSearchModel(false); // open the modal
    setSelectedSearchColumns([]); // Clear selected columns
  };

  // Table Row component
  const Row = ({ index, style }: any) => {
    const row = data[index];

    return (
      <div
        style={style}
        className="flex border-b hover:bg-gray-50 overflow-x-hidden"
      >
        {visibleHeaders.map((key) => {
          const value = row[key];
          const isDuplicate =
            ["Product Code", "FBA SKU", "ASIN"].includes(key) &&
            duplicateValues.has(`${key}::${value}`);

          return (
            <div
              key={key}
              className={`px-4 py-2 flex-shrink-0 ${
                isDuplicate ? "text-red-600 font-semibold" : ""
              }`}
              style={{ width: columnWidth }}
              title={isDuplicate ? "Duplicate value" : ""}
            >
              <InputComponent
                originalData={originalData}
                data={data}
                index={index}
                keyData={key}
                setData={setData}
                setDirty={setDirty}
                disabled={uploadOptions.isLoading}
                isDuplicate={isDuplicate}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const handleToggleColumnVisibility = (header: string) => {
    setHiddenHeaders(
      (prev) =>
        prev.includes(header)
          ? prev.filter((h) => h !== header) // hide
          : [...prev, header] // show again
    );
  };

  // Table Header component
  const Header = () => {
    if (!data || data.length === 0) return null;

    return (
      <thead className="bg-gray-100 text-sm font-semibold text-gray-700 sticky top-0 z-10">
        <tr>
          {visibleHeaders.map((header, colIndex) => (
            <th
              key={colIndex}
              className="relative px-4 py-3 text-left"
              style={{ width: columnWidth }}
            >
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => {
                      const updatedHeader = e.target.value;
                      const headerIndex = headers.indexOf(header);
                      const newHeaders = [...headers];
                      newHeaders[headerIndex] = updatedHeader;
                      setHeaders(newHeaders);
                      setDirty(true);

                      const updatedData = data.map((row) => {
                        const newRow: any = {};
                        newHeaders.forEach((newKey, i) => {
                          const oldKey = headers[i];
                          newRow[newKey] = row[oldKey];
                        });
                        return newRow;
                      });

                      setData(updatedData);
                      setOriginalData(updatedData);

                      // Also update visibleHeaders
                      setHiddenHeaders((prev) =>
                        prev.map((h) => (h === header ? updatedHeader : h))
                      );
                    }}
                    className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {header !== "Action" && (
                  <div className="flex gap-1">
                    <button
                      disabled={uploadOptions.isLoading}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => handleRemoveColumn(header)}
                    >
                      <span className="text-lg">×</span>
                    </button>

                    {/* Toggle Hide/Show column */}
                    <button
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      onClick={() => handleToggleColumnVisibility(header)}
                      title="Hide column"
                    >
                      👁️
                    </button>
                  </div>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  //   const handleDateCheckboxChange = (
  //     e: React.ChangeEvent<HTMLInputElement>,
  //     key: string
  //   ) => {
  //     const checked = e.target.checked;

  //     let updatedData = [...data];

  //     updatedData = updatedData.map((row, idx) => {
  //       const oriRow = originalData[idx];
  //       const value = parseFloat(row[key]) || 0;
  //       let currentInbound = parseFloat(row["Total New Inbound"]) || 0;

  //       if (checked) {
  //         // Checkbox Checked => Subtract
  //         currentInbound -= value;
  //       } else {
  //         // Checkbox Unchecked => Add back
  //         currentInbound += value;
  //       }

  //       if (currentInbound < 0) {
  //         // If goes negative, revert the row
  //         const supplierColumns = Object.keys(row).filter((key) =>
  //           key.includes("Supplier")
  //         );
  //         const newRow = { ...row };
  //         supplierColumns.forEach((col) => {
  //           newRow[col] = oriRow[col];
  //         });
  //         newRow[key] = oriRow[key];
  //         newRow["Total New Inbound"] = oriRow["Total New Inbound"];
  //         return newRow;
  //       } else {
  //         return {
  //           ...row,
  //           "Total New Inbound": currentInbound,
  //         };
  //       }
  //     });

  //     if (checked) {
  //       setSelectedDateColumns((prev) => [...prev, key]);
  //     } else {
  //       setSelectedDateColumns((prev) => prev.filter((col) => col !== key));
  //     }

  //     setData(updatedData);
  //     setDirty(true);
  //   };

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

  const selectCsv = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setLoading(true);
      // Create a FileReader to read the CSV file
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryString = event.target?.result as string;
        const workbook = XLSX.read(binaryString, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
        setOriginalData(jsonData);
        setLoading(false);
        setDirty(true);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // Upload the CSV data
  const handleUploadCSV = async () => {
    try {
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

      const { data: response } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}report/upload/update-report/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      setDirty(false);
      if (response?.file_url) {
        fetchCSVFromBackend(response?.file_url);
      }
    } catch (err: any) {
      if (err instanceof AxiosError) {
        if (err.status === 401) {
          signOut({
            callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
          });
          return;
        }
        parseAndShowErrorInToast(err?.response);
      } else {
        parseAndShowErrorInToast(err);
      }
    } finally {
      setLoading(false);
    }
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
    setSelectedSumColumns([]); // Clear selected columns
    setSumNewColumnName(""); // Clear the sum column name input
    setDirty(true);
  };

  const handleAddRow = () => {
    const newRow = Object.keys(originalData[0] || {}).reduce(
      (acc: any, key) => {
        acc[key] = ""; // or null, depending on your default value for the new row
        return acc;
      },
      {}
    );

    // Add new row to both data and originalData
    setData((prevData) => [...prevData, newRow]);
    setOriginalData((prevData) => [...prevData, newRow]);

    setDirty(true); // Mark as dirty since the data has changed
  };

  const handleDownloadExcel = () => {
    if (!data || data.length === 0) return;

    // Filter only visible columns
    const filteredData = data.map((row) => {
      const filteredRow: { [key: string]: any } = {};
      visibleHeaders.forEach((key) => {
        filteredRow[key] = row[key];
      });
      return filteredRow;
    });

    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(filteredData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Format: "Product Database 2025-05-29_14-30.xlsx"
    const now = new Date();
    const formattedDate = now
      .toLocaleString("sv-SE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(" ", "_")
      .replace(":", "-");

    const fileName = `Product Database ${formattedDate}.xlsx`;

    // Trigger download
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <>
      <div className="p-6 flex items-center space-x-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Upload Excel File
          </span>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={selectCsv}
            className="mt-1 block w-64 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
      </div>
      <div className="w-[95%] mx-auto p-6 bg-white rounded-lg shadow-lg">
        <RolesChecks access="has_product_db_access" />

        <div className="mb-4 space-x-2 flex items-center">
          <Button onClick={handleSearchModel}>Filter</Button>
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
            className="mr-4 p-3 border border-gray-300 rounded-md"
          />
          <Button onClick={handleAddRow}>Add Row</Button>
          {/* <Button onClick={handleSumColumnModel} color="primary">
          SUM
        </Button> */}
          {hiddenHeaders.length > 0 && (
            <Button onClick={() => setShowHiddenColumnModal(true)}>
              Manage Hidden Columns
            </Button>
          )}
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

          {/* <div className="p-2 ml-auto">
          <Select onValueChange={setSelectedValue} value={selectedValue}>
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
        </div> */}

          {dirty && (
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
          )}
          <div className="relative group">
            <button
              onClick={handleDownloadExcel}
              className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                />
              </svg>
            </button>

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Download Excel
            </div>
          </div>
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
                  data.length > 0
                    ? columnWidth * Object.keys(data[0]).length
                    : 0
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
      <Dialog open={searchModel} onOpenChange={setSearchModel}>
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
                options={searchcolumnOptions}
                isMulti
                value={selectedSearchColumns.map((col) => ({
                  value: col,
                  label: col,
                }))}
                onChange={(selected: any) => {
                  const cols = selected.map((item: any) => item.value);
                  setSelectedSearchColumns(cols);
                }}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseSearchColumnModel}>
              Cancel
            </Button>
            <Button onClick={() => setSearchModel(!searchModel)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showHiddenColumnModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-md w-80">
            <h2 className="text-md font-semibold mb-3">Hidden Columns</h2>
            {hiddenHeaders.length === 0 ? (
              <p className="text-sm text-gray-500">No hidden columns</p>
            ) : (
              <ul className="space-y-2">
                {hiddenHeaders.map((header) => (
                  <li
                    key={header}
                    className="flex justify-between items-center bg-gray-100 px-2 py-1 rounded"
                  >
                    <span className="text-sm">{header}</span>
                    <button
                      onClick={() => handleToggleColumnVisibility(header)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowHiddenColumnModal(false)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExcelEditor;
