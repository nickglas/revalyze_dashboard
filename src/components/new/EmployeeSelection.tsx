// components/forms/EmployeeSelection.tsx
import SearchUsers from "@/components/data/users/searchUsers";
import { User } from "@/models/api/user.model";

interface EmployeeSelectionProps {
  value?: User;
  onChange: (employeeId: string) => void;
  error?: string;
  required?: boolean;
}

export default function EmployeeSelection({
  value,
  onChange,
  error,
  required = true,
}: EmployeeSelectionProps) {
  return (
    <div>
      <SearchUsers
        required={required}
        label="Search for employee"
        onChange={(user) => onChange(user?._id || "")}
        value={value}
      />
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
}
