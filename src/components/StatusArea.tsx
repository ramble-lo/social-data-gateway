import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import {
  useGetRegistrationHistoryCount,
  useGetRegistrantsCount,
} from "@/api/registration";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusAreaProps {
  value: string;
  activeTab: string;
}

const StatusArea: React.FC<StatusAreaProps> = () => {
  const { data: registrationCount, isLoading: isRegistrationCountLoading } =
    useGetRegistrationHistoryCount();
  const { data: registrantsCount, isLoading: isRegistrantsCountLoading } =
    useGetRegistrantsCount();

  const isLoading = isRegistrationCountLoading || isRegistrantsCountLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-1/4 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-1/4 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-1/4 mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              總報名活動人次
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrationCount}</div>
            <p className="text-xs text-muted-foreground">
              所有活動的累計報名人次
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              不重複報名人數
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrantsCount}</div>
            <p className="text-xs text-muted-foreground">
              系統中的唯一報名者數量
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">系統狀態</CardTitle>
            <div className="h-4 w-4 bg-foreground rounded-full flex items-center justify-center">
              <div className="h-2 w-2 bg-background rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">正常運行</div>
            <p className="text-xs text-muted-foreground">所有服務正常運行中</p>
          </CardContent>
        </Card>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>系統概覽</CardTitle>
            <CardDescription>社區活動管理系統的基本資訊</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">資料庫狀態</span>
              <span className="text-sm font-medium">連線正常</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">上次更新</span>
              <span className="text-sm font-medium">
                {new Date().toLocaleString("zh-TW")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">系統版本</span>
              <span className="text-sm font-medium">v1.0.0</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>快速操作(beta)</CardTitle>
            <CardDescription>常用的管理功能</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors">
              <span className="text-sm font-medium">匯出報名資料</span>
            </button>
            <button className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors">
              <span className="text-sm font-medium">清理重複資料</span>
            </button>
            <button className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors">
              <span className="text-sm font-medium">系統備份</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatusArea;
