"use client";

import React, { useMemo, useState, useEffect } from "react";
import PageHeader from '@/src/components/ui/PageHeader'
import { SearchInput } from '@/src/components/form/search-input'
import { Button } from '@/src/components/ui/button'
import {
  Table,
  TableHeading,
  TableBody,
  TableRow,
  TableColumn,
} from '@/src/components/table'
import { Pagination } from "@/src/components/ui/pagination";
import { Edit2, Trash2 } from "lucide-react";



// Tabs are provided by the global menu layout; remove per-page tabs

const sampleContacts = [
  {
    id: 3,
    name: "mr jack",
    phone: "+1 456958745",
    email: "abc@gmail.com",
    message: "Canada, Belleville",
    date: "2024-06-01",
  },
  {
    id: 2,
    name: "mr jack",
    phone: "+1 456958745",
    email: "abc@gmail.com",
    message: "Canada, Belleville",
    date: "2024-06-02",
  },
  {
    id: 1,
    name: "mr jack",
    phone: "+1 456958745",
    email: "abc@gmail.com",
    message: "Canada, Belleville",
    date: "2024-06-03",
  },
];

const ContactUsLayout: React.FC = () => {
  const [query, setQuery] = useState("");
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query) return sampleContacts;
    const q = query.toLowerCase();
    return sampleContacts.filter(
      (c) =>
        String(c.id).includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        c.date.toLowerCase().includes(q)
    );
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = (id: string) => {
    console.log("delete")
  }

  return (
    <div >
      <PageHeader
        title="Contact Us"
        right={
          <div>
            <SearchInput value={query} onChange={setQuery} placeholder="Search" />
          </div>
        }
      />

      <div className="mt-6">
        <div className="mt-6">
          <Table>
            <TableHeading>
              <TableColumn className="w-16" isHeader align="center">No.</TableColumn>
              <TableColumn isHeader>Name</TableColumn>
              <TableColumn isHeader>E-Mail</TableColumn>
              <TableColumn isHeader>Phone</TableColumn>
              <TableColumn isHeader>Message</TableColumn>
              <TableColumn isHeader>Date</TableColumn>
              <TableColumn className="w-16" isHeader align="center">Action</TableColumn>
            </TableHeading>

            <TableBody isEmpty={filtered.length === 0} colSpan={8}>
              {filtered.map((c, idx) => (
                <TableRow key={c.id}>
                  <TableColumn className="w-16 flex justify-center items-center">
                    <div className="text-center w-5 h-5 bg-primary text-white rounded">{(currentPage - 1) * PAGE_SIZE + idx + 1}</div>
                  </TableColumn>
                  <TableColumn>{c.name}</TableColumn>
                  <TableColumn>{c.email}</TableColumn>
                  <TableColumn>{c.phone}</TableColumn>
                  <TableColumn>{c.message}</TableColumn>
                  <TableColumn className="w-16">{c.date}</TableColumn>
             
                  <TableColumn>
                    <div className="flex items-center gap-2">

                      <button onClick={() => handleDelete(String(c.id))} className="p-1 text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableColumn>
                </TableRow>
              ))}
            </TableBody>
          </Table>


        </div>
        <div className="pt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} pageSize={PAGE_SIZE} totalResults={filtered.length} onPageChange={(p) => setCurrentPage(p)} />
        </div>
      </div>

    </div>
  );
};

export default ContactUsLayout;