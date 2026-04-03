import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface FixedExpense {
  name: string;
  emoji: string;
  amount: number;
}

interface Props {
  expenses: FixedExpense[];
  onUpdate: (expenses: FixedExpense[]) => void;
  editMode: boolean;
}

const FixedExpenses = ({ expenses, onUpdate, editMode }: Props) => {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("💰");
  const [newAmount, setNewAmount] = useState("");

  const handleChange = (index: number, value: string) => {
    const updated = [...expenses];
    updated[index] = { ...updated[index], amount: Number(value) || 0 };
    onUpdate(updated);
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    onUpdate([...expenses, { name: newName.trim(), emoji: newEmoji || "💰", amount: Number(newAmount) || 0 }]);
    setNewName("");
    setNewEmoji("💰");
    setNewAmount("");
    setShowAdd(false);
  };

  const handleRemove = (index: number) => {
    const updated = expenses.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  return (
    <Card className="overflow-visible">
      <CardHeader className="pb-3 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-base sm:text-lg">📌 Fixed Expenses</CardTitle>
          {editMode && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setShowAdd(!showAdd)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-2 sm:px-6">
        {editMode && showAdd && (
          <div className="flex flex-col gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
            <div className="flex gap-2">
              <Input
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                className="w-12 h-8 text-center text-sm"
                placeholder="😀"
              />
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 h-8 text-sm"
                placeholder="Expense name"
              />
              <Input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-20 h-8 text-right text-sm"
                placeholder="₹0"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button size="sm" className="h-7 text-xs" onClick={handleAdd}>Add</Button>
            </div>
          </div>
        )}

        {expenses.map((expense, i) => (
          <div key={`${expense.name}-${i}`} className="flex items-center justify-between gap-2 rounded-lg bg-secondary/50 px-3 py-2">
            <span className="text-xs sm:text-sm font-medium truncate">
              {expense.emoji} {expense.name}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {editMode ? (
                <>
                  <Input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => handleChange(i, e.target.value)}
                    className="w-20 sm:w-24 h-8 text-right text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(i)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </>
              ) : (
                <span className="text-xs sm:text-sm font-semibold tabular-nums">₹{expense.amount.toLocaleString("en-IN")}</span>
              )}
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2.5 mt-3">
          <span className="text-xs sm:text-sm font-semibold">Total Fixed</span>
          <span className="font-display font-bold text-sm sm:text-base text-primary tabular-nums">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FixedExpenses;
