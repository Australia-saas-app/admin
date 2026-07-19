import dynamic from "next/dynamic"

const SettingsLayout = dynamic(
  () => import("@/src/modules/dashboard/user/components/SettingsLayout"),
  { loading: () => <div className="py-20 text-center text-sm text-gray-500">Loading...</div> }
)

export default function Page() {
  return <SettingsLayout />
}
