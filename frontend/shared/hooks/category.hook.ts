// import { getBusinessCategories, getSubBusinessCategories } from "@/src/server/CategoryService";
import { useQuery } from "@tanstack/react-query";

export const useBusinessCategories = () => {
  return useQuery({
    queryKey: ["BUSINESS_CATEGORIES"],
    queryFn: async () =>{},
  });
};

export const useSubBusinessCategories = (businessCategoryId?: string) => {
  return useQuery({
    queryKey: ["SUB_BUSINESS_CATEGORIES", businessCategoryId ?? "all"],
    queryFn: async () => {},
    enabled: !!businessCategoryId,
  });
};
