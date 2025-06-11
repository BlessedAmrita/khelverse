import ProgressSummary from "./ProgressSummary";
import PerformanceCharts from "./PerformanceCharts";
import PerformanceInsights from "./PerformanceInsights";
import GoalTracker from "./GoalTracker";
import DataEntryForm from "./DataEntryForm";
import FeatureHero from "@/components/shared/FeatureHero";

const EvaluationMain = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="">
        {/* <DashboardHeader /> */}
        <FeatureHero title={"Performance Tracking"}/>
        
        <div
    className="min-h-screen bg-repeat bg-left-top"
    style={{ backgroundImage: "url('https://res.cloudinary.com/dgj1gzq0l/image/upload/v1747821491/new_bg_bz1uqj.svg')" }}
  >
    <div className="min-h-screen bg-black/50 mx-3">
        <div className="mb-6 mt-4 bg-transparent">
          <ProgressSummary />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <PerformanceCharts />
          <DataEntryForm />

          </div>
          <div className="lg:col-span-1 space-y-6">
            <PerformanceInsights />
            <GoalTracker />
          </div>
        </div>
        </div>
        </div>

        
      </div>
    </div>
  );
};

export default EvaluationMain;
