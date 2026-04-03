import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  salary: number;
  onSalaryChange?: (val: number) => void;
  fixedTotal: number;
  foodBudget: number;
  travelBudget: number;
  foodSpent: number;
  travelSpent: number;
  otherSpent: number;
}

const SummaryCards = ({ salary, onSalaryChange, fixedTotal, foodBudget, travelBudget, foodSpent, travelSpent, otherSpent }: Props) => {
  const savings = salary - fixedTotal;
  const foodLeft = foodBudget - foodSpent;
  const travelLeft = travelBudget - travelSpent;
  const savingsLeft = savings - otherSpent;

  const salaryCard = (
    <Card key="salary">
      <CardContent className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">🪙 Salary</p>
        {onSalaryChange ? (
          <Input
            type="number"
            value={salary}
            onChange={(e) => onSalaryChange(Number(e.target.value) || 0)}
            className="font-display font-bold text-lg sm:text-xl h-8 px-1 tabular-nums"
          />
        ) : (
          <p className="font-display font-bold text-lg sm:text-xl tabular-nums text-foreground">
            ₹{salary.toLocaleString("en-IN")}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const cards = [
    { label: "📌 Fixed", value: fixedTotal, sub: "", color: "text-muted-foreground", warn: false },
    { label: "🍔 Food", value: foodLeft, sub: `₹${foodSpent} / ₹${foodBudget}`, color: foodLeft < 0 ? "text-destructive" : "text-success", warn: foodLeft < 0 },
    { label: "🚗 Travel", value: travelLeft, sub: `₹${travelSpent} / ₹${travelBudget}`, color: travelLeft < 0 ? "text-destructive" : "text-success", warn: travelLeft < 0 },
    { label: "💰 Savings", value: savingsLeft, sub: otherSpent > 0 ? `₹${otherSpent} other` : "Untouched ✅", color: savingsLeft < savings ? "text-warning" : "text-success", warn: savingsLeft < 0 },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
      {salaryCard}
      {cards.map((c) => (
        <Card key={c.label} className={`${c.warn ? "border-destructive/40 bg-destructive/5" : ""} ${c.label === "💰 Savings" ? "col-span-2 sm:col-span-1" : ""}`}>
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">{c.label}</p>
            <p className={`font-display font-bold text-lg sm:text-xl tabular-nums ${c.color}`}>
              ₹{Math.abs(c.value).toLocaleString("en-IN")}
            </p>
            {c.sub && <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">{c.sub}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
