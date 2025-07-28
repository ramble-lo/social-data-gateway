import { db } from "@/integrations/firebase/client";
import { UserInfo } from "@/types/user";
import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export async function addUserWithUniqueMail(
  user: User,
  communityCode: string,
  displayName?: string
) {
  const { email } = user;
  try {
    const usersCollectionRef = collection(db, "users");

    // 1. 查詢現有文件：檢查是否已存在相同的信箱地址
    const emailQuery = query(usersCollectionRef, where("email", "==", email));
    const emailQuerySnapshot = await getDocs(emailQuery);

    if (!emailQuerySnapshot.empty) {
      // 如果查詢結果不為空，表示該信箱地址已存在
      console.warn(`信箱地址 ${email} 已存在，無法新增使用者。`);
      return false;
    }

    // 2. 查詢現有文件：檢查是否已存在相同的組別編號
    const communityCodeQuery = query(
      usersCollectionRef,
      where("community_code", "==", communityCode)
    );
    const communityCodeQuerySnapshot = await getDocs(communityCodeQuery);

    if (!communityCodeQuerySnapshot.empty) {
      console.warn(`組別編號 ${communityCode} 已存在，無法新增使用者。`);
      return false;
    }

    const userInfo: UserInfo = {
      name: displayName || "",
      email: email,
      role: "guest",
      community_code: communityCode,
      created_at: Timestamp.fromDate(new Date()),
    };
    // 3. 條件式新增：如果信箱地址和組別編號都不存在，則新增文件
    const docRef = await addDoc(usersCollectionRef, userInfo);

    // console.log("文件成功新增，ID：", docRef.id);
    return true;
  } catch (e) {
    console.error("新增文件時發生錯誤：", e);
    return false;
  }
}

// const useGetUserInfo = (
//   email: string,
//   options?: UseQueryOptions<RegistrationFromFirebase[], Error>
// ) => {
// return useQuery({
//   queryKey: ["user_info", email],
//   queryFn: () => getUserInfo(email),
//   ...options,
// });
// };

const getUserInfo = async (email: string) => {
  const userCollection = collection(db, "users");
  const usersQuery = query(userCollection, where("email", "==", email));
  const userSnapshot = await getDocs(usersQuery);
  const userInfo = userSnapshot.docs[0].data() as UserInfo;
  return userInfo;
};

export const useGetUserInfo = (
  email: string,
  options?: UseQueryOptions<UserInfo, Error>
) => {
  return useQuery({
    queryKey: ["user_info", email],
    queryFn: () => getUserInfo(email),
    ...options,
  });
};
