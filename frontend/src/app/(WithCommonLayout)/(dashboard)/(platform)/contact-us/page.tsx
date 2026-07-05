"use client"

import React, { useState, useEffect } from 'react'
import PlatformLayout from '@/src/modules/dashboard/shared/components/PlatformLayout'
import { contactService } from '@/src/modules/dashboard/services/platform'
import { ContactViewModal } from '@/src/modules/dashboard/contact-us/components/ContactViewModal'
import { TableColumn } from '@/src/components/table'

const Page = () => {
    const [viewId, setViewId] = useState<string | null>(null)

    const [refreshKey, setRefreshKey] = useState(0)
    const [viewData, setViewData] = useState<any | null>(null)

    // Handle Fetching Item for Edit/View
    useEffect(() => {
        const id =  viewId;
        if (id) {
            contactService.getItem(id).then(data => setViewData(data));
        } else {
            setViewData(null);
        }
    }, [ viewId])

 

      const handleToggleVisibility = async (id: string) => {
      
    }

    

    return (
        <>
            <PlatformLayout
                title="Contact Us"
                 onToggleVisibilityClick={(id) => handleToggleVisibility(id)}
                fetchItems={contactService.fetchItems}
                onAddClick={() => {}}
                onEditClick={() => {}} 
                onDeleteClick={() => {}}
                onViewClick={(id) => setViewId(id)}
                refreshKey={refreshKey}
                colSpan={7}
                extraColumns={
                    <>
                        <TableColumn isHeader>Name</TableColumn>
                        <TableColumn isHeader>E-Mail</TableColumn>
                        <TableColumn isHeader>Message</TableColumn>
                    </>
                }
                renderExtraCells={(item) => (
                    <>
                        <TableColumn>{item.name}</TableColumn>
                        <TableColumn>{item.email}</TableColumn>
                        <TableColumn title={item?.message || "No message"} className="max-w-sm truncate">
                             <div

                                className="text-gray-700 text-base leading-relaxed "
                                dangerouslySetInnerHTML={{ __html: item?.message || "<i>No content available</i>" }}
                            ></div>
                        </TableColumn>
                    </>
                )}
            />

        

            <ContactViewModal isOpen={!!viewId} onClose={() => setViewId(null)} data={viewData} />

           
        </>
    )
}

export default Page