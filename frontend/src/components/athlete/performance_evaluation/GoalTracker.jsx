import { Card, CardContent } from "@/components/ui/card";

export default function GoalTracker({ goals }) {
  return (
    <>
      {goals.monthly && (
        <Card className="p-4">
          <CardContent>
            <strong>📅 Monthly Goal:</strong> {goals.monthly} km
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden mt-2">
              <div
                className="bg-green-500 text-white text-center py-1"
                style={{ width: `${goals.monthlyProgress}%` }}
              >
                {goals.monthlyProgress}%
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {goals.weekly && (
        <Card className="p-4">
          <CardContent>
            <strong>🗓️ Weekly Goal:</strong> {goals.weekly} km
            <div className="w-full bg-gray-200 rounded-lg overflow-hidden mt-2">
              <div
                className="bg-blue-500 text-white text-center py-1"
                style={{ width: `${goals.weeklyProgress}%` }}
              >
                {goals.weeklyProgress}%
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
