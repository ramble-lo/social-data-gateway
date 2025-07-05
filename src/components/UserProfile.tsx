import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Mail } from "lucide-react";

export default function UserProfile() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("登出失敗:", error);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={currentUser.photoURL || undefined}
              alt={currentUser.displayName || "User"}
            />
            <AvatarFallback>
              {getInitials(currentUser.displayName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {currentUser.displayName || "使用者"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem disabled>
          <User className="mr-2 h-4 w-4" />
          <span>個人資料</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Mail className="mr-2 h-4 w-4" />
          <span>電子郵件</span>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
