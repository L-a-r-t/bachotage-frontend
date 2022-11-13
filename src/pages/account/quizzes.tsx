import { Tab } from "@headlessui/react"
import AccountLayout from "components/Layout/AccountLayout"
import Drafts from "components/Modules/Account/Drafts"
import Published from "components/Modules/Account/Published"
import Saved from "components/Modules/Account/Saved"
import { useProtect } from "hooks/index"
import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { Fragment } from "react"

const MyQuizzes: NextPage<Props> = ({ tab }) => {
  useProtect()

  const router = useRouter()

  const tabs = ["Enregistré", "Publié", "Brouillons"]

  return (
    <AccountLayout active={"quizzes"}>
      <Head>
        <title>Mes quiz</title>
      </Head>
      <Tab.Group defaultIndex={tab || 0} as={Fragment}>
        <Tab.List className="flex justify-center gap-4">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className="py-1 px-2 font-bold rounded text-main 
                ui-selected:bg-main ui-selected:text-white"
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels as={Fragment}>
          <Tab.Panel className="flex flex-col gap-4">
            <Saved />
          </Tab.Panel>
          <Tab.Panel className="flex flex-col gap-4">
            <Published />
          </Tab.Panel>
          <Tab.Panel className="flex flex-col gap-4">
            <Drafts />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </AccountLayout>
  )
}

export default MyQuizzes

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const tab = context.query.tab as number | undefined

  return {
    props: {
      tab: tab ?? null,
    },
  }
}

type Props = {
  tab: number | null
}
