"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useGetSubscriptionPlane } from "@/hooks/react-query/react-hooks/subscriptionplane/subscriptionPlaneHook";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { handelPayment } from "@/feature/features";

const SubscriptionPlanSkeleton = () => {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 h-fit">
      <div className="grid gap-4 p-6">
        <div className="h-8 bg-zinc-800 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-full"></div>
        <div className="h-12 bg-zinc-800 rounded animate-pulse w-1/2"></div>
        <div className="grid gap-2">
          <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="p-4 border-t">
        <div className="h-10 bg-zinc-800 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

const SubcriptionPlan = () => {
  const [isLeading, setIsLoading] = React.useState(false);
  const { data, isLoading } = useGetSubscriptionPlane();
  const { user } = useSelector((state: RootState) => state.auth);

  const payment = async (data: {
    plan: string;
    price: number;
    duration: string;
  }) => {
    const plan = data.plan;
    const price = data.price;
    const duration = data.duration;
    await handelPayment({ plan, price, duration }, setIsLoading, user);
  };

  return (
    <>
      <ScrollArea className="rounded-md h-[calc(100vh-180px)]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3  h-full md:py-20 py-10 md:px-20 px-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <SubscriptionPlanSkeleton key={i} />
              ))
            : data &&
              data.length > 0 &&
              data.map((item) => {
                return (
                  <div
                    className="flex flex-col rounded-lg border border-gray-200 h-fit"
                    key={item._id}
                  >
                    <div className="grid gap-4 p-6">
                      <h3 className="text-2xl font-semibold">
                        {item.planName}
                      </h3>
                      <p className="text-sm leading-6 text-gray-500">
                        Perfect for individuals getting started
                      </p>
                      <div className="text-4xl font-semibold">
                        ₹{item.price}{" "}
                        <span className="text-2xl"> for {item.duration}</span>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <p className="flex items-center gap-2">
                          <CircleCheckIcon className="w-4 h-4" />
                          Unlimited Like Songs
                        </p>
                        <p className="flex items-center gap-2">
                          {item.planName === "Pro" ||
                          item.planName === "Premium" ? (
                            <CircleCheckIcon className="w-4 h-4" />
                          ) : (
                            <CrossIcon className="w-4 h-4" />
                          )}
                          Unlimited Create Playlists
                        </p>
                        <p className="flex items-center gap-2">
                          {item.planName === "Premium" ? (
                            <CircleCheckIcon className="w-4 h-4" />
                          ) : (
                            <CrossIcon className="w-4 h-4" />
                          )}
                          Download All Songs
                        </p>
                      </div>
                    </div>
                    <div className="p-4 border-t grid gap-2">
                      <Button
                        className="text-white cursor-pointer"
                        onClick={() =>
                          payment({
                            plan: item.planName,
                            price: item.price,
                            duration: item.duration,
                          })
                        }
                        disabled={
                          isLeading ||
                          user?.subscriptionStatus === item.planName
                        }
                      >
                        {isLeading ? "Processing..." : "Select Plan"}
                      </Button>
                    </div>
                  </div>
                );
              })}
        </div>
      </ScrollArea>
    </>
  );
};

function CircleCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default SubcriptionPlan;
