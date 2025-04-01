"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadReportMutation } from "@/redux/apis/usersApis";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Reference for file input
  const [uploadReport, { isLoading }] = useUploadReportMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("report_type", "channel_max");

    try {
      await uploadReport(formData).unwrap();
      toast.success("File uploaded successfully!");

      // ✅ Clear file input field only (without reloading the page)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("File upload failed. Please try again.");
    }
  };

  return (
    <div className="w-full flex justify-center items-center min-h-[90%]">
      <div className="flex flex-col space-y-6">
        {/* File Input */}
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isLoading}
        />

        {/* Upload Button */}
        <Button
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-blue-600"
          onClick={handleUpload}
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default UploadPage;
