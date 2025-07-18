import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import { useRegistrants } from "@/hooks/useRegistrants";
import { useGetRegistrationHistoryCount } from "@/api/registration";

const StatusArea = () => {
  const { registrants, loading } = useRegistrants();
  const { data: totalCount } = useGetRegistrationHistoryCount();

  if (loading) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">總報名人次</p>
              <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
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
                {registrants.length}
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
  );
};

export default StatusArea;
