import { Input } from "@heroui/input";

// components/data/EmployeeDisplay.tsx
interface EmployeeDisplayProps {
  employee: { _id?: string; name?: string; email?: string };
}

export default function EmployeeDisplay({ employee }: EmployeeDisplayProps) {
  return (
    <div>
      <h3 className="text-sm mb-1">Employee</h3>
      <Input
        value={employee?.email || "Data not available"}
        isReadOnly
        isDisabled
        className="hover:cursor-not-allowed"
      />
    </div>
  );
}
