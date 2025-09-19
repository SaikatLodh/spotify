import { useQuery } from "@tanstack/react-query";
import { SUBSCRIPTION_PLANES } from "../../react-keys/querykeys";
import getSubscriptionPlane from "@/api/functions/subcriptionplane/subscriptionPlane";

const useGetSubscriptionPlane = () => {
  return useQuery({
    queryKey: [SUBSCRIPTION_PLANES],
    queryFn: getSubscriptionPlane,
  });
};

export { useGetSubscriptionPlane };
