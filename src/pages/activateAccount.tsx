import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Input, Button } from "@heroui/react";
import api from "@/util/axios";
import { toast } from "react-toastify";

export default function ActivateAccountPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Activation token missing.");
      navigate("/login");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/api/v1/auth/activate", { token, password });
      toast.success("Account activated successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Activation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Activate account</h1>
          <p className="text-small text-default-500">
            Please provide a strong new password in order to activate your
            Revalyze account
          </p>
        </div>

        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            label="Password"
            name="password"
            placeholder="Enter your password"
            type="password"
            variant="bordered"
          />

          <Input
            isRequired
            label="repeat password"
            name="repeat_password"
            placeholder="Confirm your password"
            type="password"
            variant="bordered"
          />

          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={true}
          >
            Activate account
          </Button>
        </Form>
      </div>
    </div>
  );
}
