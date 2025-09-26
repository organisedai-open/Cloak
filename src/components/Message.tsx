import { format } from "date-fns";
import { AlertTriangle, MoreHorizontal, CornerUpLeft, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MessageProps {
  id: string;
  username: string;
  content: string;
  createdAt: string;
  reported?: boolean;
  onReport: (messageId: string) => void;
  onReply?: (messageId: string, content: string, username: string) => void;
  onScrollToOriginal?: (messageId: string) => void;
  isGrouped?: boolean;
  replyToMessageId?: string;
  replyToContent?: string;
  replyToUsername?: string;
}

export default function Message({ 
  id, 
  username, 
  content, 
  createdAt, 
  reported,
  onReport,
  onReply,
  onScrollToOriginal,
  isGrouped = false,
  replyToMessageId,
  replyToContent,
  replyToUsername,
}: MessageProps) {
  const timeText = format(new Date(createdAt), "hh:mm a");

  return (
    <div className={cn("group/message px-2", reported && "opacity-50")}>
      <div className={cn("flex gap-3", isGrouped ? "mt-1" : "mt-4")}> 
        {/* Avatar */}
        <div className={cn("flex-shrink-0", isGrouped ? "invisible" : "visible")}> 
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {!isGrouped && (
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-foreground">{username}</span>
              <span className="text-[11px] text-muted-foreground">{timeText}</span>
            </div>
          )}
          
          {/* Reply preview - above message body */}
          {replyToMessageId && replyToContent && (
            <div className="w-full mb-2">
              <div 
                className="bg-[#1F1C09] border-l-3 border-[#44BBA4] rounded-r-lg p-2 hover:bg-[#2A2A24] transition-colors cursor-pointer group"
                onClick={() => onScrollToOriginal?.(replyToMessageId)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-[#A0A0A0]">{replyToUsername || 'Anonymous'}</span>
                  <span className="text-xs text-[#A0A0A0]">•</span>
                  <span className="text-xs text-[#A0A0A0]">Replying to</span>
                </div>
                <p className="text-sm text-[#EDEDED] line-clamp-1 sm:line-clamp-2 group-hover:line-clamp-none transition-all">
                  {replyToContent.length > 80 ? replyToContent.substring(0, 80) + "..." : replyToContent}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-start">
            <p className="text-[14px] leading-6 text-foreground whitespace-pre-wrap break-words overflow-wrap-anywhere break-all">
              {content}
            </p>
            {/* Hover actions */}
            <div className="ml-auto opacity-0 group-hover/message:opacity-100 transition-opacity duration-150 flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-muted-foreground hover:text-foreground" 
                title="Reply"
                onClick={() => onReply?.(id, content, username)}
              >
                <CornerUpLeft className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onReport(id)} className="text-destructive focus:text-destructive">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report Message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {reported && (
            <div className="mt-1 text-[11px] text-destructive flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              This message has been reported
            </div>
          )}
        </div>
      </div>
    </div>
  );
}