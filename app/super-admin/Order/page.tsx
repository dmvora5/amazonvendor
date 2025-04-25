"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetOrderQuery,
  useUpdateOrderMutation,
} from "@/redux/apis/usersApis";

const OrderType = () => {
  const [selectedOrderValue, setSelectedOrderValue] = useState("");

  const {
    data: orderData,
    isLoading: isOrderDataLoading,
    error: isOrderDataError,
    isFetching: isOrderDataFetching,
  } = useGetOrderQuery({});

  const [updateOrder, updateOrderOptions] = useUpdateOrderMutation();

  // Options for the dropdown
  const optionsForOrder = [
    { label: "2 Weeks", value: "2W" },
    { label: "6 Weeks", value: "6W" },
    { label: "2 Months", value: "2M" },
    { label: "3 Months", value: "3M" },
    { label: "4W 14D Sale", value: "4W_14D_SALE" },
  ];

  const handleChange = async (value: string) => {
    setSelectedOrderValue(value);
    try {
      const payload = {
        order_type: value,
      };

      const res = await updateOrder(payload);
      console.log("Order type updated successfully:", res);
    } catch (error) {
      console.error("Error updating order type:", error);
    }
  };

  // Set default value once data is fetched
  useEffect(() => {
    if ((orderData as any)?.order_type) {
      setSelectedOrderValue((orderData as any)?.order_type);
    }
  }, [orderData]);

  return (
    <div className="w-[95%] mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="p-2 ml-auto">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select your order type:
        </label>
        <Select onValueChange={handleChange} value={selectedOrderValue}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select an order" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Order</SelectLabel>
              {optionsForOrder.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrderType;
