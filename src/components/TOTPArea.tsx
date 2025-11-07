import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, RefreshCw, Clock, AlertCircle } from "lucide-react";
import { TOTP } from "otpauth";

interface TOTPAreaProps {
  value: string;
  activeTab: string;
}

const TOTPArea: React.FC<TOTPAreaProps> = ({ value, activeTab }) => {
  // 從環境變數讀取TOTP Secret Key
  const TOTP_SECRET_KEY = import.meta.env.VITE_TOTP_SECRET_KEY || "";

  const [totpCode, setTotpCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [error, setError] = useState("");
  const [totp, setTotp] = useState<TOTP | null>(null);

  // 創建TOTP實例
  const createTOTP = (secretKey: string) => {
    try {
      const totpInstance = new TOTP({
        issuer: "社區活動管理系統",
        label: "用戶驗證",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secretKey,
      });
      setTotp(totpInstance);
      setError("");
      return totpInstance;
    } catch (err) {
      setError("無效的Secret密鑰格式");
      setTotp(null);
      return null;
    }
  };

  // 初始化TOTP
  const initializeTOTP = useCallback(() => {
    if (!TOTP_SECRET_KEY) {
      setError("未找到TOTP密鑰配置");
      return;
    }

    // 移除空格
    const cleanedSecret = TOTP_SECRET_KEY.replace(/\s+/g, "");
    const totpInstance = createTOTP(cleanedSecret);
    if (totpInstance) {
      try {
        const code = totpInstance.generate();
        setTotpCode(code);
        setError("");
      } catch (err) {
        setError("生成TOTP代碼失敗");
        setTotpCode("");
      }
    }
  }, [TOTP_SECRET_KEY]);

  // 自動刷新TOTP代碼
  useEffect(() => {
    if (!totp) return;

    const updateCode = () => {
      try {
        const code = totp.generate();
        setTotpCode(code);

        // 計算剩餘時間
        const now = Math.floor(Date.now() / 1000);
        const remaining = 30 - (now % 30);
        setTimeRemaining(remaining);
      } catch (err) {
        setError("更新TOTP代碼失敗");
      }
    };

    // 立即更新一次
    updateCode();

    // 每秒更新
    const interval = setInterval(updateCode, 1000);

    return () => clearInterval(interval);
  }, [totp]);

  // 複製到剪貼板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // 這裡可以加入一個toast提示
    } catch (err) {
      console.error("複製失敗:", err);
    }
  };

  // 手動刷新
  const handleRefresh = () => {
    if (totp) {
      try {
        const code = totp.generate();
        setTotpCode(code);
        setError("");
      } catch (err) {
        setError("刷新TOTP代碼失敗");
      }
    }
  };

  // 在組件載入時初始化TOTP
  useEffect(() => {
    initializeTOTP();
  }, [initializeTOTP]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Google帳號驗證器</h3>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {totpCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              xinglongphd2@gmail.com
            </CardTitle>
            <CardDescription>
              當前的六位數驗證密碼，每30秒自動更新
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {/* TOTP 代碼顯示 */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold tracking-wider text-primary bg-primary/10 px-6 py-4 rounded-lg border-2 border-primary/20">
                    {totpCode}
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>剩餘時間：{timeRemaining} 秒</span>
                  </div>
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(totpCode)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  複製代碼
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  手動刷新
                </Button>
              </div>

              {/* 進度條 */}
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(timeRemaining / 30) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>使用說明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-2">
            <span className="font-medium text-foreground">1.</span>
            <span>系統會自動載入並顯示Google帳號驗證器的六位數驗證密碼</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-foreground">2.</span>
            <span>驗證密碼每30秒會自動更新，進度條顯示剩餘有效時間</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-foreground">3.</span>
            <span>點擊「複製代碼」可將當前驗證密碼複製到剪貼板使用</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-foreground">4.</span>
            <span>點擊「手動刷新」可立即產生新的驗證密碼</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-foreground">5.</span>
            <span>此驗證密碼可用於需要雙因子認證的各種服務登入</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TOTPArea;
