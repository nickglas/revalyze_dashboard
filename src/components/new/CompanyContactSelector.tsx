// components/forms/CompanyContactSelector.tsx (enhanced)
import CompanyContactSelector from "@/components/data/externalCompany/companyContactSelector";

interface CompanyContactProps {
  companyId?: string;
  contactId?: string;
  onChange: (companyId?: string, contactId?: string) => void;
  error?: string;
}

export default function CompanyContactSelection({
  companyId,
  contactId,
  onChange,
  error,
}: CompanyContactProps) {
  return (
    <div>
      <CompanyContactSelector
        selectedCompanyId={companyId}
        selectedContactId={contactId}
        onChange={({ company, contact }) => {
          onChange(company?._id, contact?._id);
        }}
      />
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
}
