import { Outlet, useNavigate, redirect } from "react-router";
import { AuthLayout } from "~/components/layout/AuthLayout";
import { useAuth } from "~/hooks/useAuth";

export default function AuthLayoutRoute() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    navigate("/login");
    return null;
  }

  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}

export async function loader({ request }: { request: Request }) {
  const cookie = request.headers.get("cookie") || "";
  const hasToken = cookie.includes("authToken=");
  if (!hasToken) {
    throw redirect("/login");
  }
  return null;
}
