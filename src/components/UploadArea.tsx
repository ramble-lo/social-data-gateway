import React, { useState, useMemo, useEffect } from "react";
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
import { processExcelFile } from "@/utils/excelProcessor";
import { ResidentStatusDisplayEnum } from "@/types/registrant";

interface RegistrantDetailProps {
  value: string;
}

interface UploadAreaProps {
  value: string;
  activeTab: string;
}

const UploadArea: React.FC<UploadAreaProps> = ({ value, activeTab }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();

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
        // await fetchRegistrants();

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

  return (
    <TabsContent value={value}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Excel 報名表上傳
          </CardTitle>
          <CardDescription>
            上傳 Excel
            檔案來更新報名者資料到資料庫（系統會自動處理重複報名者，以
            姓名手機號碼作為唯一識別）
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
              <p className="text-sm text-green-600">已選擇檔案: {file.name}</p>
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
  );
};

export default UploadArea;
