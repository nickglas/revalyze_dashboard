import UsersTable from "@/components/tables/users/userTable";

export default function TestModal() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Manage users</h1>
      </div>
      <div className="mt-4">
        <UsersTable />
      </div>
    </>
  );
}
