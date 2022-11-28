import WithHeader from "components/Layout/WithHeader"
import { NextPage } from "next"
import Head from "next/head"

const CGU: NextPage = () => {
  return (
    <WithHeader>
      <Head>
        <title>Politique de confidentialité</title>
      </Head>
      <div className="responsiveLayout h-fit-screen px-4 gap-2">
        <h1 className="text-3xl font-bold text-center">
          Politique de confidentialité
        </h1>
        <p>
          {
            "QOAT utilise des cookies pour stocker vos préférences (comme par exemple le fait que vous acceptiez ou non les cookies tiers) et des cookies tiers à des fins analytiques. La plateforme n'utilise pas de cookies à des fins publicitaires."
          }
        </p>
        <p>
          {
            "Les cookies tiers sont émis par Google et sont utilisés par son service Google Analytics de manière anonymisée à des fins statistiques qui aident à l'amélioration de la plateforme. Vous êtes libre de ne pas accepter l'usage de cookies tiers."
          }
        </p>
        <p>
          {
            "Concernant vos données stockées, la plateforme stocke et est la seule à avoir accès à vos données qui incluent votre nom et prénom, votre email et votre activité sur la plateforme (historique de tentatives, etc.). Si vous en avez défini un, votre mot de passe est crypté et est inaccessible même pour la plateforme."
          }
        </p>
      </div>
    </WithHeader>
  )
}

export default CGU
