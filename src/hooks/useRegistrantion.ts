import { useToast } from "@/components/ui/use-toast";
import { useGetRegistrantionHistory } from "@/api/registration";

const useRegistrantion = () => {
  const { toast } = useToast();
  const {
    data: registrantionHistory,
    isLoading: isGetRegistrantionHistoryLoading,
  } = useGetRegistrantionHistory();

  return {
    registrantionHistory,
    loading: isGetRegistrantionHistoryLoading,
  };
};

export default useRegistrantion;
