import { redirect } from "next/navigation";

export default function LegacyDoctorsRedirect() {
  redirect("/app/doctors");
}
