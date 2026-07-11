"use client"

import { Form, FormControl, FormField, FormItem } from "@/src/shared/ui/form/form"
import { Button } from "@/src/shared/ui/ui/button"
import PageHeader from "@/src/shared/ui/ui/PageHeader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/ui/ui/select"
import { ArrowLeft, KeySquare, Eye, EyeOff, Upload, Copy } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

type AddAdminFormValues = {
  photo: string
  name: string
  role: string
  country: string
  supportLanguage: string
  email: string
  loginUrl: string
  password: string
  access: string
}

const roleOptions = [
  { value: "Super Admin", label: "Super Admin" },
  { value: "Admin", label: "Admin" },
  { value: "Department Manager", label: "Department Manager" },
  { value: "Finance Manager", label: "Finance Manager" },
  { value: "Project Manager", label: "Project Manager" },
  { value: "Support", label: "Support" },
  { value: "Auditor", label: "Auditor" },
  { value: "Guest", label: "Guest" },
]

const AddAdminLayout: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<AddAdminFormValues>({
    defaultValues: {
      photo: "",
      name: "",
      role: "",
      country: "",
      supportLanguage: "",
      email: "",
      loginUrl: "",
      password: "",
      access: "",
    },
  })

  const onSubmit = (values: AddAdminFormValues) => {
    // Replace with API call
    alert("Admin saved")
  }

  // Common solid input classes
  const inputClasses = "w-full h-12 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden min-h-[70vh]">
      {/* We use max-w-3xl so two inputs can comfortably sit side-by-side without squishing the Generate button */}
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        
        {/* Header & Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="icon" className="rounded-xl shadow-sm h-10 w-10">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Button>
          </Link>
          <PageHeader title="Add Administrator" />
        </div>

        {/* Solid Form Container */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
              
              {/* Photo Section */}
              <FormField control={form.control} name="photo" render={({ field }) => {
                const fileInputRef = React.useRef<HTMLInputElement>(null)
                return (
                  <FormItem>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 ml-1">Profile Photo</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => {
                           const file = e.target.files?.[0];
                           if(file) field.onChange(file.name)
                        }}
                      />
                      <FormControl>
                        <div className="relative flex-1">
                          <input readOnly placeholder="Select a file" value={field.value} className={`${inputClasses} w-full pl-11 cursor-pointer`} onClick={() => fileInputRef.current?.click()} />
                          <Upload className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </FormControl>
                      <Button type="button" onClick={() => fileInputRef.current?.click()} size="lg" className="h-12 rounded-xl px-6">
                        Browse
                      </Button>
                    </div>
                  </FormItem>
                )
              }} />

              <div className="h-px w-full bg-slate-200 dark:bg-slate-700 my-6"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 ml-1">Name</label>
                      <FormControl><input {...field} placeholder="E.g. Rizwan" className={inputClasses} /></FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 ml-1">Roll</label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={inputClasses}>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl">
                          {roleOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg mx-1 my-0.5 font-medium">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="country" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 ml-1">Country</label>
                      <FormControl><input {...field} placeholder="Japan , Canada" className={inputClasses} /></FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="supportLanguage" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 ml-1">Support language</label>
                      <FormControl><input {...field} placeholder="Eng . Hin" className={inputClasses} /></FormControl>
                    </FormItem>
                  )} />
              </div>

              <div className="h-px w-full bg-slate-200 dark:bg-slate-700 my-6"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 ml-1">gmail</label>
                      <FormControl><input {...field} type="email" placeholder="Rizwan@Gmail.Com" className={inputClasses} /></FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="loginUrl" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 ml-1">Login Url</label>
                      <div className="flex items-center gap-2">
                        <FormControl><input {...field} placeholder="Ejhghehlhldvhdlvhdvihivhvd;Vhdvegel" className={`${inputClasses} flex-1`} /></FormControl>
                        <Button type="button" size="lg" className="h-12 rounded-xl px-4">
                          URL Generate
                        </Button>
                        <Button variant="secondary" type="button" size="icon" className="h-12 w-12 rounded-xl text-slate-600">
                          <Copy className="w-5 h-5" />
                        </Button>
                      </div>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 ml-1">Password</label>
                      <div className="relative">
                        <FormControl><input {...field} type={showPassword ? "text" : "password"} placeholder="123456789" className={inputClasses} /></FormControl>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="access" render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1 ml-1">Access</label>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "123456789"}>
                        <FormControl>
                          <SelectTrigger className={inputClasses}>
                            <SelectValue placeholder="Select Access" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl">
                          <SelectItem value="123456789" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg mx-1 my-0.5 font-medium">123456789</SelectItem>
                          <SelectItem value="987654321" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg mx-1 my-0.5 font-medium">987654321</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700 mt-8">
                <Link href="/admin" className="w-full sm:w-auto">
                  <Button variant="outline" type="button" size="lg" className="w-full sm:w-auto px-8 rounded-xl h-12">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" size="lg" className="w-full sm:w-auto px-10 rounded-xl h-12">
                  Save
                </Button>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default AddAdminLayout