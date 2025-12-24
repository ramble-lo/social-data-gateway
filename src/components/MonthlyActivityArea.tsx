import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface MonthlyActivityAreaProps {
  value: string;
  activeTab: string;
}

const MonthlyActivityArea: React.FC<MonthlyActivityAreaProps> = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5" />
        <h2 className="text-lg font-semibold">每月活動管理</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>活動列表</CardTitle>
          <CardDescription>管理每月的社區活動</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full h-[600px] bg-white rounded-md overflow-hidden">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=xinglongphd2%40gmail.com&ctz=Asia%2FTaipei"
              style={{ border: 0 }}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              title="Google Calendar"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyActivityArea;
