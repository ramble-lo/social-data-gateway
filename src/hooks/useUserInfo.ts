import { useAuth } from "./useAuth";
import { useGetUserInfo } from "@/api/user";

const useUserInfo = () => {
  const { currentUser } = useAuth();
  const { data: userInfo } = useGetUserInfo(currentUser.email);
  return {
    userInfo,
  };
};

export default useUserInfo;
