import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";

const DataEntryForm = () => {
  return (
    <Card className="glass-card border-lavender/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add Performance Data</CardTitle>
        <Plus className="h-5 w-5 text-lavender" />
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Input
                id="date"
                type="date"
                className="bg-secondary/50 border-lavender/30 focus:border-lavender"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="activity" className="text-sm font-medium">
                Activity Type
              </label>
              <select
                id="activity"
                className="flex h-10 w-full rounded-md border border-lavender/30 bg-secondary/50 px-3 py-2 text-sm focus:border-lavender focus:outline-none"
              >
                <option value="running">Running</option>
                <option value="weightlifting">Weightlifting</option>
                <option value="swimming">Swimming</option>
                <option value="cycling">Cycling</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Speed", "Strength", "Endurance", "Agility", "Recovery"].map(
              (metric) => (
                <div key={metric} className="space-y-2">
                  <label htmlFor={metric.toLowerCase()} className="text-sm font-medium">
                    {metric} (1-100)
                  </label>
                  <Input
                    id={metric.toLowerCase()}
                    type="number"
                    min="1"
                    max="100"
                    className="bg-secondary/50 border-lavender/30 focus:border-lavender"
                  />
                </div>
              )
            )}
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <Input
                id="notes"
                type="text"
                className="bg-secondary/50 border-lavender/30 focus:border-lavender"
                placeholder="Optional notes"
              />
            </div>
          </div>

          <Button className="w-full bg-lavender-300 hover:bg-lavender-500 text-white">
            <Save className="mr-2 h-4 w-4" />
            Save Performance Data
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DataEntryForm;
