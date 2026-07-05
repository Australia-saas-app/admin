import React from "react";
export type CommonServiceCardProps = {
  title: string;
  category: string;
  subCategory: string[];
  skills: string[];
  price: string;
  priorityLevel: string;
  projectDescription?: string;
  createdAt: Date;
  expectedStartDate: Date;
  expectedEndDate: Date;
};

// const data2 = {
//   title: "Web Development Project",
//   category: "Web Development",
//   subCategory: ["Frontend", "Backend"],
//   skills: ["React", "Node.js", "CSS"],
//   price: "1000",
//   priorityLevel: "High",
//   projectDescription:
//     "A comprehensive web development project.A comprehensive web development project.A comprehensive web development project.A comprehensive web development project.A comprehensive web development project.A comprehensive web development project.",
//   createdAt: new Date("2023-01-01"),
//   expectedStartDate: new Date("2023-02-01"),
//   expectedEndDate: new Date("2023-03-01"),
// };

const CommonServiceCard = ({ data }: { data: CommonServiceCardProps }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md space-y-1 ">
      <h1 className="text-[#0097F5] text-xl font-semibold">{data.title}</h1>
      <div className="flex flex-wrap gap-[3px] text-gray-800">
        <h2> {data.category},</h2>
        <h2>{data.subCategory.join(", ")}</h2>
      </div>
      <p className="text-gray-500 font-bold">${data.price}</p>
      <p className="text-sm text-gray-500">
        {data?.projectDescription?.slice(0, 100)}...
      </p>

      <div className="flex justify-between flex-wrap space-y-1">
        <div className="flex  items-center gap-2">
          <p className="text-base text-gray-500">
            Timeframe -{" "}
            {(() => {
              const start = data.expectedStartDate;
              const end = data.expectedEndDate;
              const diffMs = end.getTime() - start.getTime();
              const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
              if (diffDays >= 30) {
                const months = Math.floor(diffDays / 30);
                const days = diffDays % 30;
                return `${months} month${months > 1 ? "s" : ""}${
                  days ? ` ${days} day${days > 1 ? "s" : ""}` : ""
                }`;
              }
              return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
            })()}
          </p>
          <span className="text-gray-500 border border-gray-500 px-2 py-[1px] text-sm rounded-3xl">{data?.priorityLevel}</span>
        </div>
        <p className="text-gray-500">
          {(() => {
            const now = new Date();
            const created = data.createdAt;
            const diffMs = now.getTime() - created.getTime();
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays >= 365) {
              const years = Math.floor(diffDays / 365);
              const days = diffDays % 365;
              return `${years} year${years > 1 ? "s" : ""}${
                days ? ` ${days} day${days > 1 ? "s" : ""}` : ""
              } ago`;
            }
            if (diffDays >= 30) {
              const months = Math.floor(diffDays / 30);
              const days = diffDays % 30;
              return `${months} month${months > 1 ? "s" : ""}${
                days ? ` ${days} day${days > 1 ? "s" : ""}` : ""
              } ago`;
            }
            return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
          })()}
        </p>
      </div>
    </div>
  );
};

export default CommonServiceCard;
