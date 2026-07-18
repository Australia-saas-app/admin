"use client";

import { useRef, useState } from "react";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import ProfileInfoGrid from "./ProfileInfoGrid";
import DocumentCards, { DocumentUploadButton } from "./DocumentCards";
import LevelProgressSection from "./LevelProgressSection";
import ProfileEditModal from "./ProfileEditModal";
import { addProfileDocument } from "@/src/shared/utils/profile-storage";
import { useProfileDisplay } from "../../hooks/use-profile-display";

export interface ProfileStat {
  label: string;
  value: string;
}

export interface RoleProfileCardProps {
  accountLabel?: string;
  stats?: ProfileStat[];
  levelProgress?: {
    completedLabel: string;
    fillPercent: number;
    milestones: string[];
    completedCount: number;
  };
  showDocumentButton?: boolean;
  showDocuments?: boolean;
}

export default function RoleProfileCard({
  stats,
  levelProgress,
  showDocumentButton = false,
  showDocuments = false,
}: RoleProfileCardProps) {
  const { userId, accountLabel, email, joiningDate, avatarUrl, fields, updateProfile } =
    useProfileDisplay();
  const [editOpen, setEditOpen] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col border-b border-gray-100 p-6 pb-6 md:p-8">
        <div className="mb-6 flex flex-col justify-between gap-6 lg:flex-row">
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-[3px] border-primary shadow-sm md:h-[85px] md:w-[85px]">
              <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-medium text-gray-800">{accountLabel}</h3>
                <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1">
                  <div className="h-2 w-2 rounded-full bg-[#10b981]" />
                  <span className="text-[11px] font-bold text-gray-800">Active</span>
                </div>
              </div>
              <div className="text-xs font-medium text-gray-500">
                Joining date — <span className="text-gray-400">{joiningDate}</span>
              </div>
              <div className="text-xs font-medium text-gray-500">{email}</div>
              {stats && stats.length > 0 && (
                <div className="mt-1 flex flex-wrap items-center gap-4 md:gap-6">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="flex items-center gap-4 md:gap-6">
                      {index > 0 && <div className="hidden h-8 w-px bg-gray-200 sm:block" />}
                      <div className="flex flex-col">
                        <span className="mb-0.5 text-[11px] font-medium text-gray-500">
                          {stat.label}
                        </span>
                        <span className="text-sm font-medium text-gray-800">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 rounded border border-[#10b981]/20 bg-[#ecfdf5] px-4 py-1.5 text-sm font-medium text-[#10b981]">
                <CheckCircle className="h-4 w-4" />
                Verified Account
              </div>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="rounded border border-gray-300 px-6 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Edit
              </button>
            </div>
            {showDocumentButton && (
              <>
                <input
                  ref={uploadRef}
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    addProfileDocument(userId, {
                      id: `doc-${Date.now()}`,
                      type: "UPLOADED",
                      name: file.name,
                      sizeLabel: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                      uploadedAt: new Date().toLocaleDateString(),
                      previewText: `Uploaded: ${file.name}`,
                    });
                    toast.success(`${file.name} uploaded successfully.`);
                    e.target.value = "";
                  }}
                />
                <DocumentUploadButton onClick={() => uploadRef.current?.click()} />
              </>
            )}
          </div>
        </div>
        {levelProgress && (
          <LevelProgressSection
            completedLabel={levelProgress.completedLabel}
            fillPercent={levelProgress.fillPercent}
            milestones={levelProgress.milestones}
            completedCount={levelProgress.completedCount}
          />
        )}
      </div>
      <ProfileInfoGrid fields={fields} />
      {showDocuments && (
        <DocumentCards
          userId={userId}
          onUpload={(doc) => {
            addProfileDocument(userId, doc);
            toast.success(`${doc.name} added to your documents.`);
          }}
        />
      )}
      <ProfileEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        scope="limited"
        initialLabel={accountLabel}
        initialEmail={email}
        onSave={(nextLabel, nextEmail) => {
          updateProfile({ accountLabel: nextLabel, email: nextEmail, fullName: nextLabel });
          toast.success("Profile updated successfully.");
        }}
      />
    </div>
  );
}
