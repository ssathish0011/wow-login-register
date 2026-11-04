import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axiosInstance from "./axiosClient";

export const rtkBaseQuery: BaseQueryFn<string, unknown, unknown> = async (url, api) => {
  try {
    const response = await axiosInstance.get(url);
    return { data: response.data };
  } catch (error) {
    return { error };
  }
};

