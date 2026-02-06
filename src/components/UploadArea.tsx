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
import { Upload, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { callUploadApplicationForm } from "@/api/uploadApplicationForm";

interface UploadAreaProps {
  value: string;
  activeTab: string;
}

const UploadArea: React.FC<UploadAreaProps> = () => {
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
      // Call Cloud Function to process Excel file
      const result = await callUploadApplicationForm(file);

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
          "file-upload",
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">資料上傳</h3>
        <p className="text-sm text-muted-foreground mb-4">
          上傳 Excel 檔案來更新報名者資料
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSpreadsheet className="w-5 h-5" />
            Excel 報名表上傳
          </CardTitle>
          <CardDescription>
            支援 Excel (.xlsx, .xls) 和 CSV
            檔案格式。系統會自動處理重複報名者，以姓名和手機號碼作為唯一識別。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-sm font-medium">
                  點擊選擇檔案或拖拽至此
                </span>
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <p className="text-xs text-muted-foreground">
                支援 .xlsx, .xls, .csv 格式
              </p>
            </div>
          </div>

          {file && (
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  大小: {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
          )}

          <Button
            onClick={handleUploadSubmit}
            className="w-full"
            disabled={!file || uploading}
            size="lg"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "處理中..." : "上傳並更新資料庫"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadArea;
