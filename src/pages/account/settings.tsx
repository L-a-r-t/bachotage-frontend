import AccountLayout from "components/Layout/AccountLayout"
import WIP from "components/UI/WIP"
import { useProtect } from "hooks"
import { NextPage } from "next"
import Head from "next/head"

const Settings: NextPage = () => {
  useProtect()

  return (
    <AccountLayout active="settings">
      <Head>
        <title>Préférences</title>
      </Head>
      <div className="w-48 mx-auto mt-24">
        <WIP />
      </div>
      <p className="font-bold text-center">En cours de construction</p>
    </AccountLayout>
  )
}

export default Settings
