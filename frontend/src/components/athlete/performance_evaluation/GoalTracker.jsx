import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle, Circle } from "lucide-react";
import { goalData } from "@/content/mockData";

const GoalTracker = () => {
  console.log("Goal Data:", goalData); // Debugging line to check the data structure
  return (
    <Card className="glass-card bg-apts-dark text-white border-lavender/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Goals & Milestones</CardTitle>
        <Award className="h-5 w-5 text-lavender" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goalData.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            const isComplete = goal.target <= goal.current;
            const progressReversed = goal.unit === "min" || goal.unit === "sec" || goal.unit === "%";
            
            const calculatedProgress = progressReversed 
              ? (goal.target >= goal.current ? 100 : (goal.target / goal.current) * 100)
              : (goal.current / goal.target) * 100;
            
            const formattedProgress = Math.min(100, calculatedProgress).toFixed(0);
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {parseInt(formattedProgress) >= 100 ? (
                      <CheckCircle className="h-4 w-4 text-performance-improved" />
                    ) : (
                      <Circle className="h-4 w-4 text-lavender" />
                    )}
                    <span className="font-medium">{goal.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {formattedProgress}% complete
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-dark to-purple-middle h-full rounded-full"
                    style={{ width: `${formattedProgress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  {goal.description}: {goal.current}{goal.unit} / {goal.target}{goal.unit}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalTracker;
