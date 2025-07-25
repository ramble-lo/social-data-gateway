import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, ArrowLeft } from "lucide-react";

interface PasswordResetFormProps {
  onBack: () => void;
}

export default function PasswordResetForm({ onBack }: PasswordResetFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      setError("請輸入電子郵件");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "重設密碼失敗");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">重設密碼</CardTitle>
          <CardDescription className="text-center">
            密碼重設連結已發送
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              我們已將密碼重設連結發送到您的電子郵件信箱。請檢查您的收件匣或垃圾郵件並點擊連結來重設密碼。
            </AlertDescription>
          </Alert>
          <Button onClick={onBack} className="w-full" variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回登入
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">重設密碼</CardTitle>
        <CardDescription className="text-center">
          請輸入您的電子郵件，我們將發送重設密碼連結給您
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">電子郵件</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="請輸入電子郵件"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "發送中..." : "發送重設連結"}
          </Button>
        </form>

        <Button onClick={onBack} className="w-full" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回登入
        </Button>
      </CardContent>
    </Card>
  );
}
