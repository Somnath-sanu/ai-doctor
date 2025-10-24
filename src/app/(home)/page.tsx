import { upserUser } from "@/src/modules/home/server";
import { HomeView } from "@/src/modules/home/ui/view";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    return <div>Sign in to view this page</div>;
  }

  const { firstName, lastName, emailAddresses , id } = user;
  const email = emailAddresses[0].emailAddress;
  await upserUser(firstName, lastName, email , id);

  return (
    <HomeView/>
  );
}
