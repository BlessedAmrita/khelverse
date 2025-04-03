'use Client';
import React from "react";
import MetricCard from "@/components/ui/MetricCard"; // Adjust the import path for your component
import { metricCards } from "@/content/mockData"; // Adjust the import path for your mock data

const ProgressSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {metricCards.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          improved={metric.improved}
          icon={metric.icon}
          className="animate-slide-in"
          style={{ animationDelay: `${index * 50}ms` }}
        />
      ))}
    </div>
  );
};

export default ProgressSummary;
