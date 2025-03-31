'use client'

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";
import { FixedSizeList as List } from "react-window"; // Import react-window
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetReportQuery, useUploadReportMutation } from "@/redux/apis/usersApis";
import Image from "next/image";

const options = [
  { value: "fba_inventory", label: "FBA Inventory" },
  { value: "all_inventory", label: "All Inventory" },
  { value: "channel_max", label: "Channel Max" },
  { value: "order_history", label: "Order History" },
];

const InputComponent = memo(({ data, index, keyData, setData, setDirty, disabled }: any) => {
  const row = data[index];
  const [state, setState] = useState<string>(row[keyData]);

  const handleChange = (e: any) => {
    setState(e.target.value);
  };

  const handleBlur = (e: any) => {
    const newData: any = [...data];
    newData[index][keyData] = e.target.value;
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
  const [selectedValue, setSelectedValue] = useState<string>("fba_inventory");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);

  const rowHeight = 50;
  const containerHeight = 500;
  const columnWidth = 250;

  const listRef = useRef<any>(null);

  const { data: queryData, isLoading, error, isFetching } = useGetReportQuery(selectedValue);

  const [submit, uploadOptions] = useUploadReportMutation()

  const fetchCSVFromBackend = useCallback(async (url: string) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const csvText = await response.text();
      const wb = XLSX.read(csvText, { type: "string" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json: any = XLSX.utils.sheet_to_json(sheet);
      setOriginalData(json); // Save original data
      setData(json); // Also set filtered data initially to the original data
    } catch (error) {
      console.error("Error fetching CSV:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setDirty(false);
  }, [selectedValue])

  useEffect(() => {
    if (!(queryData as any)?.file_url) return;
    fetchCSVFromBackend((queryData as any)?.file_url);
  }, [queryData, fetchCSVFromBackend]);

  useEffect(() => {
    if (!uploadOptions.isSuccess) return;
    setDirty(false);
  }, [uploadOptions.isSuccess])

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      setData(prevData => prevData.map((row) => ({
        ...row,
        [newColumnName]: "",
      })));
      setNewColumnName("");
      setDirty(true);
    }
  };

  const handleRemoveColumn = (columnName: string) => {
    setData(prevData => prevData.map(row => {
      const { [columnName]: _, ...rest } = row;
      return rest;
    }));
  };

  const handleUploadCSV = async () => {
    // Convert JSON data to CSV format
    const csvData = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));

    // Create a FormData object
    const formData = new FormData();
    // Create a Blob from CSV data
    const csvBlob = new Blob([csvData], { type: 'text/csv' });

    // Append the CSV file to the FormData object
    formData.append('file', csvBlob, 'data.csv');
    formData.append('report_type', selectedValue);

    await submit(formData);
  };

  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setData(originalData); // Reset to original data when search term is cleared
    } else {
      // Filter data based on the search term
      const filteredData = originalData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(term)
        )
      );
      setData(filteredData); // Update the data with filtered results
    }
  };

  const Row = ({ index, style }: any) => {
    const row = data[index];
    return (
      <div style={style} className="flex border-b hover:bg-gray-50 overflow-x-hidden">
        {Object.keys(row).map((key) => (
          <div key={key} className="px-4 py-2 flex-shrink-0" style={{ width: columnWidth }}>
            <InputComponent data={data} index={index} keyData={key} setData={setData} setDirty={setDirty} disabled={uploadOptions.isLoading} />
          </div>
        ))}
      </div>
    );
  };

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
