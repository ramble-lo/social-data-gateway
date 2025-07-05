import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
  Upload,
  FileSpreadsheet,
  Link,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";

interface RegistrantDetailProps {
  value: string;
}

const QuickLinkArea = ({ value }: RegistrantDetailProps) => {
  const quickLinks = [
    {
      title: "青創資料區",
      description: "管理青創相關文件資料",
      url: "https://drive.google.com/drive/folders/1MtDunKyxLboyIaxlTRFZD2XV-AOS5WTf",
      icon: FileSpreadsheet,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "核銷憑證上傳區",
      description: "上傳與管理核銷憑證",
      url: "https://drive.google.com/drive/folders/1o5YO86al3uJtXVomVoXPgZINKhgfosJ5?lfhs=2",
      icon: Upload,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "平台組排班表",
      description: "查看與編輯排班安排",
      url: "https://docs.google.com/spreadsheets/d/1HkU3fpYSDLtKol_ve6RlQpBuTx6HpO-l8EElcQMumTg/edit?gid=675656032#gid=675656032",
      icon: Clock,
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "活動總表",
      description: "管理所有活動資訊",
      url: "https://docs.google.com/spreadsheets/d/1pUWFjSF0PONrs-THNAPP9VpeA0BffZOfJSFevd_QdD8",
      icon: Calendar,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "請款記錄表",
      description: "管理財務請款記錄",
      url: "https://docs.google.com/spreadsheets/d/19viECOJBZ9dSQ2PyiKA7oWRNoMSeTF_6/edit?gid=12210529#gid=12210529",
      icon: DollarSign,
      color: "bg-red-500 hover:bg-red-600",
    },
  ];

  const handleQuickLinkClick = (url: string, title: string) => {
    console.log(`開啟連結: ${title} - ${url}`);
    window.open(url, "_blank");
  };
  return (
    <TabsContent value={value}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map((link, index) => (
          <Card
            key={index}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
            onClick={() => handleQuickLinkClick(link.url, link.title)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${link.color} text-white`}>
                  <link.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
                <Link className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
};

export default QuickLinkArea;
