import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  console.log("currentUser", currentUser);

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        navigate("/home", { replace: true });
      } else {
        navigate("/auth", { replace: true });
      }
    }
  }, [currentUser, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
