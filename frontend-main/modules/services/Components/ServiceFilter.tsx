"use client";

import React, { useMemo, useState, useId } from "react";
import { Button } from "@/src/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import ReactSelect, { MultiValue } from "react-select";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";

const projectTypeOptions = [
  { value: "new-build", label: "New Build" },
  { value: "upgrade", label: "Upgrade" },
  { value: "troubleshooting", label: "Troubleshooting" },
  { value: "maintenance", label: "Maintenance" },
  { value: "installation", label: "Installation" },
];

const categoryOptions = [
  { value: "software", label: "Software Development" },
  { value: "web", label: "Web Design & UI/UX" },
  { value: "mobile", label: "Mobile App" },
];

const subcategoryOptions = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Full Stack" },
];

const skillsOptions = [
  { value: "html", label: "HTML5" },
  { value: "css", label: "CSS3" },
  { value: "js", label: "JavaScript" },
  { value: "ts", label: "TypeScript" },
  { value: "react", label: "React" },
];

const languageOptions = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "bengali", label: "Bengali" },
];

const ServiceFilter: React.FC = () => {
  const [projectType, setProjectType] = useState<string>(projectTypeOptions[0].value);
  const [category, setCategory] = useState<string>(categoryOptions[0].value);
  const [subcategory, setSubcategory] = useState<string>(subcategoryOptions[0].value);
  const form = useForm({ defaultValues: { skills: [] as string[], languages: [] as string[] } });
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  // stable ids for react-select to avoid SSR/CSR hydration id mismatches
  const skillsInstanceId = useId();
  const languagesInstanceId = useId();

  const clearFilters = () => {
    setProjectType(projectTypeOptions[0].value);
    setCategory(categoryOptions[0].value);
    setSubcategory(subcategoryOptions[0].value);
    form.reset({ skills: [], languages: [] });
    setMinPrice(0);
    setMaxPrice(2000);
  };

  const percent = useMemo(() => Math.round((maxPrice / 2000) * 100), [maxPrice]);

  return (
    <div className="w-full">
      <div>
        <div className="flex  items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm cursor-pointer absolute right-2 top-11 text-primary underline"
          >
            Clear
          </button>
        </div>

        {/* Project Type */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Project Type</label>
          <Select value={projectType} onValueChange={(v) => setProjectType(String(v))}>
            <SelectTrigger className="w-full h-10 text-sm bg-card">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Category</label>
          <Select value={category} onValueChange={(v) => setCategory(String(v))}>
            <SelectTrigger className="w-full h-10 text-sm bg-card">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sub Category */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Sub Category</label>
          <Select value={subcategory} onValueChange={(v) => setSubcategory(String(v))}>
            <SelectTrigger className="w-full h-10 text-sm bg-card">
              <SelectValue placeholder="Select sub category" />
            </SelectTrigger>
            <SelectContent>
              {subcategoryOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Skills</label>
          <Controller
            control={form.control}
            name="skills"
            render={({ field }) => (
              <ReactSelect
                isMulti
                options={skillsOptions}
                instanceId={skillsInstanceId}
                inputId={`${skillsInstanceId}-input`}
                // react-select expects option objects { value, label }
                value={(field.value || []).map((v: string) => ({
                  value: v,
                  label: skillsOptions.find((s) => s.value === v)?.label || v,
                }))}
                onChange={(val: MultiValue<{ value: string; label: string }> | null) =>
                  field.onChange(val ? val.map((v) => v.value) : [])
                }
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select skills"
              />
            )}
          />
        </div>

        {/* Languages */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Languages</label>
          <Controller
            control={form.control}
            name="languages"
            render={({ field }) => (
              <ReactSelect
                isMulti
                options={languageOptions}
                instanceId={languagesInstanceId}
                inputId={`${languagesInstanceId}-input`}
                value={(field.value || []).map((v: string) => ({
                  value: v,
                  label: languageOptions.find((s) => s.value === v)?.label || v,
                }))}
                onChange={(val: MultiValue<{ value: string; label: string }> | null) =>
                  field.onChange(val ? val.map((v) => v.value) : [])
                }
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select languages"
              />
            )}
          />
        </div>

        {/* Price / Budget */}
        <div className="mb-4">
          <label className="block text-sm mb-2">Price / Budget</label>
          <div className="flex items-center gap-3">
            <Input
              value={String(minPrice)}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-1/2"
              type="number"
              min={0}
            />
            <Input
              value={String(maxPrice)}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-1/2"
              type="number"
              min={0}
            />
          </div>

          <div className="mt-3">
            <input
              type="range"
              min={0}
              max={2000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Up to {maxPrice} USD ({percent}%)
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" className="w-full" onClick={clearFilters}>
            Reset
          </Button>
          <Button className="w-full">Apply Filters</Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceFilter;
