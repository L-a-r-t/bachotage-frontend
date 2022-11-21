import WithHeader from "components/Layout/WithHeader"
import { NextPage } from "next"
import Head from "next/head"
import Image from "next/image"

const About: NextPage = () => {
  return (
    <WithHeader>
      <Head>
        <title>À propos</title>
      </Head>
      <div className="responsiveLayout h-fit-screen">
        <h1 className="text-3xl font-bold text-center">À propos</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="w-full">
            <div className="w-full aspect-video relative overflow-hidden rounded">
              <Image
                src="/cest-2nd-degre.png"
                alt="Dessin de moi plus ou moins fidèle"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="text-sm text-gray-700">Image à titre indicatif</p>
          </div>
          <div>
            <p>
              QOAT est une banque de qcm créée par Théo Lartigau, actuellement
              étudiant en L3 éco-gestion qui cherche à intégrer l{"'"}ENSAE.
            </p>
            <p className="my-2">
              {"N'hésitez pas à m'ajouter sur "}
              <a
                href="https://www.linkedin.com/in/tlartigau/"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                LinkedIn
              </a>{" "}
              ou consulter mon{" "}
              <a
                href="https://github.com/L-a-r-t"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                GitHub
              </a>
              , {"c'est sans doute bon pour mon dossier."}
            </p>
            <p>
              Si vous êtes plutôt à la recherche d{"'"}un développeur web, je
              suis à votre disposition à partir de la deuxième semaine de
              janvier 2023. Vous trouverez mon contact personnel sur les liens
              ci-dessus.
            </p>
          </div>
        </div>
      </div>
    </WithHeader>
  )
}

export default About
