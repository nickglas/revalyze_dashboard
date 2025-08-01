import ExternalContactsTable from "@/components/tables/externalContacts/ExternalContactsTable";

export default function ExternalContactsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Contacts</h1>
          <p className="text-gray-500 mt-1">
            Manage all contacts for a given company
          </p>
        </div>
      </div>
      <div className="mt-4">
        <ExternalContactsTable />
      </div>
    </>
  );
}
