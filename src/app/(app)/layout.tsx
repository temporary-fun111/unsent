import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF7FB]">
      <div className="mx-auto max-w-2xl px-4 py-4">
        <nav className="mb-4 flex items-center justify-between rounded-3xl bg-white px-5 py-4 shadow">
          <Link href="/vault" className="text-lg font-extrabold text-[#FF4DA6]">
            Unsent
          </Link>
          <div className="flex gap-2">
            <Link
              href="/vault"
              className="rounded-2xl border border-[#F3B6D3] bg-[#FFF7FB] px-3 py-2 text-sm font-semibold text-[#FF4DA6]"
            >
              Vault
            </Link>
            <Link
              href="/write"
              className="rounded-2xl bg-[#FF4DA6] px-3 py-2 text-sm font-semibold text-white hover:opacity-90 transition"
            >
              Write
            </Link>
            <Link
              href="/settings"
              className="rounded-2xl border border-[#F3B6D3] bg-[#FFF7FB] px-3 py-2 text-sm font-semibold text-[#FF4DA6]"
            >
              Settings
            </Link>
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
}
