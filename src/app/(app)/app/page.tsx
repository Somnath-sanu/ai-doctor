import { HomeView } from "@/src/modules/home/ui/view";
import { requireCurrentUser } from "@/src/lib/auth";

export default async function PatientDashboardPage() {
  await requireCurrentUser();

  return <HomeView />;
}
