import { useToast } from "@/components/ui/use-toast";
import { useGetRegistrants } from "@/api/registration";

interface UseRegistrantsProps {
  isFocus?: boolean;
}

export const useRegistrants = ({
  isFocus = true,
}: UseRegistrantsProps = {}) => {
  const { toast } = useToast();

  const { data: registrants, isLoading: isGetRegistrantsLoading } =
    useGetRegistrants({ enabled: isFocus });

  return {
    registrants,
    loading: isGetRegistrantsLoading,
  };
};
