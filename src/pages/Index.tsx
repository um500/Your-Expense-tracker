import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import FixedExpenses from "@/components/FixedExpenses";
import DailyTracker, { type DayEntry } from "@/components/DailyTracker";
import SummaryCards from "@/components/SummaryCards";

const DEFAULT_SALARY = 25000;

const DEFAULT_FIXED = [
  { name: "Dost", emoji: "🤝", amount: 4000 },
  { name: "Phone EMI", emoji: "📱", amount: 3500 },
  { name: "Rent", emoji: "🏠", amount: 5000 },
  { name: "Food", emoji: "🍽️", amount: 3000 },
  { name: "Travel", emoji: "🚌", amount: 1000 },
  { name: "Bhai", emoji: "👨‍👦", amount: 5000 },
];

const emptyDay = (): DayEntry => ({ food: 0, travel: 0, other: 0, notes: "" });
const DEFAULT_DAILY = Array.from({ length: 30 }, emptyDay);

const Index = () => {
  const [salary, setSalary] = useLocalStorage("et-salary", DEFAULT_SALARY);
  const [fixedExpenses, setFixedExpenses] = useLocalStorage("et-fixed", DEFAULT_FIXED);
  const [dailyData, setDailyData] = useLocalStorage("et-daily", DEFAULT_DAILY);
  const [editMode, setEditMode] = useState(false);

  const fixedTotal = fixedExpenses.reduce((s, e) => s + e.amount, 0);
  const foodBudget = fixedExpenses.find((e) => e.name === "Food")?.amount ?? 0;
  const travelBudget = fixedExpenses.find((e) => e.name === "Travel")?.amount ?? 0;
  const foodSpent = dailyData.reduce((s, d) => s + d.food, 0);
  const travelSpent = dailyData.reduce((s, d) => s + d.travel, 0);
  const otherSpent = dailyData.reduce((s, d) => s + d.other, 0);

  const handleReset = () => {
    if (window.confirm("Reset all daily data for this month?")) {
      setDailyData(DEFAULT_DAILY);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <h1 className="font-display font-bold text-base sm:text-xl">💸 Expense Tracker</h1>
          <div className="flex gap-1.5 sm:gap-2">
            <Button
              variant={editMode ? "default" : "outline"}
              size="sm"
              className="text-xs sm:text-sm h-8"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "✅ Done" : "✏️ Edit"}
            </Button>
            <Button variant="destructive" size="sm" className="text-xs sm:text-sm h-8" onClick={handleReset}>
              🔄 Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 w-full box-border">
        <SummaryCards
          salary={salary}
          onSalaryChange={editMode ? setSalary : undefined}
          fixedTotal={fixedTotal}
          foodBudget={foodBudget}
          travelBudget={travelBudget}
          foodSpent={foodSpent}
          travelSpent={travelSpent}
          otherSpent={otherSpent}
        />

        <div className="grid lg:grid-cols-[320px_1fr] gap-4 sm:gap-6 min-w-0">
          <div className="min-w-0">
            <FixedExpenses expenses={fixedExpenses} onUpdate={setFixedExpenses} editMode={editMode} />
          </div>
          <div className="min-w-0">
            <DailyTracker data={dailyData} onUpdate={setDailyData} editMode={editMode} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
