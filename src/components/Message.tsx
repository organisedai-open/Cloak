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
  isGrouped?: boolean;
}

export default function Message({ 
  id, 
  username, 
  content, 
  createdAt, 
  reported,
  onReport,
  isGrouped = false,
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
          <div className="flex items-start">
            <p className="text-[14px] leading-6 text-foreground whitespace-pre-wrap break-words overflow-wrap-anywhere break-all">
              {content}
            </p>
            {/* Hover actions */}
            <div className="ml-auto opacity-0 group-hover/message:opacity-100 transition-opacity duration-150 flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" title="Reply">
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