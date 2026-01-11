import { ChatBot } from "./_components/chatbot";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <ChatBot />
    </div>
  );
}
