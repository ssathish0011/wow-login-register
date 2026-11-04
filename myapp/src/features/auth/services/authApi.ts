import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../../config/config";
import { storage } from "../../../services/storage/storageHelper";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: async (headers) => {
      const token = await storage.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    timeout: 10000,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: "/users/login",
        method: "POST",
        body: payload,
      }),
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: "/users/register",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

