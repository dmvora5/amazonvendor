"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ApiState from "@/components/ApiState";
import RolesChecks from "@/components/RolesChecks";
import * as XLSX from "xlsx";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getSession, signOut } from "next-auth/react";
import Image from "next/image";

const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [fileChange, setFileChange] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      readExcelFile(selectedFile);
    }
  };

  const readExcelFile = (file: File) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target?.result as ArrayBuffer;
      const workbook = XLSX.read(binaryString, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
      setOriginalData(jsonData);
      setFileChange(true);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUploadNewCSV = async () => {
    setLoading(true);
    try {
      const updatedData = [...data];
      const sheet = XLSX.utils.json_to_sheet(updatedData);
      const csvData = XLSX.utils.sheet_to_csv(sheet, { FS: "\t" });

      const formData = new FormData();
      const csvBlob = new Blob([csvData], { type: "text/csv" });
      formData.append("file", csvBlob, "data.csv");
      formData.append("report_type", "product_database"); // Change as needed

      const session: any = await getSession();

      const { data: response } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}report/upload/report/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      if (response?.detail) {
        toast.success(response.detail);
        setFileChange(false);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.success("Upload completed.");
      }
    } catch (err: any) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}` });
        } else {
          toast.error(err.response?.data?.detail || "Upload failed.");
        }
      } else {
        toast.error("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-[90%]">
      <RolesChecks access="has_upload_report_access" />

      <div className="flex flex-col space-y-6">
        <ApiState error={null} isSuccess={false}>
          <ApiState.ArthorizeCheck />
        </ApiState>

        {/* File input */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Upload Excel File
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="mt-1 block w-64 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading}
          />
        </label>

        {/* Upload button (only visible when file has changed) */}
        {fileChange && (
          <Button
            className="w-[140px] bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-blue-600 flex items-center justify-center"
            onClick={handleUploadNewCSV}
            disabled={loading}
          >
            {loading ? (
              <Image
                src="/assets/icons/loader.svg"
                alt="Loading"
                width={20}
                height={20}
                className="animate-spin mr-2"
              />
            ) : null}
            {loading ? "Uploading..." : "Upload File"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
