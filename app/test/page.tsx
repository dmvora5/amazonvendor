"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table } from '@/components/ui/table';
import * as XLSX from 'xlsx';

const ExcelEditor = () => {
  const [file, setFile] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [newColumnName, setNewColumnName] = useState<string>('');

  // Handle file upload
  const handleFileUpload = (e: any) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event: any) => {
      const binaryString = event.target.result;
      const wb = XLSX.read(binaryString, { type: 'binary' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json: any = XLSX.utils.sheet_to_json(sheet);
      setData(json);
    };
    reader.readAsBinaryString(uploadedFile);
  };

  // Add new column to the data
  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const updatedData = data.map(row => ({
        ...row,
        [newColumnName]: '' // Add new column with empty values
      }));
      setData(updatedData);
      setNewColumnName(''); // Clear the input field
    }
  };

  // Remove column from the data
  const handleRemoveColumn = (columnName: string) => {
    const updatedData = data.map(row => {
      const { [columnName]: _, ...rest } = row; // Remove column by name
      return rest;
    });
    setData(updatedData);
  };

  // Save the updated data to a new Excel file
  const handleSaveFile = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'updated_file.xlsx');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Excel File Editor</h2>

      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-600 mb-4 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {data.length > 0 && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <Input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="New Column Name"
                className="mr-2 p-3 border border-gray-300 rounded-md"
              />
              <Button onClick={handleAddColumn} color="primary">Add Column</Button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <Table className="w-full table-auto">
              <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key} className="relative px-4 py-3 text-left">
                      <div className="flex justify-between items-center">
                        <span>{key}</span>
                        {/* Show the remove button only for added columns */}
                        {key !== 'Action' && (
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
              <tbody className="text-sm">
                {data.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    {Object.keys(row).map((key) => (
                      <td key={key} className="px-4 py-2">
                        <Input
                          value={row[key]}
                          onChange={(e) => {
                            const newData: any = [...data];
                            newData[index][key] = e.target.value;
                            setData(newData);
                          }}
                          className="w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}

      <div className="mt-6 flex justify-between">
        <Button onClick={handleSaveFile} color="primary">
          Save Changes
        </Button>
        <Button onClick={() => setData([])} color="secondary">
          Clear Data
        </Button>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className='my-auto h-screen mt-12'>
      <ExcelEditor />
    </div>
  );
}

export default Page;
