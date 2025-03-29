"use client";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Chart from "chart.js/auto";
import ActivityCard from "./ActivityCard";
import GoalTracker from "./GoalTracker";
export default function EvaluationMain() {
  const [stats, setStats] = useState(null);
  const [goals, setGoals] = useState(null);
  const [activities, setActivities] = useState([]);
  
  const distanceChartRef = useRef(null);
  const timeChartRef = useRef(null);
  const caloriesChartRef = useRef(null);

  useEffect(() => {
    // Fetch data from the Next.js API route
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats/stats.js");
        const data = await response.json();
        
        if (data.error) {
          console.error(data.error);
        } else {
          setStats(data.stats);
          setGoals(data.goals);
          setActivities(data.activities);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const charts = [];

    if (stats?.labels?.length) {
      const createChart = (ref, label, data, color) => {
        if (ref.current) {
          const ctx = ref.current.getContext("2d");
          charts.push(
            new Chart(ctx, {
              type: "line",
              data: {
                labels: stats.labels,
                datasets: [
                  {
                    label,
                    data,
                    borderColor: color,
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                  },
                ],
              },
              options: { responsive: true, scales: { y: { beginAtZero: true } } },
            })
          );
        }
      };

      createChart(distanceChartRef, "Distance (km)", stats.distances, "blue");
      createChart(timeChartRef, "Duration (min)", stats.durations, "green");
      createChart(caloriesChartRef, "Calories Burned", stats.calories, "red");
    }

    return () => charts.forEach((chart) => chart.destroy());
  }, [stats]);

  if (!stats) {
    return (
      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold">🏆 Athlete Activity Dashboard</h1>
        <p>Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">🏆 Athlete Activity Dashboard</h1>

      {/* Navigation Links */}
      <div className="flex gap-4">
        <Button variant="link" asChild>
          <a href="/profile">👤 View Profile</a>
        </Button>
        <Button variant="link" asChild>
          <a href="/activities">🔄 Sync Activities</a>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[{
            label: "Total Activities", value: stats.totalActivities
          }, {
            label: "Total Distance", value: `${stats.totalDistance.toFixed(2)} km`
          }, {
            label: "Total Duration", value: `${(stats.totalDuration / 60).toFixed(1)} hrs`
          }, {
            label: "Avg Speed", value: `${stats.avgSpeed} m/s`
          }, {
            label: "Avg Heart Rate", value: `${stats.avgHR} bpm`
          }
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center font-semibold">
              {stat.label}: {stat.value}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Goal Form */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>🚀 Set Your Distance Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="POST" action="/set-goal" className="space-y-4">
            <div>
              <label>Weekly Goal (km):</label>
              <Input type="number" step="0.1" name="weekly" required />
            </div>
            <div>
              <label>Monthly Goal (km) (optional):</label>
              <Input type="number" step="0.1" name="monthly" />
            </div>
            <Button type="submit" className="bg-green-600">✅ Save Goals</Button>
          </form>
        </CardContent>
      </Card>

      {/* Goal Tracking */}
      {goals && <GoalTracker goals={goals} />}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <canvas ref={distanceChartRef} className="bg-white p-4 rounded-xl shadow-md"></canvas>
        <canvas ref={timeChartRef} className="bg-white p-4 rounded-xl shadow-md"></canvas>
        <canvas ref={caloriesChartRef} className="bg-white p-4 rounded-xl shadow-md"></canvas>
      </div>

      {/* Recent Activities */}
      <h2 className="text-xl font-semibold">Recent Activities</h2>
      <div className="grid gap-4">
        {activities.map((act, i) => <ActivityCard key={i} activity={act} />)}
      </div>
    </div>
  );
}
