import { useQuery } from "@tanstack/react-query";
import { DASHBOARD } from "../../react-keys/querykeys";
import getDashboard from "@/api/functions/artist/dashboard";

const useGetDashboard = () => {
  return useQuery({
    queryKey: [DASHBOARD],
    queryFn: getDashboard,
  });
};

export { useGetDashboard };
