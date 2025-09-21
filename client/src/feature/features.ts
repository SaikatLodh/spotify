import createSubscription from "@/api/functions/subscription/createSubscription";
import getKeys from "@/api/functions/subscription/keys";
import { User } from "@/types";

function formatDuration(totalSeconds: number): string {
  const hours: number = Math.floor(totalSeconds / 3600);
  const minutes: number = Math.floor((totalSeconds % 3600) / 60);
  const seconds: number = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  // Add minutes if there are any, or if hours are present (to show "4h 0m")
  if (minutes > 0 || (hours > 0 && seconds > 0)) {
    parts.push(`${minutes}m`);
  }

  // Add seconds. If the duration is less than a minute, show the decimal seconds.
  // Otherwise, round to the nearest whole second.
  if (seconds > 0) {
    if (hours === 0 && minutes === 0) {
      parts.push(`${seconds.toFixed(2)}s`);
    } else {
      parts.push(`${Math.floor(seconds)}s`);
    }
  }

  // If the total duration is 0, return '0s'
  if (parts.length === 0) {
    return "0s";
  }

  return parts.join(" ");
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handelPayment = async (
  data: { plan: string; price: number; duration: string } | null,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  user: User | null
) => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  setIsLoading(true);
  const orderdata = {
    plan: data?.plan as string,
    price: data?.price as number,
    duration: data?.duration as string,
  };

  const details = await createSubscription(orderdata);
  const key = await getKeys();

  const options = {
    key: key, // Replace with your Razorpay key_id
    amount: `${details?.amount}`, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: `${details?.currency}`,
    name: "Spotify",
    description: "Spotify Subscription",
    order_id: `${details?.id}`, // This is the order_id created in the backend
    callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/verify-subscription/${details?.subscriptionId}/${user?._id}`, // Your success URL
    prefill: {
      name: `${user?.fullName}`,
      email: `${user?.email}`,
    },
    theme: {
      color: "#F37254",
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();

  setIsLoading(false);
};
export { formatDuration, handelPayment };
