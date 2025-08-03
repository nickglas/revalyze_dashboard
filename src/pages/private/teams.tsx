// src/pages/teams/index.tsx
import TeamsTable from "@/components/tables/teams/teamsTable";

export default function TeamsPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Teams</h1>
          <p className="text-gray-500 mt-1">
            Organize employees into teams for better performance tracking
          </p>
        </div>
      </div>
      <div className="mt-4">
        <TeamsTable />
      </div>
    </>
  );
}
