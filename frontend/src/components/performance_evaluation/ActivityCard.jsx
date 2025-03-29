import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivityCard({ activity }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity.name} ({activity.type})</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Date:</strong> {activity.startDate.slice(0, 10)}</p>
        <p><strong>Distance:</strong> {activity.distance.toFixed(2)} km</p>
        <p><strong>Time:</strong> {Math.floor(activity.movingTime / 60)} min</p>
        <p><strong>Calories:</strong> {activity.calories || "N/A"}</p>
        <p><strong>Avg Speed:</strong> {activity.averageSpeed?.toFixed(2) || 0} m/s</p>
        <p><strong>Heart Rate:</strong> {activity.averageHeartRate || "N/A"}</p>
      </CardContent>
    </Card>
  );
}
