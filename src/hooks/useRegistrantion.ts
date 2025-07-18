import { useToast } from "@/components/ui/use-toast";
import {
  useGetRegistrantionHistory,
  getRegistrationHistoryCount,
  useGetRegistrationHistoryCount,
} from "@/api/registration";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";

const useRegistrantion = (
  page: number = 1,
  pageSize: number = 10,
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null
) => {
  const { toast } = useToast();
  const {
    data,
    isLoading: isGetRegistrantionHistoryLoading,
    ...rest
  } = useGetRegistrantionHistory(page, pageSize, lastVisible);
  const { data: totalCount } = useGetRegistrationHistoryCount();

  return {
    registrantionHistory: data?.data || [],
    lastVisible: data?.lastVisible,
    loading: isGetRegistrantionHistoryLoading,
    totalCount,
    ...rest,
  };
};

export default useRegistrantion;
