import React from "react";
import UserInfo from "@/components/ui/UserInfo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const UserInfoPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">使用者資訊</h1>
        <Button asChild>
          <Link to="/home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回主頁
          </Link>
        </Button>
      </div>
      <UserInfo />
    </div>
  );
};

export default UserInfoPage;