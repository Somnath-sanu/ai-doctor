import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Stethoscope, Waves, FileText } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { AIDoctorAgents } from "@/src/lib/agents";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { syncCurrentUser } from "@/src/lib/auth";

const highlights = [
  {
    title: "AI-first intake",
    description:
      "Patients start with voice-guided AI triage that captures symptoms, duration, context, and probable specialty.",
    icon: Waves,
  },
  {
    title: "Doctor validation",
    description:
      "When the AI is uncertain or risk is elevated, MEDIVA creates a doctor ticket so a human clinician can take over.",
    icon: ShieldCheck,
  },
  {
    title: "Persistent reports",
    description:
      "Each consultation becomes a structured medical record with draft summaries and final doctor-approved care plans.",
    icon: FileText,
  },
];

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    const user = await syncCurrentUser();

    redirect(user?.role === "DOCTOR" ? "/doctor" : "/app");
  }

  return (
    <main className="min-h-screen text-foreground">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-5 py-6 md:px-8 lg:px-10">
        <header className="surface-panel flex items-center justify-between rounded-[2rem] px-5 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="MEDIVA AI"
              width={40}
              height={40}
              className="size-11 rounded-2xl bg-white/75 p-1.5 dark:bg-white/10"
            />
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary">
                MEDIVA AI
              </p>
              <p className="text-xs text-muted-foreground">
                Smart doctor network for guided care
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/sign-in">Patient Sign In</Link>
            </Button>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/sign-in?redirect_url=/doctor">Doctor Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">
                Start with AI
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Hybrid AI + Doctor Workflow
            </div>

            <div className="space-y-5">
              <h1 className="text-balance max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
                Voice-first AI triage with a real doctor ready to step in.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                MEDIVA AI helps patients explain symptoms, generates structured
                clinical drafts, and routes uncertain or higher-risk cases into
                a doctor queue for validated care plans.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/sign-up">
                  Create patient account
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link href="/sign-in?redirect_url=/doctor">
                  Enter doctor workspace
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;

                return (
                  <Card key={item.title} className="border-border/60 p-5">
                    <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="mt-4 text-base font-semibold">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="overflow-hidden border-border/60 bg-[linear-gradient(160deg,color-mix(in_oklab,var(--card)_86%,transparent),color-mix(in_oklab,var(--primary)_14%,transparent))]">
            <div className="border-b border-border/60 bg-background/10 p-6">
              <p className="text-sm font-medium text-primary">How it works</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                One system, two levels of care.
              </h2>
            </div>
            <div className="space-y-6 p-6">
              <div className="surface-subtle p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-primary">
                  01
                </p>
                <h3 className="mt-2 text-xl font-semibold">Patient speaks naturally</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The AI captures symptoms, duration, and context through voice
                  or typed intake and prepares a structured draft.
                </p>
              </div>
              <div className="surface-subtle p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-primary">
                  02
                </p>
                <h3 className="mt-2 text-xl font-semibold">Risk is assessed safely</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  MEDIVA assigns specialty, urgency, and review confidence.
                  Higher-risk or uncertain cases become doctor tickets.
                </p>
              </div>
              <div className="surface-subtle p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-primary">
                  03
                </p>
                <h3 className="mt-2 text-xl font-semibold">Doctor validates the plan</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Doctors claim queue items, review AI drafts, and publish the
                  final diagnosis, medicines, tests, and follow-up guidance.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Trust & Safety
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              AI helps move faster. Doctors make treatment final.
            </h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                Draft medication ideas can be captured internally during AI
                intake, but patient-facing treatment is only finalized once a
                doctor reviews and completes the care plan.
              </p>
              <p>
                The platform is designed for multimodal growth, including future
                uploads of reports, prescriptions, and medical images in the same
                patient journey.
              </p>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AIDoctorAgents.slice(0, 6).map((doctor) => (
              <Card
                key={doctor.id}
                className="overflow-hidden border-border/60 p-0"
              >
                <Image
                  src={doctor.image}
                  alt={doctor.specialist}
                  width={400}
                  height={240}
                  className="h-36 w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Stethoscope className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                      Specialty
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold">
                    {doctor.specialist}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {doctor.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
