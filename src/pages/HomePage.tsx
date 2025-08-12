import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Users,
  Link,
  UserCheck,
  Activity,
  Menu,
  Home,
  Settings,
} from "lucide-react";
import RegistrantionHistoryArea from "@/components/RegistrantionHistoryArea";
import UploadArea from "@/components/UploadArea";
import RegistrantArea from "@/components/RegistrantArea";
import QuickLinkArea from "@/components/QuickLinkArea";
import StatusArea from "@/components/StatusArea";
import UserProfile from "@/components/UserProfile";
import { useAuth } from "@/hooks/useAuth";
import useUserInfo from "@/hooks/useUserInfo";

const HomePage = () => {
  const { currentUser, loading } = useAuth();
  const { userInfo } = useUserInfo();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isAdmin = userInfo?.role === "admin";
  const isGuest = userInfo?.role === "guest";
  const [activeView, setActiveView] = useState(isAdmin ? "dashboard" : "links");

  const navigationItems = [
    {
      id: "dashboard",
      label: "儀表板",
      icon: Home,
      show: isAdmin,
    },
    {
      id: "links",
      label: "快速連結",
      icon: Link,
      show: true,
    },
    {
      id: "upload",
      label: "資料上傳",
      icon: Upload,
      show: isAdmin,
    },
    {
      id: "data",
      label: "報名資料",
      icon: Users,
      show: !isGuest,
    },
    {
      id: "registrants",
      label: "報名者清單",
      icon: UserCheck,
      show: !isGuest,
    },
  ].filter((item) => item.show);

  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return <StatusArea value="status" activeTab={activeView} />;
      case "links":
        return <QuickLinkArea value="links" activeTab={activeView} />;
      case "upload":
        return <UploadArea value="upload" activeTab={activeView} />;
      case "data":
        return <RegistrantionHistoryArea value="data" activeTab={activeView} />;
      case "registrants":
        return <RegistrantArea value="registrants" activeTab={activeView} />;
      default:
        return <QuickLinkArea value="links" activeTab={activeView} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed 
            ? "w-16 hidden lg:flex" 
            : "w-full lg:w-80"
        } transition-all duration-300 border-r flex flex-col bg-background ${
          sidebarCollapsed 
            ? "relative" 
            : "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h1 className="font-semibold text-sm">社區活動管理系統</h1>
                <p className="text-xs text-muted-foreground">興隆社宅2區</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 hover:bg-accent"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeView === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  sidebarCollapsed ? "px-2" : "px-3"
                } h-9`}
                onClick={() => {
                  setActiveView(item.id);
                  // Auto-close sidebar on mobile after selection
                  if (window.innerWidth < 1024) {
                    setSidebarCollapsed(true);
                  }
                }}
              >
                <item.icon className="h-4 w-4" />
                {!sidebarCollapsed && (
                  <span className="ml-2 text-sm">{item.label}</span>
                )}
              </Button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t">
          <UserProfile collapsed={sidebarCollapsed} />
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${
        !sidebarCollapsed ? "lg:ml-0" : ""
      }`}>
        {/* Header */}
        <header className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(false)}
                className="h-8 w-8 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold">
                  {navigationItems.find((item) => item.id === activeView)
                    ?.label || "儀表板"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  管理社區活動報名與資料
                </p>
              </div>
            </div>
            {/* <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div> */}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">{renderMainContent()}</main>
      </div>
    </div>
  );
};

export default HomePage;
