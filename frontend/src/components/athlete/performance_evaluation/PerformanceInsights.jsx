import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, TrendingDown, Info, ThumbsUp } from "lucide-react";

// Assuming insightsList is coming from a mock data file
import { insightsList } from "@/content/mockData"; 

const PerformanceInsights = () => {
  return (
    <Card className="glass-card bg-apts-dark text-white border-lavender/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Insights</CardTitle>
        <Lightbulb className="h-5 w-5 text-lavender" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insightsList.map((insight, index) => {
            // Determine icon based on insight content
            let Icon = Info;
            let iconColor = "text-lavender";
            
            if (insight.includes("improved") || insight.includes("impressive") || insight.includes("upward")) {
              Icon = TrendingUp;
              iconColor = "text-green-500";
            } else if (insight.includes("declined") || insight.includes("decreasing")) {
              Icon = TrendingDown;
              iconColor = "text-red-500";
            } else if (insight.includes("maintain")) {
              Icon = ThumbsUp;
              iconColor = "text-lavender";
            }
            
            return (
              <div 
                key={index} 
                className="flex gap-3 p-3 rounded-lg bg-[#222222] animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`mt-0.5 ${iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm text-gray-300">{insight}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceInsights;
