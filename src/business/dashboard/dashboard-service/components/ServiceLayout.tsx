"use client"

import React, { useState } from 'react'
import { X } from 'lucide-react'
import PageHeader from '@/src/shared/ui/ui/PageHeader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/ui/ui/select'

interface ServiceLayoutProps {
  categories?: string[]
  subCategories?: string[]
  skills?: string[]
  onAddCategory?: (text: string) => void
  onRemoveCategory?: (index: number) => void
  onAddSubCategory?: (text: string) => void
  onRemoveSubCategory?: (index: number) => void
  onAddSkill?: (text: string) => void
  onRemoveSkill?: (index: number) => void
}

const ServiceLayout: React.FC<ServiceLayoutProps> = (props) => {
  const [categories, setCategories] = useState<string[]>([
    'Website IT & Software',
    'Writing Content',
    'UI/UX Designer',
    'Software',
    'Website IT & Software',
    'Website IT & Software',
  ])

  const [subCategories, setSubCategories] = useState<string[]>([
    'Website IT & Software',
    'Writing Content',
    'UI/UX Designer',
    'Software',
    'Website IT & Software',
    'Website IT & Software',
  ])

  const [skills, setSkills] = useState<string[]>([
    'SEO',
    'Adobe Photoshop',
    'SEO',
    'UI/UX Designer'
  ])

  const [newCategory, setNewCategory] = useState('')
  const [newSubCategory, setNewSubCategory] = useState('')
  const [newSkill, setNewSkill] = useState('')

  const addCategory = () => {
    if (!newCategory.trim()) return
    setCategories(s => [newCategory.trim(), ...s])
    setNewCategory('')
  }

  const addSubCategory = () => {
    if (!newSubCategory.trim()) return
    setSubCategories(s => [newSubCategory.trim(), ...s])
    setNewSubCategory('')
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    setSkills(s => [...s, newSkill.trim()])
    setNewSkill('')
  }

  const removeCategory = (idx: number) => setCategories(s => s.filter((_, i) => i !== idx))
  const removeSubCategory = (idx: number) => setSubCategories(s => s.filter((_, i) => i !== idx))
  const removeSkill = (idx: number) => setSkills(s => s.filter((_, i) => i !== idx))

  const [serviceType, setServiceType] = useState("Technology")

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden min-h-[70vh]">
      <div className="flex flex-col gap-6 w-full bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <PageHeader title="Service" />
          
          <div className="w-full md:w-64">
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="h-10 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm w-full">
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[100]">
                <SelectItem value="Technology" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Technology</SelectItem>
                <SelectItem value="Real Estate" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Real Estate</SelectItem>
                <SelectItem value="Business" className="focus:bg-blue-600 focus:text-white cursor-pointer rounded-sm mx-1 my-0.5">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-4">
          
          {/* Categories Panel */}
          <fieldset className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col h-fit">
            <legend className="mx-4 px-2 text-sm font-bold text-slate-500 dark:text-slate-400">Category</legend>
            <div className="flex items-center gap-2 p-3 border-b border-slate-300 dark:border-slate-700">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                placeholder="Search"
              />
              <button 
                onClick={addCategory} 
                className="px-4 py-2 font-bold text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Add
              </button>
            </div>
            <ul className="flex flex-col max-h-[400px] overflow-auto">
              {categories.map((c, idx) => (
                <li key={idx} className="group flex justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 last:border-b-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{c}</span>
                  <button onClick={() => removeCategory(idx)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          {/* SubCategories Panel */}
          <fieldset className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col h-fit">
            <legend className="mx-4 px-2 text-sm font-bold text-slate-500 dark:text-slate-400">Subcategory</legend>
            <div className="flex items-center gap-2 p-3 border-b border-slate-300 dark:border-slate-700">
              <input
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSubCategory()}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                placeholder="Search"
              />
              <button 
                onClick={addSubCategory} 
                className="px-4 py-2 font-bold text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Add
              </button>
            </div>
            <ul className="flex flex-col max-h-[400px] overflow-auto">
              {subCategories.map((s, idx) => (
                <li key={idx} className="group flex justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 last:border-b-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">{s}</span>
                  <button onClick={() => removeSubCategory(idx)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          {/* Skills Panel */}
          <fieldset className="border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 flex flex-col h-fit min-h-[150px]">
            <legend className="mx-4 px-2 text-sm font-bold text-slate-500 dark:text-slate-400">Skills</legend>
            <div className="flex items-center gap-2 p-3 border-b border-slate-300 dark:border-slate-700">
              <input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                placeholder="Search skills"
              />
              <button 
                onClick={addSkill} 
                className="px-4 py-2 font-bold text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5 p-4 max-h-[400px] overflow-auto content-start">
              {skills.map((skill, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">
                  {skill}
                  <button onClick={() => removeSkill(idx)} className="hover:text-red-500 transition-colors ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </fieldset>

        </div>
      </div>
    </div>
  )
}

export default ServiceLayout