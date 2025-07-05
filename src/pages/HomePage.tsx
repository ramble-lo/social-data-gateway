import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Users, Link, UserCheck } from "lucide-react";
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

        <Tabs defaultValue={isAdmin ? "upload" : "data"} className="space-y-6">
          <TabsList
            className={`grid w-full ${isAdmin ? "grid-cols-4" : "grid-cols-3"}`}
          >
            {isAdmin ? (
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                資料上傳
              </TabsTrigger>
            ) : null}
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              報名資料
            </TabsTrigger>
            <TabsTrigger
              value="registrants"
              className="flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              報名者清單
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              快速連結
            </TabsTrigger>
          </TabsList>

          {/* 資料上傳區域 */}
          {isAdmin ? <UploadArea value="upload" /> : null}
          {/* 資料顯示區域 */}
          <RegistrantionHistoryArea value="data" />
          {/* 新增報名者清單區域 */}
          <RegistrantArea value="registrants" />

          {/* 快速連結區域 */}
          <QuickLinkArea value="links" />
        </Tabs>

        {/* 狀態監控區域 */}
        <StatusArea />
      </div>
    </div>
  );
};

export default HomePage;
