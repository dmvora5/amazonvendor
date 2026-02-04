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
import { useGetAllFormulasQuery, useGetSpacificFormulaFormulasQuery, useUpdateFormulaMutation } from "@/redux/apis/usersApis";
import ProcessLoader from "@/components/ProcessLoader";
import { parseAndShowErrorInToast } from "@/utils";


// Default formulas
const defaultFormulas: any = {
  "7days": "DEFAULT FORMULA FOR 7 DAYS",
  "14days": "DEFAULT FORMULA FOR 14 DAYS",
};

const FormulaPage = () => {



  const { data, isLoading, isError, isSuccess } = useGetAllFormulasQuery({}) as any

  console.log('data', data)

  // default selection 7days
  const [selected, setSelected] = useState<any>("");

  const { data: formulaDetails, isLoading: detailsLoading, isSuccess: formulaSuccess } = useGetSpacificFormulaFormulasQuery(selected, {
    skip: !isFinite(selected)
  }) as any
  console.log('formulaDetails', formulaDetails)
  // formula states
  const [formulaText, setFormulaText] = useState<any>();

  const [submit, {isLoading: subMitLoading, error, isSuccess: submitSuccess}] = useUpdateFormulaMutation() as any;

  useEffect(() => {
    if(!error) return;
    parseAndShowErrorInToast(error?.response)
  },[error])

  useEffect(() => {
    if(!submitSuccess) return;
    toast.success('formula updated successfully!')
  },[submitSuccess])

  useEffect(() => {
    if (!isSuccess || !data || !Array.isArray(data)) return;
    setSelected(data[0]?.id)
  }, [data, isSuccess])

  // when dropdown changes, update textarea formula
  useEffect(() => {
    if (!formulaSuccess || !formulaDetails) return;

    setFormulaText(formulaDetails?.code);
  }, [formulaDetails, formulaSuccess]);

  const handleChange = (value: string) => {
    setSelected(value);
  };

  // Save formula changes
  const handleSaveFormula = async () => {
    try {
      await submit({
        id: selected,
        code: formulaText
      });
    } catch (error: any) {
      parseAndShowErrorInToast(error?.response)
    }

  };

  return (
    <>
      {isLoading ?
        <div className="h-[700px] w-full flex items-center justify-center">
          <ProcessLoader />
        </div>
        :
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
                  {(data as any || []).map((option: any) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
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
                disabled={detailsLoading}
                value={formulaText}
                onChange={(e) => setFormulaText(e.target.value)}
                className="w-full min-h-[150px] border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your formula here..."
              />

              <Button
                onClick={handleSaveFormula}
                className="bg-green-600 hover:bg-green-700 w-[140px]"
                disabled={isLoading || subMitLoading || detailsLoading}
              >
                Save Formula
              </Button>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default FormulaPage;
