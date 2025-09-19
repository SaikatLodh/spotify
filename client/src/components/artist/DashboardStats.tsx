import React from "react";
import StatsCard from "./StatsCard";
import { Download, Library, ListMusic, Users2 } from "lucide-react";
import { useGetDashboard } from "@/hooks/react-query/react-hooks/dashboard/dashbord";
const DashboardStats = () => {
  const { data } = useGetDashboard();

  const statsData = [
    {
      icon: ListMusic,
      label: "Total Songs",
      value: data?.totalSongs || 0,
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      icon: Library,
      label: "Total Albums",
      value: data?.totalAlbums || 0,
      bgColor: "bg-violet-500/10",
      iconColor: "text-violet-500",
    },
    {
      icon: Users2,
      label: "Total Listens",
      value: data?.totalListensCount || 0,
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
    {
      icon: Download,
      label: "Total Downloads",
      value: 2,
      bgColor: "bg-sky-500/10",
      iconColor: "text-sky-500",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            bgColor={stat.bgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
    </>
  );
};

export default DashboardStats;
