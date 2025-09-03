"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ApiState from "@/components/ApiState";
import RolesChecks from "@/components/RolesChecks";
import { toast } from "react-toastify";
import { useAddCookiesMutation } from "@/redux/apis/usersApis";

const CookiesPage = () => {
  const [cookies, setCookies] = useState("");
  const [addCookies, { isLoading }] = useAddCookiesMutation();

  const handleSave = async () => {
    if (!cookies.trim()) {
      toast.error("Please enter cookies before saving.");
      return;
    }

    try {
      // build form-data for API
      const formData = new FormData();
      formData.append("cookies_data", cookies);

      const response: any = await addCookies(formData).unwrap();
      toast.success(response?.detail || "Cookies saved successfully!");
      setCookies("");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to save cookies.");
    }
  };

  const handleClear = () => {
    setCookies("");
  };

  return (
    <div className="w-full flex justify-center items-center min-h-[90%]">
      <RolesChecks access="has_cookies_access" />

      <div className="flex flex-col space-y-6 w-[500px]">
        <ApiState error={null} isSuccess={false}>
          <ApiState.ArthorizeCheck />
        </ApiState>

        {/* Page Title */}
        <h2 className="text-xl font-semibold text-gray-800">Add Cookies</h2>

        {/* Cookies textarea */}
        <textarea
          value={cookies}
          onChange={(e) => {
            if (e.target.value.length <= 2000) {
              setCookies(e.target.value);
            }
          }}
          rows={8}
          maxLength={2000}
          placeholder="Paste your cookies here (max 2000 characters)..."
          className="block w-full h-40 resize-none rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
        />

        {/* Buttons */}
        <div className="flex space-x-4">
          <Button
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-blue-600"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
