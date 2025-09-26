import { useEffect, useRef, useState } from "react";
import { Hash, Heart, MessageCircle, Utensils, GraduationCap, Monitor, Building, Users, Globe } from "lucide-react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { db } from "@/integrations/firebase/client";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  getDocs,
    Timestamp,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  username: string;
  content: string;
  created_at: string;
  reported: boolean;
}

interface ChatAreaProps {
  channel: string;
  username: string;
  sessionId: string;
}

const channelIcons = {
  // Original channels
  general: <Globe className="w-5 h-5" />,
  confessions: <MessageCircle className="w-5 h-5" />,
  support: <Heart className="w-5 h-5" />,
  // Food outlets
  subspot: <Utensils className="w-5 h-5" />,
  fk: <Utensils className="w-5 h-5" />,
  ins: <Utensils className="w-5 h-5" />,
  gajalaxmi: <Utensils className="w-5 h-5" />,
  foodtruck: <Utensils className="w-5 h-5" />,
  // Lecture halls
  lt1: <GraduationCap className="w-5 h-5" />,
  lt2: <GraduationCap className="w-5 h-5" />,
  lt3: <GraduationCap className="w-5 h-5" />,
  lt4: <GraduationCap className="w-5 h-5" />,
  // Digital lecture halls
  dlt1: <Monitor className="w-5 h-5" />,
  dlt2: <Monitor className="w-5 h-5" />,
  dlt3: <Monitor className="w-5 h-5" />,
  dlt4: <Monitor className="w-5 h-5" />,
  dlt5: <Monitor className="w-5 h-5" />,
  dlt6: <Monitor className="w-5 h-5" />,
  dlt7: <Monitor className="w-5 h-5" />,
  dlt8: <Monitor className="w-5 h-5" />,
  // Campus facilities
  library: <Building className="w-5 h-5" />,
  auditorium: <Building className="w-5 h-5" />,
  sac: <Building className="w-5 h-5" />,
  gym: <Building className="w-5 h-5" />,
  // Mess
  amess: <Users className="w-5 h-5" />,
  cmess: <Users className="w-5 h-5" />,
  dmess: <Users className="w-5 h-5" />,
};

const channelDescriptions = {
  // Original channels
  general: "Campus-wide conversations",
  confessions: "Share your secrets anonymously",
  support: "A safe space for emotional support",
  // Food outlets
  subspot: "Subspot discussions",
  fk: "FK food court",
  ins: "INS canteen",
  gajalaxmi: "Gajalaxmi restaurant",
  foodtruck: "Food truck area",
  // Lecture halls
  lt1: "Lecture Theatre 1",
  lt2: "Lecture Theatre 2",
  lt3: "Lecture Theatre 3",
  lt4: "Lecture Theatre 4",
  // Digital lecture halls
  dlt1: "Digital Lecture Theatre 1",
  dlt2: "Digital Lecture Theatre 2",
  dlt3: "Digital Lecture Theatre 3",
  dlt4: "Digital Lecture Theatre 4",
  dlt5: "Digital Lecture Theatre 5",
  dlt6: "Digital Lecture Theatre 6",
  dlt7: "Digital Lecture Theatre 7",
  dlt8: "Digital Lecture Theatre 8",
  // Campus facilities
  library: "Library discussions",
  auditorium: "Auditorium events",
  sac: "Student Activity Center",
  gym: "Gymnasium discussions",
  // Mess
  amess: "A Mess discussions",
  cmess: "C Mess discussions",
  dmess: "D Mess discussions",
};

export default function ChatArea({ channel, username, sessionId }: ChatAreaProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Use a query that avoids composite index requirements: filter by channel only
    const q = query(
      collection(db, 'messages'),
      where('channel', '==', channel)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const now = Date.now();
        const items: ChatMessage[] = snapshot.docs
          .map((d) => {
            const data = d.data() as any;
            const created = data.created_at?.toDate
              ? data.created_at.toDate().toISOString()
              : (typeof data.created_at === 'string' ? data.created_at : new Date().toISOString());
            const expireAtMs = data.expire_at?.toDate ? data.expire_at.toDate().getTime() : undefined;
            return {
              id: d.id,
              username: data.username,
              content: data.content,
              created_at: created,
              reported: Boolean(data.reported),
              // pass through, we'll filter below
            } as ChatMessage & { expireAtMs?: number };
          })
          .filter((m: any) => (m.expireAtMs ? m.expireAtMs > now : true))
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setMessages(items);
        scrollToBottom();
      },
      (error) => {
        console.error('Realtime subscription error:', error);
      }
    );

    return () => unsubscribe();
  }, [channel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const q = query(
        collection(db, 'messages'),
        where('channel', '==', channel)
      );
      const snap = await getDocs(q);
      const now = Date.now();
      const items: ChatMessage[] = snap.docs
        .map((d) => {
          const data = d.data() as any;
          const created = data.created_at?.toDate
            ? data.created_at.toDate().toISOString()
            : (typeof data.created_at === 'string' ? data.created_at : new Date().toISOString());
          const expireAtMs = data.expire_at?.toDate ? data.expire_at.toDate().getTime() : undefined;
          return {
            id: d.id,
            username: data.username,
            content: data.content,
            created_at: created,
            reported: Boolean(data.reported),
          } as ChatMessage & { expireAtMs?: number };
        })
        .filter((m: any) => (m.expireAtMs ? m.expireAtMs > now : true))
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      setMessages(items);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    
    try {
      const expireAt = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
      await addDoc(collection(db, 'messages'), {
        channel,
        username,
        content,
        created_at: serverTimestamp(),
        expire_at: expireAt,
        reported: false,
        report_count: 0,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const reportMessage = async (messageId: string) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        report_count: increment(1),
      });
      // After increment, optimistically set reported=true if >=2
      // Firestore rule: UI will re-render via onSnapshot, but we can also set it here
      await updateDoc(messageRef, { reported: true });
      toast({
        title: "Message reported",
        description: "Thank you for helping keep our community safe.",
      });
    } catch (error) {
      console.error('Error reporting message:', error);
      toast({
        title: "Failed to report message",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="flex-1 flex flex-col h-screen h-dvh bg-[#2f3136] overflow-hidden">
      {/* Slim channel header */}
      <div className="px-4 py-2 border-b border-[#202225] bg-[#2f3136] relative z-40 flex-shrink-0">
        <div className="flex items-baseline justify-between">
          <div className="flex items-center">
            <button 
              className="lg:hidden mr-3 text-[#b9bbbe] hover:text-[#dcddde]"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div>
              <div className="text-[15px] font-semibold text-[#dcddde] flex items-center">
                {channelIcons[channel as keyof typeof channelIcons] || <Hash className="w-5 h-5" />}
                <span className="ml-2"># {channel.toUpperCase()}</span>
              </div>
              <div className="text-[12px] text-[#b9bbbe]">
                {channelDescriptions[channel as keyof typeof channelDescriptions] || "Channel discussion"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 min-h-0">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-[#b9bbbe] mb-2">No messages yet</p>
              <p className="text-sm text-[#b9bbbe]">
                Be the first to share something!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, idx) => {
            const prev = messages[idx - 1];
            const isGrouped = prev && prev.username === message.username && (new Date(message.created_at).getTime() - new Date(prev.created_at).getTime()) < 3 * 60 * 1000;
            return (
              <Message
                key={message.id}
                id={message.id}
                username={message.username}
                content={message.content}
                createdAt={message.created_at}
                reported={message.reported}
                onReport={reportMessage}
                isGrouped={Boolean(isGrouped)}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={sendMessage} isLoading={isLoading} channel={channel} />
    </div>
  );
}