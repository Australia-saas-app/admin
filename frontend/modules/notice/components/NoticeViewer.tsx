"use client";

interface Props {
  content: string;
  title: string;
  onClose: () => void;
}

export default function NoticeViewer({ content, title, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-card w-[90%] md:w-[80%] lg:w-[70%] max-h-[90%] overflow-auto rounded shadow-lg">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="px-3 py-1 rounded bg-muted hover:bg-muted text-sm">
            Close
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    </div>
  );
}
