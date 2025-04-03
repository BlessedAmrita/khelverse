import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { performanceData} from "@/content/mockData";

// Enum for time periods
const TimePeriod = {
  Week: "week",
  Month: "month",
  Year: "year",
};

// Enum for chart types
const ChartType = {
  Line: "line",
  Bar: "bar",
  Radar: "radar",
};

// Filter data by time period
const getFilteredData = (period) => {
  const now = new Date();
  const cutoffDate = new Date();
  
  switch (period) {
    case TimePeriod.Week:
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case TimePeriod.Month:
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case TimePeriod.Year:
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return performanceData;
  }

  return performanceData.filter(item => new Date(item.date) >= cutoffDate);
};

const PerformanceCharts = () => {
  const [timePeriod, setTimePeriod] = useState(TimePeriod.Month);
  const [chartType, setChartType] = useState(ChartType.Line);

  // Filtered data
  const data = useMemo(() => getFilteredData(timePeriod), [timePeriod]);

  // Create data for radar chart
  const latestData = data[data.length - 1];
  const radarData = useMemo(() => [
    { subject: 'Speed', A: latestData?.speed || 0 },
    { subject: 'Strength', A: latestData?.strength || 0 },
    { subject: 'Endurance', A: latestData?.endurance || 0 },
    { subject: 'Agility', A: latestData?.agility || 0 },
    { subject: 'Recovery', A: latestData?.recovery || 0 },
  ], [latestData]);

  const renderChart = () => {
    switch (chartType) {
      case ChartType.Line:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333' }} labelStyle={{ color: '#eee' }} />
              <Legend />
              <Line type="monotone" dataKey="speed" stroke="#9b87f5" activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" dataKey="strength" stroke="#4ade80" strokeWidth={2} />
              <Line type="monotone" dataKey="endurance" stroke="#38bdf8" strokeWidth={2} />
              <Line type="monotone" dataKey="agility" stroke="#fb923c" strokeWidth={2} />
              <Line type="monotone" dataKey="recovery" stroke="#f87171" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case ChartType.Bar:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333' }} labelStyle={{ color: '#eee' }} />
              <Legend />
              <Bar dataKey="speed" fill="#9b87f5" />
              <Bar dataKey="strength" fill="#4ade80" />
              <Bar dataKey="endurance" fill="#38bdf8" />
              <Bar dataKey="agility" fill="#fb923c" />
              <Bar dataKey="recovery" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        );
      case ChartType.Radar:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="subject" stroke="#888" />
              <PolarRadiusAxis stroke="#888" />
              <Radar name="Performance" dataKey="A" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.4} />
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333' }} labelStyle={{ color: '#eee' }} />
            </RadarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="glass-card bg-apts-dark text-white border-lavender/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance Metrics</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <ToggleGroup type="single" value={timePeriod} onValueChange={setTimePeriod} className="justify-start">
          <ToggleGroupItem value={TimePeriod.Week} aria-label="Weekly view" className="data-[state=off]:bg-apts-dark data-[state=off]:text-white data-[state=on]:bg-purple-dark data-[state=on]:text-lavender-100">
          Week
          </ToggleGroupItem>
<ToggleGroupItem 
  value={TimePeriod.Month} 
  aria-label="Monthly view"  
  className="data-[state=off]:bg-apts-dark data-[state=off]:text-white data-[state=on]:bg-purple-dark data-[state=on]:text-lavender-100"
>
  Month
</ToggleGroupItem>
<ToggleGroupItem 
  value={TimePeriod.Year} 
  aria-label="Yearly view"  
  className="data-[state=off]:bg-apts-dark data-[state=off]:text-white data-[state=on]:bg-purple-dark data-[state=on]:text-lavender-100"
>
  Year
</ToggleGroupItem></ToggleGroup>
          
          <ToggleGroup type="single" value={chartType} onValueChange={setChartType} className="justify-start">
            <ToggleGroupItem value={ChartType.Line} aria-label="Line chart" className="data-[state=off]:bg-apts-dark data-[state=off]:text-white data-[state=on]:bg-purple-dark data-[state=on]:text-lavender-100">Line</ToggleGroupItem>
            <ToggleGroupItem value={ChartType.Bar} aria-label="Bar chart" className="data-[state=off]:bg-apts-dark data-[state=off]:text-white data-[state=on]:bg-purple-dark data-[state=on]:text-lavender-100">Bar</ToggleGroupItem>
            <ToggleGroupItem value={ChartType.Radar} aria-label="Radar chart" className="data-[state=off]:bg-apts-dark data-[state=off]:text-white data-[state=on]:bg-purple-dark data-[state=on]:text-lavender-100">Radar</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default PerformanceCharts;
