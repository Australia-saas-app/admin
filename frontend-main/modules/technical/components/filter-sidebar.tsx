"use client"

import { Button } from "@/src/components/ui/button"
import { ChevronDown } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

export function FilterSidebar() {
  const [openSections, setOpenSections] = useState({
    projectType: true,
    category: true,
    subCategory: false,
    skills: false,
    languages: false,
    priceRanges: false,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <aside className="w-64 border-r bg-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-card-foreground">Filters</h2>
        <Button variant="link" className="h-auto p-0 text-sm text-primary">
          Clear
        </Button>
      </div>

      <div className="space-y-6">
        {/* Project Type */}
        {/* <Collapsible open={openSections.projectType}>
          <div className="space-y-3">
            <CollapsibleTrigger
              className="flex w-full items-center justify-between text-sm font-medium text-card-foreground"
              onClick={() => toggleSection("projectType")}
            >
              Project Type
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.projectType ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="fixed" />
                <Label htmlFor="fixed" className="text-sm text-muted-foreground cursor-pointer">
                  Fixed Price
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="hourly" />
                <Label htmlFor="hourly" className="text-sm text-muted-foreground cursor-pointer">
                  Hourly Rate
                </Label>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible> */}

        {/* Category */}
        {/* <Collapsible open={openSections.category}>
          <div className="space-y-3">
            <CollapsibleTrigger
              className="flex w-full items-center justify-between text-sm font-medium text-card-foreground"
              onClick={() => toggleSection("category")}
            >
              Category
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.category ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="web-dev" defaultChecked />
                <Label htmlFor="web-dev" className="text-sm text-muted-foreground cursor-pointer">
                  Web Development
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="mobile-dev" />
                <Label htmlFor="mobile-dev" className="text-sm text-muted-foreground cursor-pointer">
                  Mobile Development
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="design" />
                <Label htmlFor="design" className="text-sm text-muted-foreground cursor-pointer">
                  Design
                </Label>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible> */}

        {/* Sub Category */}
        {/* <Collapsible open={openSections.subCategory}>
          <div className="space-y-3">
            <CollapsibleTrigger
              className="flex w-full items-center justify-between text-sm font-medium text-card-foreground"
              onClick={() => toggleSection("subCategory")}
            >
              Sub Category
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.subCategory ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="frontend" />
                <Label htmlFor="frontend" className="text-sm text-muted-foreground cursor-pointer">
                  Frontend
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="backend" />
                <Label htmlFor="backend" className="text-sm text-muted-foreground cursor-pointer">
                  Backend
                </Label>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible> */}

        {/* Skills */}
        {/* <Collapsible open={openSections.skills}>
          <div className="space-y-3">
            <CollapsibleTrigger
              className="flex w-full items-center justify-between text-sm font-medium text-card-foreground"
              onClick={() => toggleSection("skills")}
            >
              Skills
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.skills ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="react" />
                <Label htmlFor="react" className="text-sm text-muted-foreground cursor-pointer">
                  React
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="node" />
                <Label htmlFor="node" className="text-sm text-muted-foreground cursor-pointer">
                  Node.js
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="python" />
                <Label htmlFor="python" className="text-sm text-muted-foreground cursor-pointer">
                  Python
                </Label>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible> */}

        {/* Languages */}
        {/* <Collapsible open={openSections.languages}>
          <div className="space-y-3">
            <CollapsibleTrigger
              className="flex w-full items-center justify-between text-sm font-medium text-card-foreground"
              onClick={() => toggleSection("languages")}
            >
              Languages
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.languages ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="english" />
                <Label htmlFor="english" className="text-sm text-muted-foreground cursor-pointer">
                  English
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="spanish" />
                <Label htmlFor="spanish" className="text-sm text-muted-foreground cursor-pointer">
                  Spanish
                </Label>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible> */}

        {/* Price Ranges */}
        {/* <Collapsible open={openSections.priceRanges}>
          <div className="space-y-3">
            <CollapsibleTrigger
              className="flex w-full items-center justify-between text-sm font-medium text-card-foreground"
              onClick={() => toggleSection("priceRanges")}
            >
              Price Ranges
              <ChevronDown className={`h-4 w-4 transition-transform ${openSections.priceRanges ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox id="range1" />
                <Label htmlFor="range1" className="text-sm text-muted-foreground cursor-pointer">
                  $0 - $1,000
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="range2" />
                <Label htmlFor="range2" className="text-sm text-muted-foreground cursor-pointer">
                  $1,000 - $5,000
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="range3" />
                <Label htmlFor="range3" className="text-sm text-muted-foreground cursor-pointer">
                  $5,000+
                </Label>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible> */}
      </div>
    </aside>
  )
}
