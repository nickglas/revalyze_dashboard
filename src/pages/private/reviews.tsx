import ReviewsTable from "@/components/tables/reviews/ReviewsTable";

export default function ReviewsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Reviews</h1>
          <p className="text-gray-500 mt-1">View result after AI analysis</p>
        </div>
      </div>
      <div className="mt-4">
        <ReviewsTable />
      </div>
    </>
  );
}
