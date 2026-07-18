import { PageSpinner } from "@/src/components/ui/Spinner"

export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <PageSpinner label="Loading..." />
    </div>
  )
}
