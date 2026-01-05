import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderOpen, ExternalLink, HardDrive } from "lucide-react";
import useUserInfo from "@/hooks/useUserInfo";

interface CloudDriveAreaProps {
  value: string;
  activeTab: string;
}

const FOLDER_DATA = [
  { name: "XL01", folderId: "18RLjZZIx__zz5QnMuaVo7ZSlIISKPXwv" },
  { name: "XL02", folderId: "1Sp0pAac5iKWc6Pc5q3yeghTlUIW2n9wk" },
  { name: "XL03", folderId: "1-nYBcStWaD0UrjZpYr1ja999tXflAPKw" },
  { name: "XL04", folderId: "1YJyJHUzQPCE0WckC4DpgdrjYUmqnzoiQ" },
  { name: "XL05", folderId: "1-Z6Slfa9vDW_JozyP0C1BXz4ZChRsAvW" },
  { name: "XL06", folderId: "1ym6_omuybtIRWb9od9PZhR6DHI2mgAB5" },
  { name: "XL07", folderId: "1wXeu25jvOxgbWVlEqqPN-rjxwB5mjo5E" },
  { name: "XL08", folderId: "17OE3q4ZjNPU9kCRQx--J5oZmjKAI-PXA" },
  { name: "XL09", folderId: "1MTHBkWzWjNZh13_5ILmyWjqwCadgSRZk" },
  { name: "XL10", folderId: "1ce1bZafUQcLROmRcEZ0g6k66d23s_yUH" },
  { name: "XL11", folderId: "16FE6rRIhXKWGyY15TX03GX5mPP3I5gtS" },
  { name: "XL12", folderId: "18CJ3GstnTgKq7aZsoapIUuju8klR2RPe" },
  { name: "XL13", folderId: "1vCpE1NAn5AkVQpi3HZDw3_m1MbZE82V5" },
  { name: "XL14", folderId: "1o6yIvlOriAjz523or1vzvLiqKSYhKPzO" },
  { name: "XL15", folderId: "1YW16dQhFQ5fehbCwxdOpV2i5kf94fKwu" },
  { name: "XL16", folderId: "1ZepIYQjIcE9n0qfscGXC0_iy2yzKk2ug" },
  { name: "XL17", folderId: "1PVLd35e0r2nzXeIK7BYAPDSLdxvYcLW4" },
  { name: "XL18", folderId: "1CY-6iyU5Z8jBlWf5Bxr8HtJVAQMoDlHs" },
  { name: "XL19", folderId: "1pucujWYWMydvM6nh6rbK32SRn3ypBsi3" },
  { name: "XL20", folderId: "1JJSW5j3gl0wvJOBspKnwSs5317e7sOet" },
  { name: "XL21", folderId: "1IC2jOFv8WhuzeEwwNNU7Asp7cjSpCQ2u" },
  { name: "XL22", folderId: "1QyJkW9_DG9b3wDuWF42wPk4XjqH3auAU" },
  { name: "XL23", folderId: "1H1UDd8uPljQQ6WhDix2l6QUsAtvRfuuG" },
  { name: "XL24", folderId: "1gXgOXAsZHH4dXms3pY838yu3hAhiZ-zR" },
  { name: "XL25", folderId: "1LrZ-23R-CxbwjcRyTgBt7kgXPLph3Mx6" },
  { name: "XL26", folderId: "1gGG7x9yjQpZ8lRxjJ3FFXgjBWQDqf1Km" },
  { name: "XL27", folderId: "1ht__opthXd2PxMpkiydQZxvsAkv1m-2P" },
  { name: "XL28", folderId: "19q0RSDA_mYZuvLZVpyOCgZc4_zSsywEF" },
  { name: "XL29", folderId: "1Djj2jJ8JLSAPL-0MTC2xHdEbNXHiqOi1" },
  { name: "XL30", folderId: "1lYztDXi-njrbgSMLYNLwrq7BOXq0Am5G" },
];

const CloudDriveArea: React.FC<CloudDriveAreaProps> = () => {
  const { userInfo } = useUserInfo();

  const handleOpenFolder = (folderId: string) => {
    window.open(`https://drive.google.com/drive/folders/${folderId}`, "_blank");
  };

  const isAdmin = userInfo?.role === "admin";
  const userCommunityCode = userInfo?.community_code;

  const filteredFolders = FOLDER_DATA.filter((folder) => {
    if (isAdmin) return true;
    return folder.name === userCommunityCode;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FolderOpen className="h-5 w-5" />
        <h2 className="text-lg font-semibold">雲端資源共享</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>共用檔案夾</CardTitle>
          <CardDescription>
            {isAdmin
              ? "管理員模式：顯示所有社區共用檔案夾"
              : `查看與下載 ${userCommunityCode || ""} 社區共用檔案`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFolders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFolders.map((folder) => (
                <Card
                  key={folder.name}
                  className="group cursor-pointer transition-all hover:shadow-md border"
                  onClick={() => handleOpenFolder(folder.folderId)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                        <HardDrive className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base font-medium leading-tight">
                          {folder.name} 檔案夾
                        </CardTitle>
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs leading-relaxed">
                      點擊開啟 Google Drive 資料夾
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>
                找不到符合您社區編號 ({userCommunityCode || "未設定"})
                的資料夾。
              </p>
              <p className="text-sm mt-2">請聯繫管理員確認您的權限與設定。</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">存取說明</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>點擊上方卡片將開啟新的瀏覽器分頁。</li>
            <li>您需要登入 Google 帳號才能存取相關內容。</li>
            <li>
              {isAdmin ? "管理員可看見所有資料夾。" : "您只能看見您的資料夾。"}
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CloudDriveArea;
