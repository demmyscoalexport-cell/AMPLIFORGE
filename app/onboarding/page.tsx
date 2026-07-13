import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const greetingName = user?.firstName ?? user?.username ?? "Creator";

  return <OnboardingFlow greetingName={greetingName} />;
}
