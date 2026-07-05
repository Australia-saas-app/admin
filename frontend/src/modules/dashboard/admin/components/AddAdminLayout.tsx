"use client"

import { Form } from "@/src/components/form/form"
import { FormInput } from "@/src/components/form/form-input"
import { FormSelect } from "@/src/components/form/form-select"
import { UploadFile } from "@/src/components/form/UploadFile"
import { Button } from "@/src/components/ui/button"
import React from "react"
import { useForm } from "react-hook-form"

type AddAdminFormValues = {
  photo: string
  name: string
  role: string
  position: string
  supportLanguage: string
  email: string
  loginUrl: string
  password: string
  access: string
}

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "sub-admin", label: "Sub Admin" },
]

const AddAdminLayout: React.FC = () => {
  const form = useForm<AddAdminFormValues>({
    defaultValues: {
      photo: "",
      name: "",
      role: "admin",
      position: "",
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

  return (
    <div className="p-6">
      <div className="w-full md:w-2/3 shadow p-5 rounded-lg border mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Admin</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Photo */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Photo</label>
              <UploadFile control={form.control} name="photo" accept="image/*" maxSizeMB={5} showPreview={true} />
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Name</label>
                <FormInput control={form.control} name="name" placeholder="Rizwan" className="h-11" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Role</label>
                <FormSelect
                  control={form.control}
                  name="role"
                  placeholder="Select Role"
                  options={roleOptions}
                  className="h-11"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Position</label>
                <FormInput control={form.control} name="position" placeholder="Manager" className="h-11" />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Support Language</label>
                <FormInput control={form.control} name="supportLanguage" placeholder="Eng. Hin" className="h-11" />
              </div>
            </div>

            {/* Contact & Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Email</label>
                <FormInput control={form.control} name="email" placeholder="rizwan@gmail.com" type="email" className="h-11" />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Login URL</label>
                <div className="flex gap-2">
                  <FormInput control={form.control} name="loginUrl" placeholder="Login URL" className="h-11 flex-1" />
                  <Button type="button" >
                    Generate
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
                <FormInput
                  control={form.control}
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  showPasswordToggle
                  className="h-11"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Access Code</label>
                <FormInput control={form.control} name="access" placeholder="123456789" className="h-11" />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" className="px-6 py-2">Cancel</Button>
              <Button type="submit" >Save</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default AddAdminLayout