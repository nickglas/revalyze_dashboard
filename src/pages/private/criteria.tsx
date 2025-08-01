import CriteriaTable from "@/components/tables/criteria/CriteriaTable";

export default function CriteriaPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Evaluation Criteria</h1>
          <p className="text-gray-500 mt-1">
            Define and manage the criteria used for performance reviews
          </p>
        </div>
      </div>
      <div className="mt-4">
        <CriteriaTable />
      </div>
    </>
  );
}
