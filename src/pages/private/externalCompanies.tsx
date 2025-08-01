import ExternalCompaniesTable from "@/components/tables/externalCompanies/ExternalCompaniesTable";

export default function ExternalCompaniesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">External Companies</h1>
          <p className="text-gray-500 mt-1">
            Manage companies that are related to your conversations
          </p>
        </div>
      </div>
      <div className="mt-4">
        <ExternalCompaniesTable />
      </div>
    </>
  );
}
