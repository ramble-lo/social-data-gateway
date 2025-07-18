import { useToast } from "@/components/ui/use-toast";
import { useGetRegistrants } from "@/api/registration";

export const useRegistrants = () => {
  const { toast } = useToast();

  const { data: registrants, isLoading: isGetRegistrantsLoading } =
    useGetRegistrants();

  return {
    registrants,
    loading: isGetRegistrantsLoading,
  };
};
