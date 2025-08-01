import TranscriptsTable from "@/components/tables/transcripts/transcriptTable";

export default function TranscriptsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Transcripts</h1>
          <p className="text-gray-500 mt-1">
            Upload and manage transcripts from employees or other traffic
          </p>
        </div>
      </div>
      <div className="mt-4">
        <TranscriptsTable />
      </div>
    </>
  );
}
