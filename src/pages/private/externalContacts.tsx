import ExternalContactsTable from "@/components/tables/externalContacts/ExternalContactsTable";

export default function ExternalContactsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">External Contacts</h1>
      </div>
      <div className="mt-4">
        <ExternalContactsTable />
      </div>
    </>
  );
}
