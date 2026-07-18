import BranchList from "./BranchList"
import { getBranches } from "@/src/server/BranchService"
import { MOCK_BRANCHES } from "../data/mock-branches"
import type { GlobalBranch } from "../types/global.type"

export default async function GlobalBranchesLayout() {
  const response = await getBranches()
  const apiBranches = (response?.data as GlobalBranch[] | undefined) ?? []
  const branches = apiBranches.length > 0 ? apiBranches : MOCK_BRANCHES

  return <BranchList initialData={branches} />
}
