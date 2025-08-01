import ReviewConfigsTable from "@/components/tables/reviewConfig/ReviewConfigsTable";

export default function ReviewConfigsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Review Configurations</h1>
          <p className="text-gray-500 mt-1">
            Configure how AI analyzes and scores conversations
          </p>
        </div>
      </div>
      <div className="mt-4">
        <ReviewConfigsTable />
      </div>
    </>
  );
}
