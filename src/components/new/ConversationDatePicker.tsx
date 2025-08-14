// components/forms/ConversationDatePicker.tsx
import { DatePicker } from "@heroui/react";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { formatISO } from "date-fns";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
}

export default function ConversationDatePicker({
  value,
  onChange,
  error,
}: DatePickerProps) {
  const getTodayAtMidnight = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  return (
    <DatePicker
      label="Conversation Date"
      labelPlacement="outside"
      value={
        value
          ? parseDate(formatISO(value, { representation: "date" }))
          : undefined
      }
      onChange={(dateValue) => {
        if (dateValue) {
          const jsDate = dateValue.toDate(getLocalTimeZone());
          const today = getTodayAtMidnight();

          if (jsDate > today) {
            onChange(today);
            return;
          }
          onChange(jsDate);
        }
      }}
      isRequired
      isInvalid={!!error}
      errorMessage={error}
    />
  );
}
