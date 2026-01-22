import SiteHeader from "@/components/SiteHeader";
import { signUp } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SignUpPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error;

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-3xl font-semibold">Sign up</h1>

        <form
          action={signUp}
          className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div>
            <label className="text-sm text-white/80">Email</label>
            <input
              name="email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b2a1f] px-4 py-3"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Password</label>
            <input
              name="password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b2a1f] px-4 py-3"
              type="password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#c58a3a] px-4 py-3 font-semibold text-[#0b2a1f] hover:brightness-110"
          >
            Create account
          </button>

          {error && <p className="text-sm text-red-300">{error}</p>}
        </form>
      </div>
    </main>
  );
}
