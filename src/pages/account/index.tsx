import AccountLayout from "components/Layout/AccountLayout"
import Popup from "components/UI/Popup"
import WIP from "components/UI/WIP"
import { useProtect } from "hooks"
import { NextPage } from "next"
import Head from "next/head"

const Dashboard: NextPage = () => {
  useProtect()

  return (
    <AccountLayout active="dashboard">
      <Head>
        <title>Profil</title>
      </Head>
      <div className="w-48 mx-auto mt-24">
        <WIP />
      </div>
      <p className="font-bold text-center">En cours de construction</p>
    </AccountLayout>
  )
}

export default Dashboard
