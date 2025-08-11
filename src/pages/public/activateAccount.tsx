import { Form, Input, Button } from "@heroui/react";
import { toast } from "react-toastify";
import api from "@/util/axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function ActivateAccountPage() {
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await api.get(`/api/v1/auth/activate-tokens/${token}`);
        if (!res || res.data.valid === false) {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      }
    };
    if (token) validateToken();
  }, [token, navigate]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeat_password") as string;

    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    if (password !== repeatPassword) {
      setPasswordError("Passwords do not match.");
      return;
    } else {
      setPasswordError("");
    }

    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/v1/auth/activate", { token, password });
      toast.success("Account activated successfully.");
      setSubmitted(true);
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Activation failed.");
    } finally {
      setLoading(false);
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

        <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-closed-linear"
                  />
                ) : (
                  <Icon
                    className="pointer-events-none text-2xl text-default-400"
                    icon="solar:eye-bold"
                  />
                )}
              </button>
            }
          />

          <div className="flex w-full flex-col mb-4">
            <Input
              isRequired
              label="Repeat password"
              name="repeat_password"
              placeholder="Confirm your password"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
            />
            {passwordError && (
              <p className="text-sm text-red-500 mt-1 ml-1">{passwordError}</p>
            )}
          </div>

          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={loading}
            isDisabled={submitted}
          >
            Activate Account
          </Button>
        </Form>
      </div>
    </div>
  );
}
