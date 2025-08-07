import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
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

const StatusArea = ({ value, activeTab }: StatusAreaProps) => {
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
    <TabsContent value={value} className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  總報名活動人次
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {registrationCount}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">報名人數</p>
                <p className="text-2xl font-bold text-green-600">
                  {registrantsCount}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">系統狀態</p>
                <p className="text-2xl font-bold text-emerald-600">正常</p>
              </div>
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default StatusArea;
