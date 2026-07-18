import React from "react"
import OurTeamList from "./OurTeamList"
import { getTeam } from "@/src/server/TeamService"

const OurTeamLayout = async () => {
  const data = await getTeam()
  const teams = Array.isArray(data?.data) ? data.data : []

  return <OurTeamList initialData={teams} />
}

export default OurTeamLayout
