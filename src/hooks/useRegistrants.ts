import { useGetRegistrants, useGetRegistrantsCount } from "@/api/registration";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

interface UseRegistrantsProps {
  isFocus?: boolean;
  page?: number;
  pageSize?: number;
  lastVisible?: QueryDocumentSnapshot<DocumentData> | null;
  searchTerm?: string;
}

export const useRegistrants = ({
  isFocus = true,
  page = 1,
  pageSize = 10,
  lastVisible = null,
  searchTerm = "",
}: UseRegistrantsProps = {}) => {
  const { data: result, isLoading: isGetRegistrantsLoading } =
    useGetRegistrants(page, pageSize, lastVisible, searchTerm, { enabled: isFocus });
  
  const { data: totalCount } = useGetRegistrantsCount({ enabled: isFocus && !searchTerm });

  return {
    registrants: result?.data || [],
    lastVisible: result?.lastVisible || null,
    loading: isGetRegistrantsLoading,
    totalCount: searchTerm ? result?.data?.length : totalCount,
  };
};
