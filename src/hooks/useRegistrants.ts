import { useToast } from "@/components/ui/use-toast";
import {
  useGetRegistrants,
  useGetRegistrantionHistory,
} from "@/api/registration";

export const useRegistrants = () => {
  const { toast } = useToast();

  const { data: registrants, isLoading: isGetRegistrantsLoading } =
    useGetRegistrants();

  const {
    data: registrantionHistory,
    isLoading: isGetRegistrantionHistoryLoading,
  } = useGetRegistrantionHistory();

  return {
    registrants,
    registrantionHistory,
    loading: isGetRegistrantsLoading || isGetRegistrantionHistoryLoading,
  };
};
