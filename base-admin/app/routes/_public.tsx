import { Outlet } from "react-router";
import { PublicLayout } from "~/components/layout/PublicLayout";

export default function PublicLayoutRoute() {
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
}
