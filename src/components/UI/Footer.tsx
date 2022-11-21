import Link from "next/link"

export default function Footer() {
  return (
    <div className="w-full py-3 border-t border-slate-200 flex justify-center flex-wrap gap-8">
      <p>© 2022 - Théo Lartigau</p>
      <Link href="/about">
        <a>À propos</a>
      </Link>
    </div>
  )
}
