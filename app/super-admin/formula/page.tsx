"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ApiState from "@/components/ApiState";
import RolesChecks from "@/components/RolesChecks";
import * as XLSX from "xlsx";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { getSession, signOut } from "next-auth/react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const optionsSelecte = [
  { value: "7days", label: "7 Days" },
  { value: "14days", label: "14 Days" },
];

// Default formulas
const defaultFormulas: any = {
  "7days": "DEFAULT FORMULA FOR 7 DAYS",
  "14days": "DEFAULT FORMULA FOR 14 DAYS",
};

const FormulaPage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [fileChange, setFileChange] = useState(false);
  const [loading, setLoading] = useState(false);

  // default selection 7days
  const [selected, setSelected] = useState<string>("7days");

  // formula states
  const [formulaMap, setFormulaMap] = useState<any>(defaultFormulas);
  const [formulaText, setFormulaText] = useState<string>(
    defaultFormulas["7days"]
  );

  // when dropdown changes, update textarea formula
  useEffect(() => {
    setFormulaText(formulaMap[selected] || "");
  }, [selected]);

  const handleChange = (value: string) => {
    setSelected(value);
  };

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

  // Save formula changes
  const handleSaveFormula = () => {
    setFormulaMap((prev: any) => ({
      ...prev,
      [selected]: formulaText,
    }));

    toast.success(`${selected} formula saved successfully`);
  };

  return (
    <>
      <div className="w-full flex justify-center items-center min-h-[90%]">
        <RolesChecks access="has_upload_report_access" />

        <div className="space-y-10 w-[500px]">
          {/* Dropdown */}
          <Select onValueChange={handleChange} value={selected}>
            <SelectTrigger className="bg-white w-full">
              <SelectValue placeholder="Select an order" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select Report Type</SelectLabel>
                {optionsSelecte.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Textarea for Formula */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Formula ({selected})
            </label>

            <textarea
              value={formulaText}
              onChange={(e) => setFormulaText(e.target.value)}
              className="w-full min-h-[150px] border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your formula here..."
            />

            <Button
              onClick={handleSaveFormula}
              className="bg-green-600 hover:bg-green-700 w-[140px]"
              disabled={loading}
            >
              Save Formula
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormulaPage;
