import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  FileSpreadsheet,
  Link,
  Calendar,
  DollarSign,
  Clock,
  Repeat2,
  Monitor,
} from "lucide-react";
import ReactGA from "react-ga4";

interface QuickLinkAreaProps {
  value: string;
  activeTab: string;
}

const QuickLinkArea: React.FC<QuickLinkAreaProps> = () => {
  const quickLinks = [
    {
      title: "青創社區行動紀錄表單(B表)",
      description: "記錄社區行動辦理後成果",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSfx6I-JOq828gjKA_kltLDtDT5V704T7NapdKYRwnbn0ElNlQ/viewform",
      icon: Repeat2,
    },
    {
      title: "B表明細",
      description: "B表活動辦理明細",
      url: "https://docs.google.com/spreadsheets/d/1Dmzf9hA5y8RKHGFoUWi3Wzbdc5IGlrTTmOvi1r9J4YU",
      icon: FileSpreadsheet,
    },
    {
      title: "每月活動總表",
      description: "管理所有活動資訊",
      url: "https://docs.google.com/spreadsheets/d/1pUWFjSF0PONrs-THNAPP9VpeA0BffZOfJSFevd_QdD8",
      icon: Calendar,
    },
    {
      title: "青創資料區",
      description: "管理青創相關文件資料",
      url: "https://drive.google.com/drive/folders/1MtDunKyxLboyIaxlTRFZD2XV-AOS5WTf",
      icon: FileSpreadsheet,
    },
    {
      title: "核銷憑證上傳區",
      description: "上傳與管理核銷憑證",
      url: "https://drive.google.com/drive/folders/1o5YO86al3uJtXVomVoXPgZINKhgfosJ5?lfhs=2",
      icon: Upload,
    },
    {
      title: "平台組排班表",
      description: "查看與編輯排班安排",
      url: "https://docs.google.com/spreadsheets/d/1HkU3fpYSDLtKol_ve6RlQpBuTx6HpO-l8EElcQMumTg/edit?gid=675656032#gid=675656032",
      icon: Clock,
    },
    {
      title: "請款記錄表",
      description: "管理財務請款記錄",
      url: "https://docs.google.com/spreadsheets/d/19viECOJBZ9dSQ2PyiKA7oWRNoMSeTF_6/edit?gid=12210529#gid=12210529",
      icon: DollarSign,
    },
    {
      title: "興隆導覽頁",
      description: "綜合關連結資訊",
      url: "https://docs.google.com/spreadsheets/d/1kRdajE017uFU9Paw6FZW9UAKKhyNvbGS/edit?gid=1065544107#gid=1065544107",
      icon: Monitor,
    },
  ];

  const handleQuickLinkClick = (url: string, title: string) => {
    ReactGA.event({
      category: "QuickLink",
      action: "Click",
      label: title,
    });
    window.open(url, "_blank");
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {quickLinks.map((link, index) => (
          <Card
            key={index}
            className="group cursor-pointer transition-all hover:shadow-md border"
            onClick={() => handleQuickLinkClick(link.url, link.title)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                  <link.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base font-medium leading-tight">
                    {link.title}
                  </CardTitle>
                </div>
                <Link className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-xs leading-relaxed">
                {link.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickLinkArea;
