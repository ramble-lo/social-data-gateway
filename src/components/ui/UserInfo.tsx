import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserInfo from "@/hooks/useUserInfo";

const UserInfo: React.FC = () => {
  const { currentUser } = useAuth();
  const { userInfo } = useUserInfo();

  if (!currentUser) {
    return <div>請先登入</div>;
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>個人資料</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={currentUser.photoURL || undefined}
              alt={currentUser.displayName || "User"}
            />
            <AvatarFallback>
              {getInitials(currentUser.displayName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-semibold">{currentUser.displayName}</p>
            <p className="text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">詳細資訊</h3>
          <div className="mt-2 space-y-2 text-sm">
            <p>
              <span className="font-medium">AuthID:</span> {currentUser.uid}
            </p>
            <p>
              <span className="font-medium">StoreID:</span> {userInfo?.id}
            </p>
            <p>
              <span className="font-medium">組別編號:</span>{" "}
              {userInfo?.community_code}
            </p>
            <p>
              <span className="font-medium">帳號身份:</span> {userInfo?.role}
            </p>
            <p>
              <span className="font-medium">Email 是否已驗證:</span>{" "}
              {currentUser.emailVerified ? "是" : "否"}
            </p>
            <p>
              <span className="font-medium">帳號建立時間:</span>{" "}
              {currentUser.metadata.creationTime}
            </p>
            <p>
              <span className="font-medium">最後登入時間:</span>{" "}
              {currentUser.metadata.lastSignInTime}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
