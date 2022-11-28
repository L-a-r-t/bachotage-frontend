import Link from "next/link"

export default function Footer() {
  return (
    <div className="w-full py-3 border-t border-slate-200 flex flex-col items-center sm:flex-row sm:justify-center sm:flex-wrap gap-2 sm:gap-8">
      <p>© 2022 - Théo Lartigau</p>
      <Link href="/about">
        <a>À propos</a>
      </Link>
      <Link href="/cgu">
        <a>Conditions d{"'"}utilisation</a>
      </Link>
      <Link href="/privacy-policy">
        <a>Politique de confidentialtié</a>
      </Link>
    </div>
  )
}
