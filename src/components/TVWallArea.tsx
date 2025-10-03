import React, { useState, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Monitor,
  Download,
  Eye,
  Palette,
  Type,
  ImageIcon,
  Settings,
  Save,
  RefreshCw,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  htmlToImage,
  generateTVWallPdfFromSettings,
  downloadImage,
  generateFilename,
} from "@/utils/pdfGenerator";
import { TVWallDocument } from "@/utils/TVWallPdfDocument";
import TVWallPreview, { TVWallSettings } from "@/components/TVWallPreview";

interface TVWallAreaProps {
  value: string;
  activeTab: string;
}

const TVWallArea: React.FC<TVWallAreaProps> = () => {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<TVWallSettings>({
    title: "興隆亂打秀樂團",
    subtitle: "",
    location: "多功能會議室",
    date: "2025/10/12（日）10:00-12:00",
    photoUrl:
      // "https://drive.google.com/uc?id=1E35menliRy-1Cp9eaH2bxP3zkynqxV3b",
      "https://lh3.googleusercontent.com/d/1E35menliRy-1Cp9eaH2bxP3zkynqxV3b",
    registrationQRCode:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/QR_Code_Example.svg/480px-QR_Code_Example.svg.png",
    backgroundColor: "#E7E8E8",
    textColor: "#444444",
    fontSize: "large",
    layout: "center",
    logoUrl: "",
    content:
      "今日活動內容將在此顯示\n\n• 活動時間：\n• 活動地點：\n• 注意事項：",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleSettingChange = (key: keyof TVWallSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleQRCodeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 檢查檔案類型
    if (!file.type.startsWith("image/")) {
      toast({
        title: "檔案格式錯誤",
        description: "請選擇圖片檔案 (PNG、JPG、JPEG)",
        variant: "destructive",
      });
      return;
    }

    // 檢查檔案大小 (限制 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "檔案過大",
        description: "檔案大小不能超過 5MB",
        variant: "destructive",
      });
      return;
    }

    // 讀取檔案並轉換為 base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleSettingChange("registrationQRCode", result);
      toast({
        title: "QR Code 上傳成功",
        description: "您的 QR Code 已成功上傳並將顯示在電視牆上",
      });
    };
    reader.onerror = () => {
      toast({
        title: "上傳失敗",
        description: "讀取檔案時發生錯誤，請重試",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const generatePreview = () => {
    // 觸發預覽更新
    toast({
      title: "預覽已更新",
      description: "電視牆預覽已根據您的設定更新",
    });
  };

  const downloadAsImage = async () => {
    if (!previewRef.current) return;

    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage(previewRef.current, {
        format: "png",
        scale: 2,
        width: 1920,
        height: 1080,
      });

      const filename = generateFilename("tvwall", "png");
      downloadImage(dataUrl, filename);

      toast({
        title: "下載成功",
        description: `電視牆圖片 "${filename}" 已下載到您的設備`,
      });
    } catch (error) {
      toast({
        title: "下載失敗",
        description: "生成電視牆圖片時發生錯誤",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsPdf = async () => {
    setIsGenerating(true);
    try {
      const filename = generateFilename("tvwall", "pdf");
      await generateTVWallPdfFromSettings(settings, filename);

      toast({
        title: "PDF 生成成功",
        description: `電視牆 PDF "${filename}" 已下載到您的設備`,
      });
    } catch (error) {
      toast({
        title: "PDF 生成失敗",
        description: "生成電視牆 PDF 時發生錯誤",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveTemplate = () => {
    // 保存模板到本地存儲或後端
    localStorage.setItem("tvWallTemplate", JSON.stringify(settings));
    toast({
      title: "模板已保存",
      description: "您的電視牆模板已成功保存",
    });
  };

  const loadTemplate = () => {
    const saved = localStorage.getItem("tvWallTemplate");
    if (saved) {
      setSettings(JSON.parse(saved));
      toast({
        title: "模板已載入",
        description: "已載入您之前保存的電視牆模板",
      });
    } else {
      toast({
        title: "無保存模板",
        description: "未找到已保存的電視牆模板",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Monitor className="h-5 w-5" />
        <h2 className="text-lg font-semibold">電視牆製作工具</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 設定面板 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>電視牆設定</span>
            </CardTitle>
            <CardDescription>自訂您的電視牆顯示內容和樣式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 基本內容設定 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">主標題</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => handleSettingChange("title", e.target.value)}
                  placeholder="輸入主標題"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">副標題</Label>
                <Input
                  id="subtitle"
                  value={settings.subtitle}
                  onChange={(e) =>
                    handleSettingChange("subtitle", e.target.value)
                  }
                  placeholder="輸入副標題"
                />
              </div>

              <div>
                <Label htmlFor="content">內容</Label>
                <Textarea
                  id="content"
                  value={settings.content}
                  onChange={(e) =>
                    handleSettingChange("content", e.target.value)
                  }
                  placeholder="輸入電視牆顯示內容"
                  rows={6}
                />
              </div>
            </div>

            {/* 樣式設定 */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>樣式設定</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backgroundColor">背景顏色</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) =>
                      handleSettingChange("backgroundColor", e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="textColor">文字顏色</Label>
                  <Input
                    id="textColor"
                    type="color"
                    value={settings.textColor}
                    onChange={(e) =>
                      handleSettingChange("textColor", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fontSize">字體大小</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value) =>
                    handleSettingChange("fontSize", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">小</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="large">大</SelectItem>
                    <SelectItem value="xlarge">特大</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="layout">文字對齊</Label>
                <Select
                  value={settings.layout}
                  onValueChange={(value) =>
                    handleSettingChange("layout", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">靠左</SelectItem>
                    <SelectItem value="center">置中</SelectItem>
                    <SelectItem value="right">靠右</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="logoUrl">Logo 圖片網址 (選填)</Label>
                <Input
                  id="logoUrl"
                  value={settings.logoUrl}
                  onChange={(e) =>
                    handleSettingChange("logoUrl", e.target.value)
                  }
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            {/* QR Code 上傳區域 */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium flex items-center space-x-2">
                <ImageIcon className="h-4 w-4" />
                <span>QR Code 設定</span>
              </h4>

              <div>
                <Label htmlFor="qrCodeUpload">上傳 QR Code 圖片</Label>
                <Input
                  id="qrCodeUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleQRCodeUpload}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  支援 PNG、JPG、JPEG 格式
                </p>
              </div>

              {settings.registrationQRCode && (
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-16 border rounded overflow-hidden">
                    <img
                      src={settings.registrationQRCode}
                      alt="QR Code 預覽"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      QR Code 已上傳
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSettingChange("registrationQRCode", "")
                      }
                      className="mt-1"
                    >
                      移除 QR Code
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 操作按鈕 */}
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button onClick={generatePreview} variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                更新預覽
              </Button>
              <Button onClick={saveTemplate} variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                保存模板
              </Button>
              <Button onClick={loadTemplate} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                載入模板
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 預覽面板 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>即時預覽</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={downloadAsImage}
                  disabled={isGenerating}
                  size="sm"
                  variant="outline"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  下載圖片
                </Button>
                <Button
                  onClick={downloadAsPdf}
                  disabled={isGenerating}
                  size="sm"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  下載 PDF
                </Button>
              </div>
            </CardTitle>
            <CardDescription>預覽您的電視牆顯示效果</CardDescription>
          </CardHeader>
          <CardContent>
            <TVWallPreview ref={previewRef} settings={settings} />

            <div className="mt-4 text-sm text-muted-foreground">
              <p>• 建議解析度：1920x1080 (16:9)</p>
              <p>• 支援格式：PNG、JPG、PDF</p>
              <p>• 適用於大螢幕顯示和列印</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用說明 */}
      <Card>
        <CardHeader>
          <CardTitle>使用說明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">基本操作</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 在左側設定面板調整內容和樣式</li>
                <li>• 右側預覽面板會即時顯示效果</li>
                <li>• 點擊「更新預覽」重新整理顯示</li>
                <li>• 點擊「下載圖片」生成電視牆圖片</li>
                <li>• 點擊「下載 PDF」生成可列印的 PDF 文件</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">進階功能</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 保存模板供未來使用</li>
                <li>• 載入之前保存的模板</li>
                <li>• 支援自訂 Logo 圖片</li>
                <li>• 多種文字排版選項</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TVWallArea;
