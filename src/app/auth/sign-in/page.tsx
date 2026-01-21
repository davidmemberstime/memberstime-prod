import SiteHeader from "@/components/SiteHeader";
import { signIn } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function SignInPage() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-3xl font-semibold">Sign in</h1>

        <form
          action={signIn}
          className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
