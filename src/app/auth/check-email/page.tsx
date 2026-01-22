import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CheckEmailPage({
  searchParams,
}: {
  searchParams?: { email?: string };
}) {
  const email = searchParams?.email;

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-3xl font-semibold">Confirm your email</h1>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80">
          <p>
            We’ve sent a confirmation link to{" "}
            <span className="font-semibold text-white">
              {email ?? "your email"}
            </span>
            .
          </p>
          <p className="mt-3">
            Please click the link in your inbox to activate your account, then
            come back and sign in.
          </p>
          <p className="mt-3 text-sm text-white/60">
            Check your spam/junk folder if you don’t see it within a minute.
          </p>

          <a
            href="/auth/sign-in"
            className="mt-6 inline-flex rounded-xl bg-[#c58a3a] px-4 py-2 text-sm font-semibold text-[#0b2a1f] hover:brightness-110"
          >
            Go to sign in
          </a>
        </div>
      </div>
    </main>
  );
}
