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
import RolesChecks from "@/components/RolesChecks";
import axios from "axios";

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
        disabled={true}
        className="w-full p-2 text-sm border rounded-md disabled:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  }
);

const ExcelEditor = () => {
  const [data, setData] = useState<any[]>([]); // Holds filtered data
  const [originalData, setOriginalData] = useState<any[]>([]); // Holds original data
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>(""); // Selected column for new column
  const [selectedValue, setSelectedValue] = useState<string>("scrapped_data");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [openSumModel, setOpenSumModel] = useState(false);
  const [selectedSumColumns, setSelectedSumColumns] = useState<string[]>([]);
  const [newSumColumnName, setSumNewColumnName] = useState("");
  const [selectedDateColumns, setSelectedDateColumns] = useState<string[]>([]);

  const [originalDataTemp, setOriginalDatatmp] = useState<any[]>([]); // Holds original data
  const [selectedSearchColumns, setSelectedSearchColumns] = useState<string[]>([]);
  const [searchModel, setSearchModel] = useState(false);
  const [visibleHeaders, setVisibleHeaders] = useState<string[]>([]);

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

  const searchcolumnOptions = Object.keys(originalData[0] || {})
    .map((key) => ({
      value: key,
      label: key,
    }));

  const [submit, uploadOptions] = useUpdateReportMutation();

  const fetchCSVFromBackend = useCallback(async (url: string) => {
    try {
      setLoading(true);

      const response = await axios.get(url, {
        responseType: 'arraybuffer', // Important: tells axios to treat the response as binary
      });

      const arrayBuffer = response.data;

      // Decode the array buffer to a string using utf-8 encoding
      const text = new TextDecoder('utf-8').decode(arrayBuffer);

      // Manually remove the BOM (if it exists)
      const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;

      // Convert the cleaned text to an array buffer for XLSX processing
      const wb = XLSX.read(cleanText, { type: 'string' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json: any = XLSX.utils.sheet_to_json(sheet, { defval: null });

      console.log('json', json);

      setOriginalData(JSON.parse(JSON.stringify(json)));
      setData(JSON.parse(JSON.stringify(json)));

      if (json.length) {
        const key = Object.keys(json[0]);
        setSelectedColumn(key[0]);
      }
    } catch (error) {
      console.error('Error fetching CSV/TSV:', error);
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

  const handleCloseSearchColumnModel = () => {
    setSearchModel(false); // open the modal
    setSelectedSearchColumns([]); // Clear selected columns
  };




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
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  
    if (term.trim() === "") {
      setData(originalData); // Reset
      return;
    }
  
    const lowerTerm = term.toLowerCase();
  
    const filteredData = originalData.filter((row) => {
      const valuesToSearch = selectedSearchColumns.length
        ? selectedSearchColumns.map((key) => row[key])
        : Object.values(row);
  
      return valuesToSearch.some((value) =>
        String(value ?? "").toLowerCase().includes(lowerTerm)
      );
    });
  
    setData(filteredData);
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
    // const isDateKey = (key: string) => /^\d{2}\.\d{2}\.\d{2}$/.test(key);

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
                  {/* {isDateKey(key) && (
                    <input
                      type="checkbox"
                      value={key}
                      checked={selectedDateColumns.includes(key)}
                      onChange={(e) => handleDateCheckboxChange(e, key)}
                    />
                  )} */}
                  <span>{key}</span>
                </div>

                {/* {key !== "Action" && (
                                    <button
                                        disabled={uploadOptions.isLoading}
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                        onClick={() => handleRemoveColumn(key)}
                                    >
                                        <span className="text-lg">×</span>
                                    </button>
                                )} */}
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
      setLoading(true)
      // Create a FileReader to read the CSV file
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryString = event.target?.result as string;
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData)
        setOriginalData(jsonData);
        setLoading(false)
        setDirty(true);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // Upload the CSV data
  const handleUploadCSV = async () => {
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

    await submit(formData);
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
    const newRow = Object.keys(originalData[0] || {}).reduce((acc: any, key) => {
      acc[key] = ""; // or null, depending on your default value for the new row
      return acc;
    }, {});

    // Add new row to both data and originalData
    setData((prevData) => [...prevData, newRow]);
    setOriginalData((prevData) => [...prevData, newRow]);

    setDirty(true); // Mark as dirty since the data has changed
  };
  const handleSearchModel = () => {
    setSearchModel(true);
  }

  const handleDownloadExcel = () => {
    if (!data || data.length === 0) return;
  
    const headersToInclude = visibleHeaders.length > 0
      ? visibleHeaders
      : Object.keys(data[0]);
  
    const filteredData = data.map((row) => {
      const filteredRow: { [key: string]: any } = {};
      headersToInclude.forEach((key) => {
        filteredRow[key] = row[key];
      });
      return filteredRow;
    });
  
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
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
  
    const fileName = `Scraped Data ${formattedDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };  

  return (
    <>
      <div className="w-[95%] mx-auto p-6 bg-white rounded-lg shadow-lg">
        <RolesChecks access="has_scraped_data_access" />

        <div className="mb-4 space-x-2 flex items-center">
          <Button onClick={handleSearchModel}>Filter</Button>
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
            className="mr-4 p-3 border border-gray-300 rounded-md"
          />
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
          {/* <Button onClick={handleAddRow}>
                        Add Row
                    </Button> */}
          {/* <Button onClick={handleSumColumnModel} color="primary">
          SUM
        </Button> */}
          {/* <Input
                        type="text"
                        value={newColumnName}
                        onChange={(e) => setNewColumnName(e.target.value)}
                        placeholder="New Column Name"
                        className="mr-2 w-2/5 p-3 border border-gray-300 rounded-md"
                    /> */}

          {/* Dropdown to select the column after which to insert the new column */}
          {/* <Select onValueChange={setSelectedColumn} value={selectedColumn}>
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
                    </Button> */}

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
          <Dialog open={searchModel} onOpenChange={setSearchModel}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Search Columns</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Multi-select dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Columns to Search:
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
                <Button
                  variant="outline"
                  onClick={handleCloseSearchColumnModel}
                >
                  Cancel
                </Button>
                <Button onClick={() => setSearchModel(!searchModel)}>
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* {dirty && (
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
                    )} */}
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
      </div>
    </>
  );
};

export default ExcelEditor;
