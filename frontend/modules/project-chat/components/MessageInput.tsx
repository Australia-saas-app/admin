import { IoIosSend } from "react-icons/io";

export const MessageInput = ({
  message,
  setMessage,
  onSend,
}: {
  message: string;
  setMessage: (value: string) => void;
  onSend: () => void;
}) => (
  <div className="relative mt-4 flex items-center justify-center gap-1 px-6 text-gray-700">
    <input
      type="text"
      placeholder="Send a Message"
      className="w-full rounded-lg bg-gray-100 px-4 py-2 text-sm focus:outline-none border border-gray-400"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSend()}
    />
    <IoIosSend
      className="text-meta-5 absolute right-10 top-1/2 -translate-y-1/2 transform cursor-pointer text-lg text-black"
      onClick={onSend}
    />
  </div>
);
