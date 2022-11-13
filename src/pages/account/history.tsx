import AccountLayout from "components/Layout/AccountLayout"
import UserHistory from "components/Modules/Account/History"
import { useProtect } from "hooks/index"
import { NextPage } from "next"
import Head from "next/head"

const History: NextPage = () => {
  useProtect()

  return (
    <AccountLayout active="history">
      <Head>
        <title>Historique</title>
      </Head>
      <UserHistory />
    </AccountLayout>
  )
}

export default History
