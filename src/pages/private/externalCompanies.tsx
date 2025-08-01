import ExternalCompaniesTable from "@/components/tables/externalCompanies/ExternalCompaniesTable";

export default function ExternalCompaniesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">External Companies</h1>
      </div>
      <div className="mt-4">
        <ExternalCompaniesTable />
      </div>
    </>
  );
}
