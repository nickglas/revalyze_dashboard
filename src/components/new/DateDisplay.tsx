import { Input } from "@heroui/input";
import { format } from "date-fns";

interface DateDisplayProps {
  date?: Date | string;
  label?: string;
}

export default function DateDisplay({ date, label }: DateDisplayProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const value = dateObj ? format(dateObj, "PPP") : "Data not available";

  return (
    <div>
      <h3 className="text-sm mb-1">{label || "Date"}</h3>
      <Input value={value} isDisabled isReadOnly />
    </div>
  );
}
