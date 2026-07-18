"use client";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// import { CommonSelect } from "./CommonSelect";
import { useForm } from "react-hook-form";
import { Menu, X } from "lucide-react";
// import { Button } from "../ui/button";
// useState is not required here
import { Button } from "@/src/components/ui/button";
import { CommonSelect } from "./CommonSelect";

const categories = [
  "All",
  "Web Development",
  "Mobile Development",
  "Database",
  "Business",
  "Design",
];
const subCategories = [
  "All",
  "Web Development",
  "Mobile Development",
  "Database",
  "Business",
  "Design",
];
const skills = ["HTML", "CSS", "JavaScript", "React", "React Native", "SQL", "MongoDB", "Legal"];
const priceRanges = ["Under $20", "$20-$50", "$50-$100", "Over $100"];

interface FormData {
  price: string[];
  skills: string[];
  subCategory: string[];
  category: string[];
}

interface SidebarProps {
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
}

const CommonServiceSidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { control } = useForm<FormData>({
    defaultValues: {
      price: [],
      skills: [],
      subCategory: [],
      category: [],
    },
  });

  return (
    <>
      {!isSidebarOpen && (
        <Button
          variant="outline"
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-2"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      <aside
        className={`transition-all duration-300 ease-in-out space-y-6 ${
          isSidebarOpen
            ? "lg:w-80 w-full opacity-100 translate-x-0"
            : "lg:w-0 w-full lg:opacity-0 lg:-translate-x-full opacity-100 translate-x-0"
        } ${isSidebarOpen ? "block" : "hidden lg:block"}`}
        style={{ position: "relative", zIndex: 100 }}
      >
        <div
          className="bg-card border border-border rounded-lg shadow-sm"
          style={{ position: "relative", zIndex: 100 }}
        >
          <div className="p-6 border-b flex justify-between items-center border-border">
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            {isSidebarOpen && (
              <Button
                variant="outline"
                onClick={() => setIsSidebarOpen && setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="p-6 space-y-6">
            {/* Category Filter */}
            <div>
              <CommonSelect
                options={categories.map((range) => ({
                  value: range,
                  label: range,
                }))}
                placeholder="Select Category"
                control={control}
                name="category"
              />
            </div>

            {/* Sub Category Filter */}
            <div>
              <CommonSelect
                options={subCategories.map((range) => ({
                  value: range,
                  label: range,
                }))}
                placeholder="Select Sub Category"
                control={control}
                name="subCategory"
              />
            </div>
            {/* Skills Filter */}
            <div>
              <CommonSelect
                options={skills.map((skill) => ({
                  value: skill,
                  label: skill,
                }))}
                placeholder="Select Skills"
                control={control}
                name="skills"
              />
            </div>

            {/* Price Range Filter */}
            <div style={{ zIndex: 200, position: "relative" }}>
              <CommonSelect
                options={priceRanges.map((range) => ({
                  value: range,
                  label: range,
                }))}
                placeholder="Select Price Range"
                control={control}
                name="price"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CommonServiceSidebar;
