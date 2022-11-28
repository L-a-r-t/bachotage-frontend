import WithHeader from "components/Layout/WithHeader"
import { NextPage } from "next"
import Head from "next/head"

const CGU: NextPage = () => {
  return (
    <WithHeader>
      <Head>
        <title>Conditions Générales d{"'"}Utilisation</title>
      </Head>
      <div className="responsiveLayout h-fit-screen px-4 gap-2">
        <h1 className="text-3xl font-bold text-center">
          Conditions générales d{"'"}utilisation
        </h1>
        <p>
          QOAT est une banque de qcm en accès libre, à laquelle chacun peut
          contribuer. Naturellement, tous les comportements ne sont pas
          autorisés dans cet espace de création et d{"'"}échange. Les quelques
          lignes qui suivent explicitent l{"'"}accord passé entre QOAT (la
          plateforme) et vous (l{"'"}utilisateur) au moment de la création d
          {"'"}un compte.
        </p>
        <p>
          {
            "Sur les forums de discussion, l'utilisateur s'engage à ne pas publier de spam, de contenu hors-sujet ou plus généralement de contenu contrevenant à la loi et/ou aux règles de bienscéance (provocation, insultes, etc.). Il en va de même pour les quiz que l'utilisateur est susceptible de créer sur la plateforme. En cas de non-respect de ces règles, la plateforme se réserve la possibilité de supprimer le contenu mis en ligne par l'utilisateur et de bannir ce dernier en cas de manquements répétés."
          }
        </p>
        <p>
          {
            "La plateforme se réserve également le droit de suspendre le compte de l'utilisateur si elle constate - à sa propre discrétion - que ce dernier abuse de certaines fonctionnalités telles que la correction collaborative à des fins nuisibles."
          }
        </p>
        <p>
          Vous pouvez envoyer un e-mail à contact@qoat.fr pour plus de
          renseignements ou en cas de problème
        </p>
      </div>
    </WithHeader>
  )
}

export default CGU
