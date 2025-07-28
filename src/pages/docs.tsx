import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import api from "@/util/axios";
import { useEffect } from "react";

export default function DocsPage() {
  useEffect(() => {
    const load = async () => {
      const response = await api.get("http://localhost:4500/api/v1/auth/");
    };
    load();
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Docs</h1>
        </div>
      </section>
    </DefaultLayout>
  );
}
