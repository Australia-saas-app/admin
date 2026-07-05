'use client'
import React, { useState } from 'react'
import { Button } from '@/src/components/ui/button'
import { Plus, X } from 'lucide-react'

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

const ServiceLayout: React.FC<ServiceLayoutProps> = ({
  categories: propsCategories,
  subCategories: propsSubCategories,
  skills: propsSkills,
  onAddCategory,
  onRemoveCategory,
  onAddSubCategory,
  onRemoveSubCategory,
  onAddSkill,
  onRemoveSkill,
}) => {
  const [categories, setCategories] = useState<string[]>([
    'IT & Software',
    'Building & Construction',
    'Plumbing',
    'Electrical',
  ])

  const [subCategories, setSubCategories] = useState<string[]>([
    'Mobile App Developer',
    'Web Developer',
    'Graphic Designer',
  ])

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'React',
    'Tailwind CSS',
    'Node.js',
  ])

  // Local UI state for inline add inputs
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  const [addingSubCategory, setAddingSubCategory] = useState(false)
  const [newSubCategory, setNewSubCategory] = useState('')

  const [addingSkill, setAddingSkill] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  const addCategory = (text?: string) => {
    const val = (text ?? newCategory).trim()
    if (!val) return
    setCategories((s) => [...s, val])
    setNewCategory('')
    setAddingCategory(false)
  }

  const addSubCategory = (text?: string) => {
    const val = (text ?? newSubCategory).trim()
    if (!val) return
    setSubCategories((s) => [...s, val])
    setNewSubCategory('')
    setAddingSubCategory(false)
  }

  const addSkill = (text?: string) => {
    const val = (text ?? newSkill).trim()
    if (!val) return
    setSelectedSkills((s) => [...s, val])
    setNewSkill('')
    setAddingSkill(false)
  }

  const removeCategory = (idx: number) => setCategories((s) => s.filter((_, i) => i !== idx))
  const removeSubCategory = (idx: number) => setSubCategories((s) => s.filter((_, i) => i !== idx))
  const removeSkill = (idx: number) => setSelectedSkills((s) => s.filter((_, i) => i !== idx))

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Service</h2>
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 border rounded bg-white text-sm">
            <option>Technology</option>
            <option>Home Services</option>
            <option>Business</option>
          </select>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Categories Panel */}
        <div className="bg-white border rounded shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Category</h3>
            <Button size="sm" variant="ghost" onClick={() => setAddingCategory(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>

          <div className="space-y-2 max-h-80 overflow-auto">
            {categories.map((c, idx) => (
              <div key={c + idx} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{c}</span>
                <button onClick={() => removeCategory(idx)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Inline add input for categories */}
            {addingCategory && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  autoFocus
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addCategory()
                    if (e.key === 'Escape') {
                      setAddingCategory(false)
                      setNewCategory('')
                    }
                  }}
                  className="flex-1 px-3 py-2 border rounded bg-white text-sm"
                  placeholder="New category"
                />
                <Button size="sm" onClick={() => addCategory()}>
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setAddingCategory(false); setNewCategory('') }}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* SubCategories Panel */}
        <div className="bg-white border rounded shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Sub Category</h3>
            <Button size="sm" variant="ghost" onClick={() => setAddingSubCategory(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>

          <div className="space-y-2 max-h-80 overflow-auto">
            {subCategories.map((s, idx) => (
              <div key={s + idx} className="flex items-center justify-between p-2 border rounded">
                <span className="text-sm">{s}</span>
                <button onClick={() => removeSubCategory(idx)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Inline add input for sub-categories */}
            {addingSubCategory && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  autoFocus
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addSubCategory()
                    if (e.key === 'Escape') {
                      setAddingSubCategory(false)
                      setNewSubCategory('')
                    }
                  }}
                  className="flex-1 px-3 py-2 border rounded bg-white text-sm"
                  placeholder="New sub category"
                />
                <Button size="sm" onClick={() => addSubCategory()}>
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setAddingSubCategory(false); setNewSubCategory('') }}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Selected Skills Panel */}
        <div className="bg-white border rounded shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Selected Skills</h3>
            <Button size="sm" variant="ghost" onClick={() => setAddingSkill(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>

          <div className="min-h-[120px] p-2">
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill, idx) => (
                <div key={skill + idx} className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-900 px-3 py-1 rounded-full text-sm">
                  <span>{skill}</span>
                  <button onClick={() => removeSkill(idx)} className="opacity-80 hover:opacity-100">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Inline add input for skills */}
            {addingSkill && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  autoFocus
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addSkill()
                    if (e.key === 'Escape') {
                      setAddingSkill(false)
                      setNewSkill('')
                    }
                  }}
                  className="flex-1 px-3 py-2 border rounded bg-white text-sm"
                  placeholder="New skill"
                />
                <Button size="sm" onClick={() => addSkill()}>
                  Add
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setAddingSkill(false); setNewSkill('') }}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceLayout