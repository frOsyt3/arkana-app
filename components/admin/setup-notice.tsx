export function SetupNotice() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl border border-[#E7ECEF] bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">Setup needed</p>
        <h1 className="mt-3 text-2xl font-bold">Connect the database</h1>
        <p className="mt-3 leading-relaxed text-[#6B7C88]">
          The admin dashboard needs a Neon PostgreSQL database. Add your connection string to{" "}
          <code className="rounded bg-[#F5F7F8] px-1.5 py-0.5 text-sm">.env.local</code>, then run the
          migrations and create the first admin account.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-xl bg-[#1F3442] p-4 text-sm leading-relaxed text-white/90">
{`DATABASE_URL="postgresql://..."

npm run db:migrate
npm run admin:create -- you@arkanacorp.id "Your Name"`}
        </pre>
      </div>
    </div>
  )
}
