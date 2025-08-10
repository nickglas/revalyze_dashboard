import { useState } from "react";

import { ExternalCompany } from "@/models/api/external.company.model";
import { Contact } from "@/models/api/contact.api.model";
import SearchExternalCompany from "./searchExternalCompany";
import SearchContacts from "../contacts/searchContact";

type Props = {
  selectedCompanyId?: string;
  selectedContactId?: string;
  onChange: (values: {
    company: ExternalCompany | null;
    contact: Contact | null;
  }) => void;
};

export default function CompanyContactSelector({
  selectedCompanyId,
  selectedContactId,
  onChange,
}: Props) {
  const [selectedCompany, setSelectedCompany] =
    useState<ExternalCompany | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleCompanyChange = (id: string, company: ExternalCompany | null) => {
    setSelectedCompany(company);
    setSelectedContact(null);
    onChange({ company, contact: null });
  };

  const handleContactChange = (contact: Contact | null) => {
    setSelectedContact(contact);
    if (contact?.externalCompany) {
      setSelectedCompany(contact.externalCompany);
    }
    onChange({ company: contact?.externalCompany || selectedCompany, contact });
  };

  return (
    <div className="space-y-4">
      <SearchExternalCompany
        value={selectedCompany || undefined}
        onChange={handleCompanyChange}
        label="Company"
      />
      <SearchContacts
        value={selectedContact || undefined}
        onChange={handleContactChange}
        required={false}
        label="Contact"
        companyId={selectedCompany?._id || ""}
      />
    </div>
  );
}
