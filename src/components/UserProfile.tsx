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
import { LogOut, Building, Copy, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

interface UserProfileProps {
  collapsed?: boolean;
}

export default function UserProfile({ collapsed = false }: UserProfileProps) {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

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

  const companyInfo = {
    name: "共宅一生股份有限公司",
    taxId: "52419147",
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "已複製！",
      description: `${text} 已複製到剪貼簿。`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative ${collapsed ? 'h-8 w-8' : 'h-10 w-full'} ${collapsed ? 'rounded-full' : 'rounded-lg justify-start'}`}>
          <Avatar className={`${collapsed ? 'h-8 w-8' : 'h-8 w-8'}`}>
            <AvatarImage
              src={currentUser.photoURL || undefined}
              alt={currentUser.displayName || "User"}
            />
            <AvatarFallback>
              {getInitials(currentUser.displayName)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3 flex-1 text-left">
              <p className="text-sm font-medium">{currentUser.displayName || "使用者"}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
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
        <DropdownMenuItem asChild>
          <Link to="/user-info">
            <User className="mr-2 h-4 w-4" />
            <span>個人資料</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center">
            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm">{companyInfo.name}</span>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground">
                  {companyInfo.taxId}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-6 w-6"
                  onClick={() => handleCopy(companyInfo.taxId)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>登出</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
