import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import http from "./http";

export interface AxiosError {
  status: number;
  data: unknown;
}

export const axiosBaseQuery =
  (): BaseQueryFn<string, unknown, AxiosError> =>
  async (url, api, extraOptions) => {
    try {
      const result = await http.request({
        url,
        method: (extraOptions as any)?.method || "GET",
        data: (extraOptions as any)?.body,
        params: (extraOptions as any)?.params,
      });
      return { data: result.data };
    } catch (error: any) {
      return {
        error: {
          status: error?.response?.status || 500,
          data: error?.response?.data || error?.message || "Unknown error",
        },
      };
    }
  };