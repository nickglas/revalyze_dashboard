import { Input } from "@heroui/input";

// components/data/CompanyContactDisplay.tsx
interface CompanyContactDisplayProps {
  company: { _id?: string | null; name?: string | null };
  contact: {
    _id?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
}

export default function CompanyContactDisplay({
  company,
  contact,
}: CompanyContactDisplayProps) {
  return (
    <div>
      <h3 className="text-sm mb-1">Company & Contact</h3>
      <div className="flex gap-4 justify-between">
        <Input
          value={company?.name || "Data not available"}
          isDisabled
          isReadOnly
        />
        <Input
          value={contact?.name || "Data not available"}
          isDisabled
          isReadOnly
        />
      </div>
    </div>
  );
}
