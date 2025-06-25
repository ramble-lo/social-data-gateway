import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileSpreadsheet,
  Users,
  Link,
  Calendar,
  DollarSign,
  Clock,
  UserCheck,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRegistrants } from "@/hooks/useRegistrants";
import RegistrantDetail from "@/components/RegistrantDetail";
import { RegistrantWithHistory } from "@/types/registrant";
import { processExcelFile } from "@/utils/excelProcessor";

// 模擬報名資料的介面
interface RegistrationData {
  id: string;
  activityName: string;
  name: string;
  gender: string;
  age?: string;
  email: string;
  phone: string;
  lineId?: string;
  childrenCount?: string;
  isResident: string;
  housingLocation?: string;
  sportsExperience?: string;
  injuryHistory?: string;
  infoSource?: string;
  suggestions?: string;
  submitTime: string;
  key: string; // email + phone 組成的 key
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedRegistrant, setSelectedRegistrant] =
    useState<RegistrantWithHistory | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();
  const { registrants, loading, fetchRegistrants } = useRegistrants();

  const allRegistrationHistory = useMemo(() => {
    return registrants.flatMap((registrant) =>
      registrant.history.map((historyItem) => ({
        ...historyItem,
        id: historyItem.id,
        name: registrant.name,
        gender: registrant.gender,
        email: registrant.email,
        phone: registrant.phone,
        lineId: registrant.line_id,
        isResident: registrant.is_resident,
      }))
    );
  }, [registrants]);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("檔案已選擇:", selectedFile.name);
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) {
      toast({
        title: "請選擇檔案",
        description: "請先選擇要上傳的 Excel 檔案",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    console.log("開始處理檔案:", file.name);

    toast({
      title: "檔案處理中",
      description: `正在處理 ${file.name}，請稍候...`,
    });

    try {
      const result = await processExcelFile(file);

      if (result.success) {
        toast({
          title: "處理成功",
          description: result.message,
        });

        // 重新載入報名者資料
        await fetchRegistrants();

        // 重置檔案輸入
        setFile(null);
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        toast({
          title: "處理失敗",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("檔案處理錯誤:", error);
      toast({
        title: "處理失敗",
        description: "檔案處理時發生未預期的錯誤",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleQuickLinkClick = (url: string, title: string) => {
    console.log(`開啟連結: ${title} - ${url}`);
    window.open(url, "_blank");
  };

  const handleViewRegistrant = (registrant: RegistrantWithHistory) => {
    setSelectedRegistrant(registrant);
    setDetailDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 標題區域 */}
        <div className="text-center space-y-2 py-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            社區活動管理系統
          </h1>
          <p className="text-lg text-gray-600">
            興隆社宅2區 - 活動報名與資料管理平台
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              資料上傳
            </TabsTrigger>
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
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5" />
                  Excel 報名表上傳
                </CardTitle>
                <CardDescription>
                  上傳 Excel
                  檔案來更新報名者資料到資料庫（系統會自動處理重複報名者，以
                  email + 手機號碼作為唯一識別）
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">選擇 Excel 檔案</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                    disabled={uploading}
                  />
                  {file && (
                    <p className="text-sm text-green-600">
                      已選擇檔案: {file.name}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleUploadSubmit}
                  className="w-full"
                  disabled={!file || uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "處理中..." : "上傳並更新資料庫"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 資料顯示區域 */}
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    報名資料總覽
                  </div>
                  <Badge variant="secondary">
                    總計 {allRegistrationHistory.length} 筆資料
                  </Badge>
                </CardTitle>
                <CardDescription>目前資料庫中的所有報名者資料</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>活動名稱</TableHead>
                        <TableHead>姓名</TableHead>
                        <TableHead>性別</TableHead>
                        <TableHead>年齡</TableHead>
                        <TableHead>電子郵件</TableHead>
                        <TableHead>聯絡電話</TableHead>
                        <TableHead>Line ID</TableHead>
                        <TableHead>是否為住戶</TableHead>
                        <TableHead>資訊來源</TableHead>
                        <TableHead>填答時間</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allRegistrationHistory.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell className="max-w-xs truncate">
                            {registration.activity_name}
                          </TableCell>
                          <TableCell className="font-medium">
                            {registration.name}
                          </TableCell>
                          <TableCell>{registration.gender}</TableCell>
                          <TableCell>{registration.age || "-"}</TableCell>
                          <TableCell>{registration.email}</TableCell>
                          <TableCell>{registration.phone}</TableCell>
                          <TableCell>{registration.lineId || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                registration.isResident
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {registration.isResident ? "住戶" : "非住戶"}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {registration.info_source || "-"}
                          </TableCell>
                          <TableCell>
                            {registration.submit_time
                              .toDate()
                              .toLocaleDateString("zh-TW")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 新增報名者清單區域 */}
          <TabsContent value="registrants">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    報名者清單
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      總計 {registrants.length} 位報名者
                    </Badge>
                    <Button onClick={() => {}} variant="outline" size="sm">
                      遷移現有資料disabled
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  所有報名者的歷史記錄，點擊查看詳細資料
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">載入中...</div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>姓名</TableHead>
                          <TableHead>聯絡方式</TableHead>
                          <TableHead>住戶身份</TableHead>
                          <TableHead>報名次數</TableHead>
                          <TableHead>最近報名時間</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {registrants.map((registrant) => {
                          const latestRegistration = registrant.history.sort(
                            (a, b) =>
                              b.submit_time.toDate().getTime() -
                              a.submit_time.toDate().getTime()
                          )[0];

                          return (
                            <TableRow key={registrant.id}>
                              <TableCell className="font-medium">
                                <div>
                                  <div>{registrant.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {registrant.gender || "-"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div>{registrant.email}</div>
                                  <div className="text-gray-500">
                                    {registrant.phone}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    registrant.is_resident
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {registrant.is_resident ? "住戶" : "非住戶"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {registrant.history.length} 次
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {latestRegistration
                                  ? latestRegistration.submit_time
                                      .toDate()
                                      .toLocaleDateString("zh-TW")
                                  : "-"}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleViewRegistrant(registrant)
                                  }
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="w-4 h-4" />
                                  查看
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 快速連結區域 */}
          <TabsContent value="links">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickLinks.map((link, index) => (
                <Card
                  key={index}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                  onClick={() => handleQuickLinkClick(link.url, link.title)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-lg ${link.color} text-white`}
                      >
                        <link.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {link.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {link.description}
                        </p>
                      </div>
                      <Link className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 狀態監控區域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    總報名人數
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {allRegistrationHistory.length}
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
                  <p className="text-sm font-medium text-gray-600">
                    住戶報名數
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {allRegistrationHistory.filter((r) => r.isResident).length}
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
      </div>

      {/* 報名者詳細資料對話框 */}
      <RegistrantDetail
        registrant={selectedRegistrant}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
};

export default Index;
