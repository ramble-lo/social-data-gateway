import { useToast } from "@/components/ui/use-toast";
import {
  useGetRegistrantionHistory,
  getRegistrationHistoryCount,
  useGetRegistrationHistoryCount,
} from "@/api/registration";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";

interface UseRegistrantionProps {
  page?: number;
  pageSize?: number;
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null;
  isFocus: boolean;
}

const useRegistrantion = ({
  page = 1,
  pageSize = 10,
  lastVisible,
  isFocus,
}: UseRegistrantionProps) => {
  const { toast } = useToast();
  const {
    data,
    isLoading: isGetRegistrantionHistoryLoading,
    ...rest
  } = useGetRegistrantionHistory(page, pageSize, lastVisible, {
    enabled: isFocus,
  });
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
