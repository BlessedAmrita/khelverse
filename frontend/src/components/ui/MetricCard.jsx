import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Activity, 
  Gauge, 
  Heart, 
  Hexagon, 
  LineChart, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  improved, 
  icon, 
  className 
}) => {
  const renderIcon = () => {
    const icons = {
      speed: <Gauge className="h-5 w-5 text-lavender" />,
      strength: <Hexagon className="h-5 w-5 text-lavender" />,
      endurance: <Activity className="h-5 w-5 text-lavender" />,
      agility: <LineChart className="h-5 w-5 text-lavender" />,
      recovery: <Heart className="h-5 w-5 text-lavender" />,
      overall: <LineChart className="h-5 w-5 text-lavender" />,
    };
    return icons[icon] || <Activity className="h-5 w-5 text-lavender" />;
  };

  return (
    <Card className={cn(
      "glass-card bg-apts-dark text-white overflow-hidden animate-slide-in border-lavender/20 hover:border-lavender/100 transition-all duration-300", 
      className
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              {renderIcon()}
              <h3 className="text-sm font-medium text-gray-300">{title}</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{value}</p>
          </div>
          <div className={cn(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full",
            improved 
              ? "bg-performance-improved/20 text-performance-improved bg-[#4ade8020]" 
              : "bg-performance-declined/20 text-performance-declined bg-[#F8717133]"
          )}>
            {improved ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
            )}
            {Math.abs(change).toFixed(1)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
