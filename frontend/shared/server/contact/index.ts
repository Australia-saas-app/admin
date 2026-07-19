"use server";

import axiosInstance from "@/src/lib/axiosInstance";

export const createContact = async (contactForm: any) => {
  try {
    const response = await axiosInstance.post("/contact", contactForm);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to submit contact form");
  }
};
