import { Form, Input, Button } from "@heroui/react";
import { toast } from "react-toastify";
import api from "@/util/axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  //try to get the token from the url, if not found, redirect to login
  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    const validateToken = async () => {
      try {
        const result = await api.get(`/api/v1/reset-tokens/${token}`);

        if (!result || result.data.valid === false) {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeat_password") as string;

    if (password !== repeatPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/v1/auth/reset-password", {
        token,
        newPassword: password,
      });

      toast.success("Your password has been reset successfully.");
      setSubmitted(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <div className="flex flex-col gap-1">
          <h1 className="text-large font-medium">Reset password</h1>
          <p className="text-small text-default-500">
            Please provide your new password for your Revalyze account
          </p>
        </div>

        <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
            label="Repeat password"
            name="repeat_password"
            placeholder="Confirm your password"
            type="password"
            variant="bordered"
          />

          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={loading}
            isDisabled={submitted}
          >
            Reset Password
          </Button>
        </Form>
      </div>
    </div>
  );
}
