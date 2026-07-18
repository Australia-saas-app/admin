"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, ChevronDown, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { PublicPageShell } from "@/src/modules/shared/components/public/PublicPageShell";
import { Button } from "@/src/components/ui/button";

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export default function CreateCourseForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [whatYouLearn, setWhatYouLearn] = useState("");
  const [description, setDescription] = useState("");

  // Scheduling State
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [startHour, setStartHour] = useState("9");
  const [startMinute, setStartMinute] = useState("00");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endHour, setEndHour] = useState("5");
  const [endMinute, setEndMinute] = useState("00");
  const [endPeriod, setEndPeriod] = useState("PM");

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { day: "Monday", startTime: "09:00 AM", endTime: "05:00 PM" },
    { day: "Tuesday", startTime: "09:00 AM", endTime: "05:00 PM" },
    { day: "Wednesday", startTime: "09:00 AM", endTime: "05:00 PM" },
  ]);

  // Sidebar Metadata States
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("200");
  const [discount, setDiscount] = useState("0.00");
  const [totalStudents, setTotalStudents] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner / Advanced");
  const [language, setLanguage] = useState("English / Hindi");
  const [module, setModule] = useState("");
  const [publicistDate, setPublicistDate] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [certificate, setCertificate] = useState("Yes");
  const [assessments, setAssessments] = useState("Yes");

  const handleAddTimeSlot = () => {
    const newSlot: TimeSlot = {
      day: selectedDay,
      startTime: `${startHour.padStart(2, "0")}:${startMinute} ${startPeriod}`,
      endTime: `${endHour.padStart(2, "0")}:${endMinute} ${endPeriod}`,
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "MM / DD / YYYY";
    const d = new Date(dateStr);
    return `${String(d.getMonth() + 1).padStart(2, "0")} / ${String(d.getDate()).padStart(2, "0")} / ${d.getFullYear()}`;
  };

  const handleSubmit = async () => {
    if (!courseTitle.trim()) {
      toast.error("Please enter a course title.");
      return;
    }
    if (!category) {
      toast.error("Please select a course category.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("Course submitted for review.");
    router.push("/courses");
  };

  return (
    <PublicPageShell
      title="Create a course"
      subtitle="Publish a new course listing with schedule, pricing, and enrollment details."
      badge="Courses"
      breadcrumbs={[
        { label: "Courses", href: "/courses" },
        { label: "Business dashboard", href: "/business/dashboard" },
        { label: "Create" },
      ]}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-8">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-primary hover:bg-primary/90 px-8"
          >
            {submitting ? "Submitting..." : "Submit course"}
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT AREA: Course Main Info */}
          <div className="flex-1 space-y-6">
            {/* Course Title Input */}
            <div>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Course Title"
                className="w-full border border-border rounded-md p-4 text-[15px] focus:outline-none focus:border-primary transition-colors placeholder-gray-500"
              />
            </div>

            {/* Image Upload Area */}
            <div className="border border-border rounded-md p-10 flex flex-col items-center justify-center relative cursor-pointer hover:bg-muted/60 transition-colors h-[180px]">
              <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground/80">
                <X className="w-5 h-5" />
              </button>
              <ImageIcon className="w-12 h-12 text-[#7c86a0] mb-3 stroke-[1.5]" />
              <p className="text-muted-foreground text-[13px] font-medium text-center">
                Upload A Pic, you can drag and drop or attach
              </p>
            </div>

            {/* Learning Goals Textarea */}
            <div>
              <label className="block text-[17px] font-semibold text-black mb-3">
                What You Will Learn In The Course
              </label>
              <textarea
                value={whatYouLearn}
                onChange={(e) => setWhatYouLearn(e.target.value)}
                className="w-full border border-border rounded-[14px] p-6 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none text-[#555] text-[13px] h-36 leading-relaxed"
                placeholder="List the key skills and outcomes students will gain..."
              />
            </div>

            {/* Course Description Textarea */}
            <div>
              <label className="block text-[17px] font-semibold text-black mb-3">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-border rounded-[14px] p-6 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none text-[#555] text-[13px] h-36 leading-relaxed"
                placeholder="List the key skills and outcomes students will gain..."
              />
            </div>

            {/* Scheduling Section */}
            <div>
              <div className="flex flex-wrap items-end gap-5">
                {/* Days */}
                <div>
                  <label className="block text-[16px] font-semibold text-black mb-3">Days</label>
                  <div className="relative w-[130px]">
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="w-full appearance-none border border-border rounded-md py-[10px] px-3 bg-card text-black text-[13px] font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-700 pointer-events-none" />
                  </div>
                </div>

                {/* Time Selectors */}
                <div className="flex-1">
                  <label className="block text-[16px] font-semibold text-black mb-3">Time</label>
                  <div className="flex items-center gap-3">
                    {/* Start Time dropdowns */}
                    <div className="relative w-[70px]">
                      <select
                        value={startHour}
                        onChange={(e) => setStartHour(e.target.value)}
                        className="w-full appearance-none bg-[#ececec] rounded-md py-[10px] px-3 text-[13px] text-black font-medium focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-black pointer-events-none stroke-[2.5]" />
                    </div>
                    <div className="relative w-[70px]">
                      <select
                        value={startMinute}
                        onChange={(e) => setStartMinute(e.target.value)}
                        className="w-full appearance-none bg-[#ececec] rounded-md py-[10px] px-3 text-[13px] text-black font-medium focus:outline-none cursor-pointer"
                      >
                        {["00", "15", "30", "45"].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-black pointer-events-none stroke-[2.5]" />
                    </div>
                    <div className="relative w-[70px]">
                      <select
                        value={startPeriod}
                        onChange={(e) => setStartPeriod(e.target.value)}
                        className="w-full appearance-none bg-[#ececec] rounded-md py-[10px] px-3 text-[13px] text-black font-medium focus:outline-none cursor-pointer"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-black pointer-events-none stroke-[2.5]" />
                    </div>

                    <span className="text-[11px] font-semibold text-[#888] px-1">To</span>

                    {/* End Time dropdowns */}
                    <div className="relative w-[70px]">
                      <select
                        value={endHour}
                        onChange={(e) => setEndHour(e.target.value)}
                        className="w-full appearance-none bg-[#ececec] rounded-md py-[10px] px-3 text-[13px] text-black font-medium focus:outline-none cursor-pointer"
                      >
                        {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-black pointer-events-none stroke-[2.5]" />
                    </div>
                    <div className="relative w-[70px]">
                      <select
                        value={endMinute}
                        onChange={(e) => setEndMinute(e.target.value)}
                        className="w-full appearance-none bg-[#ececec] rounded-md py-[10px] px-3 text-[13px] text-black font-medium focus:outline-none cursor-pointer"
                      >
                        {["00", "15", "30", "45"].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-black pointer-events-none stroke-[2.5]" />
                    </div>
                    <div className="relative w-[70px]">
                      <select
                        value={endPeriod}
                        onChange={(e) => setEndPeriod(e.target.value)}
                        className="w-full appearance-none bg-[#ececec] rounded-md py-[10px] px-3 text-[13px] text-black font-medium focus:outline-none cursor-pointer"
                      >
                        <option value="PM">PM</option>
                        <option value="AM">AM</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-black pointer-events-none stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddTimeSlot}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-[10px] rounded-md font-medium text-[15px] transition-colors mb-[1px]"
                >
                  Add
                </button>
              </div>

              {/* Added Slots List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-8">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-[12px] font-bold text-black tracking-tight">
                      {slot.day} / {slot.startTime} - {slot.endTime}
                    </span>
                    <button
                      onClick={() => handleRemoveTimeSlot(index)}
                      className="text-red-500 hover:text-red-700 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 stroke-[2]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT AREA: Sidebar Form Fields */}
          <div className="w-full lg:w-[320px]">
            <div className="border border-border rounded-[14px] p-5 space-y-3.5 shadow-sm">
              {/* Course Category */}
              <div className="border border-border rounded-md px-4 py-[11px] flex justify-between items-center bg-card relative">
                <span className="text-muted-foreground text-[14px] pointer-events-none">
                  {category || "Course Category"}
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                  <option value="IT & Software">IT & Software</option>
                  <option value="Languages">Languages</option>
                </select>
                <ChevronDown className="w-[18px] h-[18px] text-foreground stroke-[1.5] pointer-events-none" />
              </div>

              {/* Course Price (Floating Label-like style) */}
              <div className="border border-border rounded-md px-4 py-2 relative mt-5 bg-card">
                <span className="absolute -top-[10px] left-3 bg-card px-1 text-[13px] text-muted-foreground pointer-events-none">
                  Course Price
                </span>
                <div className="flex items-center justify-between text-[13px] font-medium text-black mt-[2px]">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full outline-none bg-transparent"
                  />
                  <span className="pointer-events-none">$</span>
                </div>
              </div>

              {/* Course Discount */}
              <div className="border border-border rounded-md px-4 py-[11px] flex justify-between items-center bg-card mt-4 relative">
                <span className="text-muted-foreground text-[14px] pointer-events-none">
                  Course Discount
                </span>
                <div className="flex items-center text-black font-bold text-[10px]">
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-16 text-right outline-none bg-transparent mr-1"
                  />
                  <span>$</span>
                </div>
              </div>

              {/* Total students */}
              <div className="border border-border rounded-md px-4 py-[11px] bg-card flex justify-between items-center relative">
                <span className="text-muted-foreground text-[14px] pointer-events-none">
                  Total students
                </span>
                <input
                  type="number"
                  value={totalStudents}
                  onChange={(e) => setTotalStudents(e.target.value)}
                  placeholder="0"
                  className="w-16 text-right text-[12px] font-bold text-black outline-none bg-transparent"
                />
              </div>

              {/* Skill Levels */}
              <div className="border border-border rounded-md px-4 py-1 flex justify-between items-center bg-card relative">
                <span className="text-muted-foreground text-[14px] pointer-events-none">
                  Skill Levels
                </span>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="Beginner / Advanced">Beginner / Advanced</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
                <div className="flex items-center gap-3 pointer-events-none">
                  {skillLevel === "Beginner / Advanced" ? (
                    <div className="flex flex-col text-[7px] leading-[1.1] text-center text-black font-bold">
                      <span>Beginner</span>
                      <span>Advanced</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-black">{skillLevel}</span>
                  )}
                  <ChevronDown className="w-[18px] h-[18px] text-foreground stroke-[1.5]" />
                </div>
              </div>

              {/* Course language */}
              <div className="border border-border rounded-md px-4 py-1 flex justify-between items-center bg-card relative">
                <span className="text-muted-foreground text-[14px] pointer-events-none">
                  Course language
                </span>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="English / Hindi">English / Hindi</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Japanese">Japanese</option>
                </select>
                <div className="flex items-center gap-3 pointer-events-none">
                  {language === "English / Hindi" ? (
                    <div className="flex flex-col text-[7px] leading-[1.1] text-center text-black font-bold">
                      <span>English</span>
                      <span>Hindi</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-black">{language}</span>
                  )}
                  <ChevronDown className="w-[18px] h-[18px] text-foreground stroke-[1.5]" />
                </div>
              </div>

              {/* Module */}
              <div className="border border-border rounded-md px-4 py-[11px] bg-card flex justify-between items-center relative">
                <span className="text-muted-foreground text-[14px] pointer-events-none">
                  Module
                </span>
                <input
                  type="text"
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-16 text-right text-[12px] font-bold text-black outline-none bg-transparent"
                />
              </div>

              {/* Course publicist date */}
              <div className="border border-border rounded-md px-4 py-[11px] flex justify-between items-center bg-card relative">
                <span className="text-muted-foreground text-[14px] pointer-events-none">
                  Course publicist date
                </span>
                <input
                  type="date"
                  value={publicistDate}
                  onChange={(e) => setPublicistDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 pointer-events-none">
                  <span className="text-[10px] text-black font-bold">
                    {formatDate(publicistDate)}
                  </span>
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground stroke-[1.5]" />
                </div>
              </div>

              {/* Application Last Date */}
              <div className="border border-border rounded-md px-4 py-[11px] flex justify-between items-center bg-card relative">
                <span className="text-muted-foreground text-[14px] pointer-events-none">
                  Application Last Date
                </span>
                <input
                  type="date"
                  value={lastDate}
                  onChange={(e) => setLastDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 pointer-events-none">
                  <span className="text-[10px] text-black font-bold">{formatDate(lastDate)}</span>
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground stroke-[1.5]" />
                </div>
              </div>

              {/* Class start day */}
              <div className="border border-border rounded-md px-4 py-[11px] flex justify-between items-center bg-card relative">
                <span className="text-muted-foreground text-[14px] pointer-events-none">
                  Class start day
                </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 pointer-events-none">
                  <span className="text-[10px] text-black font-bold">{formatDate(startDate)}</span>
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground stroke-[1.5]" />
                </div>
              </div>

              {/* Course End Date */}
              <div className="border border-border rounded-md px-4 py-[11px] flex justify-between items-center bg-card relative">
                <span className="text-muted-foreground text-[14px] pointer-events-none">
                  Course End Date
                </span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center gap-1.5 pointer-events-none">
                  <span className="text-[10px] text-black font-bold">{formatDate(endDate)}</span>
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground stroke-[1.5]" />
                </div>
              </div>

              {/* Certificate */}
              <div className="border border-border rounded-md px-4 py-[14px] flex justify-between items-center relative bg-card">
                <span className="text-[15px] font-medium text-foreground pointer-events-none">
                  Certificate
                </span>
                <select
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <div className="flex items-center gap-3 pointer-events-none">
                  <span className="text-[9px] font-bold text-black">{certificate}</span>
                  <ChevronDown className="w-4 h-4 text-black stroke-[3]" />
                </div>
              </div>

              {/* Assessments */}
              <div className="border border-border rounded-md px-4 py-[14px] flex justify-between items-center relative bg-card">
                <span className="text-[15px] font-medium text-foreground pointer-events-none">
                  Assessments
                </span>
                <select
                  value={assessments}
                  onChange={(e) => setAssessments(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <div className="flex items-center gap-3 pointer-events-none">
                  <span className="text-[9px] font-bold text-black">{assessments}</span>
                  <ChevronDown className="w-4 h-4 text-black stroke-[3]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
}
