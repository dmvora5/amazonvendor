"use client";

import { useState, useEffect, useRef } from "react";
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
} from "@/components/ui/select"
import { useGetReportQuery } from "@/redux/apis/usersApis";


// fba_inventory, all_inventory, channel_max, order_history

const options = [
  { value: "fba_inventory", label: "FBA Inventory" },
  { value: "all_inventory", label: "All Inventory" },
  { value: "channel_max", label: "Channel Max" },
  { value: "order_history", label: "Order History" },
];


const InputComponent = ({ data, index, keyData, setData, setDirty }: any) => {
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
      className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

const ExcelEditor = () => {
  const [data, setData] = useState<any[]>([]);
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<string>("fba_inventory");
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const [foundIndex, setFoundIndex] = useState<number | null>(null); // Found index to scroll to
  const [loading, setLoading] = useState<boolean>(false); //
  const [dirty, setDirty] = useState<boolean>(false); // Track data changes

  const rowHeight = 50; // Fixed row height
  const containerHeight = 500; // Set the height for the scrollable container
  const columnWidth = 250; // Fixed column width

  const listRef = useRef<any>(null); // Reference to the react-window list

  const { data: queryData, isLoading, error, isFetching } = useGetReportQuery(selectedValue);

  console.log('queryData', queryData)

  // Fetch CSV file from backend URL and parse it
  const fetchCSVFromBackend = async (url: string) => {

    try {
      setLoading(true)
      // Fetch the CSV file
      const response = await fetch(url);
      const csvText = await response.text(); // Get CSV as plain text

      // Parse CSV into JSON using XLSX
      const wb = XLSX.read(csvText, { type: "string" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json: any = XLSX.utils.sheet_to_json(sheet);
      setData(json);
    } catch (error) {
      console.error("Error fetching CSV:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch data on mount
  useEffect(() => {
    if (!(queryData as any)?.file_url) return;
    fetchCSVFromBackend((queryData as any)?.file_url);
  }, [queryData]);

  // Add new column to the data
  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const updatedData = data.map((row) => ({
        ...row,
        [newColumnName]: "", // Add new column with empty values
      }));
      setData(updatedData);
      setNewColumnName(""); // Clear the input field
    }
  };

  // Remove column from the data
  const handleRemoveColumn = (columnName: string) => {
    const updatedData = data.map((row) => {
      const { [columnName]: _, ...rest } = row; // Remove column by name
      return rest;
    });
    setData(updatedData);
  };

  // Save the updated data to a new Excel file
  const handleSaveFile = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "updated_file.xlsx");
  };

  // Row rendering function for react-window
  const Row = ({ index, style }: any) => {
    const row = data[index];

    return (
      <div style={style} className="flex border-b hover:bg-gray-50 overflow-x-hidden">
        {Object.keys(row).map((key) => (
          <div key={key} className="px-4 py-2 flex-shrink-0" style={{ width: columnWidth }}>
            {/* <Input
              value={row[key]}
              onChange={(e) => {
                const newData: any = [...data];
                newData[index][key] = e.target.value;
                setData(newData);
              }}
              className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}
            <InputComponent data={data} index={index} keyData={key} setData={setData} />

          </div>
        ))}
      </div>
    );
  };

  // Header rendering function
  const Header = () => {
    // Check if data is loaded and has rows before rendering header
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

  // Search function to find the matching row
  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // Find the row that matches the search term
    const index = data.findIndex((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term)
      )
    );

    setFoundIndex(index);

    // Scroll to the found index if there is one
    if (index !== -1 && listRef.current) {
      listRef.current.scrollToItem(index); // Scroll to the matched row
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">

      <div className="mb-4 flex items-center">
        {/* Search Input */}
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search"
          className="mr-4 p-3 border border-gray-300 rounded-md"
        />
        {/* Add Column Input */}
        {/* <Input
          type="text"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="New Column Name"
          className="mr-2 w-2/5 p-3 border border-gray-300 rounded-md"
        />
        <Button onClick={handleAddColumn} color="primary">
          Add Column
        </Button> */}

        <div className="p-2 ml-auto">
          <Select onValueChange={setSelectedValue} value={selectedValue}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a report" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Report Type</SelectLabel>
                {options.map((option: any) => (
                  <SelectItem value={option.value}>{option.label}</SelectItem>
                ))}

              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Virtualized table wrapper using react-window */}
      {isLoading || loading || isFetching ? <div className="h-[500px] w-full flex items-center justify-center"><h2>Loading...</h2></div> :
        <div className="overflow-x-auto max-h-[700px]">
          <div className="relative">
            <table className="min-w-max table-auto">
              <Header />
            </table>

            {/* react-window's FixedSizeList */}
            <List
              height={containerHeight} // Height of the visible area
              itemCount={data.length} // Total number of rows
              itemSize={rowHeight} // Height of each row
              width={data.length > 0 ? columnWidth * Object.keys(data[0]).length : 0} // Width based on column count
              ref={listRef} // Attach ref for scroll control
            >
              {Row}
            </List>
          </div>
        </div>
      }

      <div className="mt-6 flex justify-between">
         {dirty && (
        <div className="mt-6 flex justify-between">
          <Button onClick={handleSaveFile} color="primary">
            Save Changes
          </Button>
        </div>
      )}
        {/* <Button onClick={() => setData([])} color="secondary">
          Clear Data
        </Button> */}
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className="my-auto overflow-y-hidden h-screen mt-12">
      <ExcelEditor />
    </div>
  );
};

export default Page;
