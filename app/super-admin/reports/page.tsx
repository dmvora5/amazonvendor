'use client'

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { FixedSizeList as List } from "react-window"; // Import react-window
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetReportQuery, useUpdateReportMutation } from "@/redux/apis/usersApis";
import Image from "next/image";

const options = [
  { value: "fba_inventory", label: "FBA Inventory" },
  { value: "all_inventory", label: "All Inventory" },
  { value: "channel_max", label: "Channel Max" },
  { value: "order_history", label: "Order History" },
  { value: "current_inventory", label: "Current Inventory" },
  { value: "project_database", label: "Project Database" },
];

const InputComponent = memo(({ data, index, keyData, setData, setDirty, disabled }: any) => {
  const row = data[index];
  const [state, setState] = useState<string>(row[keyData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setState(value);
  
    // Check if we're modifying one of the supplier order columns
    if (name === "Supplier A Order" || name === "Supplier B Order") {
      // Recalculate the "Order" column
      const supplierAOrder = parseFloat(row["Supplier A Order"]) || 0;
      const supplierBOrder = parseFloat(row["Supplier B Order"]) || 0;
      const newOrder = supplierAOrder + supplierBOrder;
  
      // Update the "Order" column in the row
      const updatedData = [...data];
      updatedData[index]["Order"] = newOrder;
  
      setData(updatedData); // Update the filtered data
    }
  };
  

  const handleBlur = (e: any) => {
    const newData: any = [...data];
    newData[index][keyData] = e.target.value;
  
    // If the "Supplier A Order" or "Supplier B Order" column is updated, recalculate "Order"
    if (keyData === "Supplier A Order" || keyData === "Supplier B Order") {
      const supplierAOrder = parseFloat(newData[index]["Supplier A Order"]) || 0;
      const supplierBOrder = parseFloat(newData[index]["Supplier B Order"]) || 0;
      newData[index]["Order"] = supplierAOrder + supplierBOrder;
    }
  
    setData(newData);
    setDirty(true); // Set dirty flag when data is changed
  };
  

  return (
    <Input
      value={state}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={disabled}
      className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
});

const ExcelEditor = () => {
  const [data, setData] = useState<any[]>([]); // Holds filtered data
  const [originalData, setOriginalData] = useState<any[]>([]); // Holds original data
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [selectedColumn, setSelectedColumn] = useState<string>(""); // Selected column for new column
  const [selectedValue, setSelectedValue] = useState<string>("fba_inventory");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);

  const rowHeight = 50;
  const containerHeight = 500;
  const columnWidth = 250;

  const listRef = useRef<any>(null);

  const { data: queryData, isLoading, error, isFetching } = useGetReportQuery(selectedValue);

  const [submit, uploadOptions] = useUpdateReportMutation();

  const fetchCSVFromBackend = useCallback(async (url: string) => {
    try {
      setLoading(true);

      const response = await fetch(url);
      const text = await response.text();

      // Check if the data is CSV or TSV based on the first line
      const delimiter = text.includes("\t") ? "\t" : ",";
      const wb = XLSX.read(text, { type: "string", raw: true });

      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json: any = XLSX.utils.sheet_to_json(sheet, { defval: null }); // Default empty cells to null

      setOriginalData(json); // Save original data
      setData(json); // Also set filtered data initially to the original data
      if(json.length) {
        const key = Object.keys(json[0]);
        setSelectedColumn(key[0]);
      }
    } catch (error) {
      console.error("Error fetching CSV/TSV:", error);
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

  // Function to handle adding a new column after the selected column
  const handleAddColumn = () => {
    if (newColumnName.trim() && selectedColumn) {
      const headerObject = { ...originalData[0] };  // Copy the header object
      const headerKeys = Object.keys(headerObject); // Get all the column keys
      const selectedIndex = headerKeys.indexOf(selectedColumn); // Find the index of the selected column
  
      if (selectedIndex === -1) return; // If selected column is not found, return
  
      // Step 1: Insert the new column key into the header keys array at the correct position
      headerKeys.splice(selectedIndex + 1, 0, newColumnName); // Insert after selected column
  
      // Step 2: Rebuild the header object with the new column added
      const newHeaderObject: any = {};
      headerKeys.forEach((key) => {
        newHeaderObject[key] = headerObject[key] || null; // Keep existing keys and add the new column with an empty value
      });
  
      // Step 3: Update each row in originalData to reflect the new column (set the new column to null or empty string)
      const updatedData = originalData.map((row, index) => {
        if (index === 0) return newHeaderObject; // If it's the header row, update it
  
        const updatedRow = { ...row };
  
        // Add new column with null or empty string for all rows
        updatedRow[newColumnName] = null; // New column with null value for existing rows
  
        // Ensure rows are updated correctly according to the new column order
        const reorderedRow: any = {};
        headerKeys.forEach((key) => {
          reorderedRow[key] = updatedRow[key] || null; // Ensure each row has the same order as header
        });
  
        return reorderedRow;
      });
  
      // Step 4: Update both the header and the rows with the new column
      setOriginalData([newHeaderObject, ...updatedData]); // Set the updated header and rows
      setData([newHeaderObject, ...updatedData]); // Update filtered data (if used for searching)
  
      setNewColumnName(""); // Clear input after adding
      setDirty(true); // Mark as dirty after making changes
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
    return (
      <div style={style} className="flex border-b hover:bg-gray-50 overflow-x-hidden">
        {Object.keys(row).map((key) => (
          <div key={key} className="px-4 py-2 flex-shrink-0" style={{ width: columnWidth }}>
            <InputComponent data={originalData} index={index} keyData={key} setData={setOriginalData} setDirty={setDirty} disabled={uploadOptions.isLoading} />
          </div>
        ))}
      </div>
    );
  };

  // Table Header component
  const Header = () => {
    if (!data || data.length === 0) return null;
    return (
      <thead className="bg-gray-100 text-sm font-semibold text-gray-700 sticky top-0 z-10">
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key} className="relative px-4 py-3 text-left" style={{ width: columnWidth }}>
              <div className="flex justify-between items-center">
                <span>{key}</span>
                {key !== "Action" && (
                  <button
                    disabled={uploadOptions.isLoading}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleRemoveColumn(key)} // Handle column removal
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

  // Handle column removal
  const handleRemoveColumn = (columnName: string) => {
    setOriginalData(prevData => prevData.map(row => {
      const { [columnName]: _, ...rest } = row;
      return rest;
    }));

    setData(prevData => prevData.map(row => {
      const { [columnName]: _, ...rest } = row;
      return rest;
    }));
    setDirty(true);
  };

  // Upload the CSV data
  const handleUploadCSV = async () => {
    // Convert JSON data to CSV or TSV format
    const delimiter = "\t"; // We assume TSV for now, you can change this dynamically
    const sheet = XLSX.utils.json_to_sheet(originalData);

    let csvData = XLSX.utils.sheet_to_csv(sheet); // Default is CSV
    if (delimiter === "\t") {
      csvData = XLSX.utils.sheet_to_csv(sheet, { FS: delimiter }); // Convert to TSV if needed
    }

    // Create a FormData object
    const formData = new FormData();

    // Create a Blob from CSV or TSV data
    const csvBlob = new Blob([csvData], { type: 'text/csv' });

    // Append the file to the FormData object
    formData.append('file', csvBlob, 'data.csv'); // Use appropriate file extension based on format
    formData.append('report_type', selectedValue);

    await submit(formData);
  };

  return (
    <div className="w-[95%] mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-4 flex items-center">
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search"
          className="mr-4 p-3 border border-gray-300 rounded-md"
        />
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
                <SelectItem key={key} value={key}>{key}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button onClick={handleAddColumn} color="primary">
          Add Column
        </Button>

        <div className="p-2 ml-auto">
          <Select onValueChange={setSelectedValue} value={selectedValue}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a report" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Report Type</SelectLabel>
                {options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading || loading || isFetching ? (
        <div className="h-[600px] w-full flex items-center justify-center"><h2>Loading...</h2></div>
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
              width={data.length > 0 ? columnWidth * Object.keys(data[0]).length : 0}
              ref={listRef}
            >
              {Row}
            </List>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        {dirty && (
          <div className="mt-6 flex justify-center">
            <Button className="w-[120px]" disabled={uploadOptions.isLoading} onClick={handleUploadCSV} color="primary">
              {uploadOptions.isLoading ? (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin mx-auto"
                />
              ) : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelEditor;
