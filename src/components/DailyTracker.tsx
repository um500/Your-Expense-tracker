import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface DayEntry {
  food: number;
  travel: number;
  other: number;
  notes: string;
}

interface Props {
  data: DayEntry[];
  onUpdate: (data: DayEntry[]) => void;
  editMode: boolean;
}

const DailyTracker = ({ data, onUpdate, editMode }: Props) => {
  const handleChange = (day: number, field: keyof DayEntry, value: string) => {
    const updated = [...data];
    if (field === "notes") {
      updated[day] = { ...updated[day], notes: value };
    } else {
      updated[day] = { ...updated[day], [field]: Number(value) || 0 };
    }
    onUpdate(updated);
  };

  const dayTotal = (d: DayEntry) => d.food + d.travel + d.other;
  const grandTotal = data.reduce((s, d) => s + dayTotal(d), 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-base sm:text-lg">📅 Daily Tracker</CardTitle>
          <span className="text-xs sm:text-sm font-semibold text-primary tabular-nums">
            Total: ₹{grandTotal.toLocaleString("en-IN")}
          </span>
        </div>
      </CardHeader>

      {/* Desktop table view */}
      <CardContent className="p-0 overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/40">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Day</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">🍔 Food</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">🚗 Travel</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">📦 Other</th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">Total</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground min-w-[120px]">📝 Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, i) => {
              const total = dayTotal(entry);
              const hasData = total > 0;
              return (
                <tr
                  key={i}
                  className={`border-b transition-colors ${hasData ? "bg-card" : "bg-secondary/20"} ${total > 1000 ? "bg-warning/5" : ""}`}
                >
                  <td className="px-3 py-1.5 font-medium text-muted-foreground">Day {i + 1}</td>
                  {(["food", "travel", "other"] as const).map((field) => (
                    <td key={field} className="px-3 py-1.5 text-right">
                      {editMode ? (
                        <Input
                          type="number"
                          value={entry[field] || ""}
                          onChange={(e) => handleChange(i, field, e.target.value)}
                          className="w-20 h-7 text-right text-xs ml-auto"
                          placeholder="0"
                        />
                      ) : (
                        <span className="tabular-nums">{entry[field] ? `₹${entry[field]}` : "—"}</span>
                      )}
                    </td>
                  ))}
                  <td className={`px-3 py-1.5 text-right font-semibold tabular-nums ${total > 1000 ? "text-warning" : ""}`}>
                    {total > 0 ? `₹${total}` : "—"}
                  </td>
                  <td className="px-3 py-1.5">
                    {editMode ? (
                      <Input
                        value={entry.notes}
                        onChange={(e) => handleChange(i, "notes", e.target.value)}
                        className="h-7 text-xs min-w-[100px]"
                        placeholder="Notes..."
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">{entry.notes || "—"}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>

      {/* Mobile card view */}
      <CardContent className="p-2 space-y-1.5 md:hidden">
        {data.map((entry, i) => {
          const total = dayTotal(entry);
          const hasData = total > 0;

          if (!editMode && !hasData) {
            return (
              <div key={i} className="flex items-center justify-between rounded-md bg-secondary/20 px-3 py-1.5">
                <span className="text-xs text-muted-foreground">Day {i + 1}</span>
                <span className="text-xs text-muted-foreground">—</span>
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`rounded-lg border p-3 space-y-2 ${hasData ? "bg-card" : "bg-secondary/20"} ${total > 1000 ? "border-warning/40" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Day {i + 1}</span>
                <span className={`text-sm font-bold tabular-nums ${total > 1000 ? "text-warning" : total > 0 ? "text-primary" : "text-muted-foreground"}`}>
                  {total > 0 ? `₹${total}` : "—"}
                </span>
              </div>
              {editMode ? (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {(["food", "travel", "other"] as const).map((field) => (
                      <div key={field} className="space-y-1">
                        <label className="text-[10px] text-muted-foreground uppercase">
                          {field === "food" ? "🍔" : field === "travel" ? "🚗" : "📦"} {field}
                        </label>
                        <Input
                          type="number"
                          value={entry[field] || ""}
                          onChange={(e) => handleChange(i, field, e.target.value)}
                          className="h-8 text-xs"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                  <Input
                    value={entry.notes}
                    onChange={(e) => handleChange(i, "notes", e.target.value)}
                    className="h-8 text-xs"
                    placeholder="📝 Notes..."
                  />
                </>
              ) : (
                <div className="flex gap-3 text-xs text-muted-foreground flex-wrap">
                  {entry.food > 0 && <span>🍔 ₹{entry.food}</span>}
                  {entry.travel > 0 && <span>🚗 ₹{entry.travel}</span>}
                  {entry.other > 0 && <span>📦 ₹{entry.other}</span>}
                  {entry.notes && <span className="ml-auto truncate">📝 {entry.notes}</span>}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DailyTracker;
