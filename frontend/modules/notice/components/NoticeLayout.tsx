import { getNotice } from "@/src/server/NoticeService"
import NoticeTable from "./NoticeTable"
import { MOCK_NOTICES } from "../data/mock-notices"
import type { Notice } from "../types/notice.type"

export default async function NoticeLayout() {
  const data = await getNotice()
  const apiNotices = (data?.data as Notice[] | undefined) ?? []
  const notices = apiNotices.length > 0 ? apiNotices : MOCK_NOTICES

  return <NoticeTable initialData={notices} />
}
