import { Form, Input, Button } from "@heroui/react";
import { toast } from "react-toastify";
import api from "@/util/axios"; // your axios instance
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      await api.post("/api/v1/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Reset instructions sent to your email.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error sending reset email.");
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Request password reset</h1>
          <p className="text-small text-default-500">
            Please provide your email address to request a password reset
          </p>
        </div>

        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />

          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={true}
          >
            Request password reset
          </Button>
        </Form>
      </div>
    </div>
  );
}
