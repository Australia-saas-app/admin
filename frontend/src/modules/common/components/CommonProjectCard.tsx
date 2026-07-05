"use client";
import { Button } from "@/src/components/ui/button";
import React, { useState } from "react";
// import CommonButton from "./CommonButton";
export type CommonProjectCardProps = {
  category: string;
  subCategory: string;
  skill: string[];
};

const data2 = {
  category: "Web Development",
  subCategory: "Frontend",
  skill: [
    "React",
    "TypeScript",
    "CSS",
    "HTML",
    "JavaScript",
    "React",
    "TypeScript",
    "CSS",
    "HTML",
    "JavaScript",
    "React",
    "TypeScript",
    "CSS",
    "HTML",
    "JavaScript",
    "React",
    "TypeScript",
    "CSS",
    "HTML",
    "JavaScript",
    "React",
    "TypeScript",
    "CSS",
    "HTML",
    "JavaScript",
    "React",
    "TypeScript",
    "CSS",
    "HTML",
    "JavaScript",
    "React",
    "TypeScript",
    "CSS",
    "HTML",
    "JavaScript",
    "React",
    "TypeScript",
    "CSS",
    "HTML",
    "JavaScript",
  ],
};

const CommonProjectCard = ({ data }: { data: CommonProjectCardProps }) => {
  const [showItem, setShowItem] = useState(16);
  return (
    <div className="border p-4 rounded-lg shadow-md space-y-2 ">
      <h2 className="text-[#6291EA] font-medium text-[14px]">{data.category}</h2>
      <h3 className="text-[#333333] font-medium text-[26px]">
        {data.subCategory}
      </h3>
      <ul className="flex flex-wrap  gap-1">
        {data.skill.slice(0, showItem).map((skill, index) => (
          <li key={index} className="text-gray-500 text-sm">
            {skill} |
          </li>
        ))}
        {data.skill.length > showItem && (
          <li
            className="text-[#6291EA] text-sm cursor-pointer"
            onClick={() => setShowItem(data.skill.length)}
          >
            ...More
          </li>
        )}
      </ul>
      <div className="mt-5">
       <Button>Create Project</Button>
      </div>
    </div>
  );
};

export default CommonProjectCard;
