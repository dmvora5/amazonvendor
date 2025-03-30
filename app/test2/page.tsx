"use client"
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelEditor = () => {
  const [file, setFile] = useState<File | null>(null);

  // Handle file upload
  const handleFileUpload = (e: any) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    // You can use the file as needed, e.g., read and display data
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const binaryString = event.target.result;
      const wb = XLSX.read(binaryString, { type: 'binary' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      // You could display the data here or manipulate it
    };
    reader.readAsBinaryString(uploadedFile);
  };

  // Download the file for editing
  const handleDownloadFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        const newFile = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        const blob = new Blob([newFile], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'editable-file.xlsx';
        link.click();
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Send updated file to backend
  const handleSendToBackend = async (editedFile: File) => {
    const formData = new FormData();
    formData.append('file', editedFile);

    try {
      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File sent successfully!');
      } else {
        alert('Error sending file');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Excel File Editor</h2>

      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-600 mb-4 p-2 border rounded-md"
        />
      </div>

      <div className="mt-6 flex justify-center">
        {/* Button to download the file for editing in Excel */}
        <Button onClick={handleDownloadFile} color="secondary">
          Download for Editing
        </Button>
      </div>

      <div className="mt-6 flex justify-center">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e: any) => {
            const uploadedFile = e.target.files[0];
            if (uploadedFile) {
              handleSendToBackend(uploadedFile);
            }
          }}
          className="block w-full text-sm text-gray-600 mb-4 p-2 border rounded-md"
        />
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div>
      <h1 className="text-center text-3xl mb-6">Excel File Editor</h1>
      <ExcelEditor />
    </div>
  );
};

export default Page;
