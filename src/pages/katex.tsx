import WithHeader from "components/Layout/WithHeader"
import { NextPage } from "next"
import { useEffect, useRef, useState } from "react"
import Latex from "react-latex"
import { createRoot, Root } from "react-dom/client"
import Head from "next/head"

let root: Root

const renderLatex = () => {
  if (window === undefined) return
  if (root === undefined)
    root = createRoot(document.querySelector(".latexRoot")!)
  root.render(
    <Latex throwOnError={false} errorColor={"white"} displayMode={true}>
      {window
        .getComputedStyle(
          document.querySelector(".latexValue") ?? document.documentElement,
          ":after"
        )
        .getPropertyValue("content")
        .replace(/"/g, "")
        .replace(/(\\\\)/g, "\\")}
    </Latex>
  )
}

const KaTeX: NextPage = () => {
  const katexRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      renderLatex()
    })

    return () => clearInterval(timer)
  }, [])

  return (
    <WithHeader>
      <Head>
        <title>KaTeX</title>
      </Head>
      <div className="h-screen md:h-fit-screen bg-main flex flex-col justify-center">
        <h1 className="text-center text-white text-3xl sm:text-4xl font-bold md:-mt-12">
          Qoat utilise le{" "}
          <a href="https://katex.org" target="_blank" rel="noreferrer">
            <Latex>$$\KaTeX$$</Latex>
          </a>
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-stretch mt-12 md:items-center">
          <div className="bg-main flex justify-center items-center md:w-1/2">
            <div className="bg-white w-11/12 sm:w-10/12 py-12 px-2 sm:text-xl rounded-xl text-main flex justify-center items-center">
              <p
                ref={katexRef}
                className="after:animate-[katexDemo_10s_linear_infinite] after:text-center latexValue"
              ></p>
            </div>
          </div>
          <div className="bg-main h-60 md:w-1/2 text-3xl md:text-4xl text-white flex justify-center items-center latexRoot"></div>
        </div>
      </div>
    </WithHeader>
  )
}

export default KaTeX
