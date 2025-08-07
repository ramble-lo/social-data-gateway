import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Users, Link, UserCheck, Activity } from "lucide-react";
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

  const isAdmin = userInfo?.role === "admin";
  const isGuest = userInfo?.role === "guest";
  const [activeTab, setActiveTab] = useState(isAdmin ? "status" : "links");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 標題區域 */}
        <div className="flex justify-between items-center py-6">
          <div className="text-center space-y-2 flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              社區活動管理系統
            </h1>
            <p className="text-lg text-gray-600">
              興隆社宅2區 - 活動報名與資料管理平台
            </p>
          </div>
          <UserProfile />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-10"
        >
          <TabsList className={`flex flex-wrap w-full`}>
            <TabsTrigger value="links" className="flex-1 items-center gap-2">
              <Link className="w-4 h-4" />
              快速連結
            </TabsTrigger>
            {isAdmin ? (
              <TabsTrigger value="upload" className="flex-1 items-center gap-2">
                <Upload className="w-4 h-4" />
                資料上傳
              </TabsTrigger>
            ) : null}
            {isAdmin ? (
              <TabsTrigger value="status" className="flex-1 items-center gap-2">
                <Activity className="w-4 h-4" />
                狀態數據
              </TabsTrigger>
            ) : null}
            {!isGuest ? (
              <TabsTrigger value="data" className="flex-1 items-center gap-2">
                <Users className="w-4 h-4" />
                報名資料
              </TabsTrigger>
            ) : null}
            {!isGuest ? (
              <TabsTrigger
                value="registrants"
                className="flex-1 items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                報名者清單
              </TabsTrigger>
            ) : null}
          </TabsList>
          {/* 快速連結區域 */}
          <QuickLinkArea value="links" activeTab={activeTab} />
          {/* 資料上傳區域 */}
          {isAdmin ? <UploadArea value="upload" activeTab={activeTab} /> : null}
          {/* 狀態監控區域 */}
          {isAdmin ? <StatusArea value="status" activeTab={activeTab} /> : null}
          {/* 資料顯示區域 */}
          {!isGuest ? (
            <RegistrantionHistoryArea value="data" activeTab={activeTab} />
          ) : null}
          {/* 新增報名者清單區域 */}
          {!isGuest ? (
            <RegistrantArea value="registrants" activeTab={activeTab} />
          ) : null}
        </Tabs>
      </div>
    </div>
  );
};

export default HomePage;
