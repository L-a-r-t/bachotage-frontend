import WithHeader from "components/Layout/WithHeader"
import { NextPage } from "next"
import { useEffect, useRef, useState } from "react"
import Latex from "react-latex"
import { createRoot } from "react-dom/client"
import Head from "next/head"

const renderLatex = () => {
  if (window === undefined) return
  createRoot(document.querySelector(".latexRoot")!).render(
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
      <div className="h-fit-screen flex items-stretch relative">
        <h1 className="text-center text-white text-4xl absolute top-12 w-full font-bold">
          Bachotage utilise le{" "}
          <a href="https://katex.org" target="_blank" rel="noreferrer">
            <Latex>$$\KaTeX$$</Latex>
          </a>
        </h1>
        <div className="bg-main flex justify-center items-center w-1/2">
          <div className="bg-white w-10/12 py-12 px-2 text-xl rounded-xl text-main flex justify-center items-center">
            <p
              ref={katexRef}
              className="after:animate-[katexDemo_10s_linear_infinite] latexValue"
            ></p>
          </div>
        </div>
        <div className="bg-main w-1/2 text-4xl text-white flex justify-center items-center latexRoot"></div>
      </div>
    </WithHeader>
  )
}

export default KaTeX
