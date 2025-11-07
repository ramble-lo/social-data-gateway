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
  Monitor,
  Shield,
} from "lucide-react";
import RegistrantionHistoryArea from "@/components/RegistrantionHistoryArea";
import UploadArea from "@/components/UploadArea";
import RegistrantArea from "@/components/RegistrantArea";
import QuickLinkArea from "@/components/QuickLinkArea";
import StatusArea from "@/components/StatusArea";
import UserProfile from "@/components/UserProfile";
import TVWallArea from "@/components/TVWallArea";
import TOTPArea from "@/components/TOTPArea";
import { useAuth } from "@/hooks/useAuth";
import useUserInfo from "@/hooks/useUserInfo";

const HomePage = () => {
  const { currentUser, loading } = useAuth();
  const { userInfo } = useUserInfo();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const isAdmin = userInfo?.role === "admin";
  const isGuest = userInfo?.role === "guest";
  const [activeView, setActiveView] = useState(isAdmin ? "dashboard" : "links");

  const navigationItems = [
    {
      id: "dashboard",
      label: "儀表板",
      icon: Home,
      show: true,
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
      show: true,
    },
    {
      id: "registrants",
      label: "報名者清單",
      icon: UserCheck,
      show: true,
    },
    {
      id: "tvwall",
      label: "電視牆製作",
      icon: Monitor,
      show: isAdmin,
    },
    {
      id: "totp",
      label: "Google帳號驗證器",
      icon: Shield,
      show: userInfo?.team === "platform" || userInfo?.team === "admin",
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
      case "tvwall":
        return <TVWallArea value="tvwall" activeTab={activeView} />;
      case "totp":
        return <TOTPArea value="totp" activeTab={activeView} />;
      default:
        return <QuickLinkArea value="links" activeTab={activeView} />;
    }
  };

  return (
    <div
      className="flex bg-background"
      style={{
        position: "fixed",
        width: "100%",
        height: "100dvh", // Use dynamic viewport height for mobile browsers
        overflow: "hidden",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Sidebar Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          transition-all duration-300 border-r flex flex-col bg-background
          ${sidebarCollapsed ? "w-16 hidden lg:flex" : "w-full lg:w-80"} ${
          sidebarCollapsed
            ? "relative"
            : "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="w-full">
                <h1 className="font-semibold text-sm w-64">社區活動管理系統</h1>
                <p className="text-xs text-muted-foreground w-64">
                  興隆社宅2區
                </p>
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
                className={`w-full  ${
                  sidebarCollapsed
                    ? "px-2 justify-center"
                    : "px-3 justify-start"
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
      <div
        className="flex-1 flex flex-col"
        style={{ height: "100%", overflow: "hidden" }}
      >
        {/* Header */}
        <header
          className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30"
          style={{
            position: "sticky",
            top: 0,
            minHeight: "fit-content",
            flexShrink: 0,
          }}
        >
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
        <main
          className="flex-1 p-6"
          style={{
            paddingBottom: "1.5rem",
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            position: "relative",
            minHeight: 0, // Allow flex item to shrink
          }}
        >
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
