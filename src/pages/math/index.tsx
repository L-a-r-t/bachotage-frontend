import { NextPage } from "next"
import { useState } from "react"
import dayjs from "dayjs"
import { httpsCallable } from "firebase/functions"
import { functions } from "firebaseconfig/index"

const MathPage: NextPage = () => {
  const [matrix, setMatrix] = useState<number[][]>([])
  const [startTime, setStartTime] = useState(dayjs())
  const [det, setDet] = useState<number | null>(null)
  const [detTime, setDetTime] = useState([0, 0])
  const [inv, setInv] = useState<{
    det: number
    matrix: number[][] | null
  } | null>(null)
  const [invTime, setInvTime] = useState([0, 0])

  const newMatrix = (dim: number) => {
    setMatrix(generateMatrix(dim))
    setStartTime(dayjs())
    setDet(null)
    setInv(null)
  }

  const showDet = () => {
    const min = dayjs().diff(startTime, "minute")
    setDetTime([min, dayjs().diff(startTime, "second") - min * 60])
    setDet(getDet(matrix))
  }

  const showInv = () => {
    const min = dayjs().diff(startTime, "minute")
    setInvTime([min, dayjs().diff(startTime, "second") - min * 60])
    setInv(getInv(matrix))
  }

  const updateDB = async () => {
    const func = httpsCallable(functions, "updateDiscussions")
    await func()
  }

  return (
    <div className="responsiveLayout">
      <button className="button" onClick={updateDB}>
        Update database
      </button>
      <span className="flex justify-center gap-4">
        <button className="button" onClick={() => newMatrix(2)}>
          Matrice 2x2
        </button>
        <button className="button" onClick={() => newMatrix(3)}>
          Matrice 3x3
        </button>
      </span>
      {matrix.length > 0 && (
        <>
          <div
            className={`grid ${
              matrix.length == 2
                ? "grid-cols-2 grid-rows-2"
                : "grid-cols-3 grid-rows-3"
            } mx-auto`}
          >
            {matrix.map((row, rowIdx) =>
              row.map((n, colIdx) => (
                <div
                  key={`[${rowIdx},${colIdx}]`}
                  className="flex justify-center items-center w-8 h-8"
                >
                  {n}
                </div>
              ))
            )}
          </div>
          <button
            className="button bg-main-10 text-slate-700"
            onClick={showDet}
          >
            Déterminant {det && `: ${det}    (${detTime[0]}m${detTime[1]}s)`}
          </button>
          <button
            className="button bg-main-10 text-slate-700"
            onClick={showInv}
          >
            Matrice inverse {inv && !inv.matrix && `: non inversible`}{" "}
            {inv && `    (${invTime[0]}m${invTime[1]}s)`}
          </button>
          {inv?.matrix && (
            <div className="flex gap-2 justify-center">
              <div className="flex flex-col justify-center">
                <span className="w-10 h-8 border-b border-black flex justify-center items-center">
                  1
                </span>
                <span className="w-10 h-8 border-t border-black flex justify-center items-center">
                  {inv.det}
                </span>
              </div>
              <div
                className={`grid ${
                  inv.matrix.length == 2
                    ? "grid-cols-2 grid-rows-2"
                    : "grid-cols-3 grid-rows-3"
                }`}
              >
                {inv.matrix.map((row, rowIdx) =>
                  row.map((n, colIdx) => (
                    <div
                      key={`[${rowIdx},${colIdx}]`}
                      className="flex justify-center items-center w-8 h-8"
                    >
                      {n}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const generateMatrix = (
  dim: number = 3,
  min: number = -10,
  max: number = 10
) => {
  const matrix: number[][] = new Array(dim)
    .fill(new Array(dim).fill(null))
    .map((row) => row.map(() => Math.floor(Math.random() * (max - min)) + min))
  console.log(matrix)
  return matrix
}

const getDet = (m: number[][]) => {
  if (m.length == 2) {
    return m[0][0] * m[1][1] - m[0][1] * m[1][0]
  } else {
    return (
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[2][0] * m[1][1])
    )
  }
}

const getInv = (m: number[][]) => {
  const det = getDet(m)
  if (det == 0) return { det: 0, matrix: null }
  else {
    if (m.length == 2) {
      return {
        det: det,
        matrix: [
          [m[1][1], -m[0][1]],
          [-m[1][0], m[0][0]],
        ],
      }
    } else {
      return {
        det: det,
        matrix: [
          [
            m[1][1] * m[2][2] - m[1][2] * m[2][1],
            m[0][2] * m[2][1] - m[0][1] * m[2][2],
            m[0][1] * m[1][2] - m[0][2] * m[1][1],
          ],
          [
            m[1][2] * m[2][0] - m[1][0] * m[2][2],
            m[0][0] * m[2][2] - m[0][2] * m[2][0],
            m[0][2] * m[1][0] - m[0][0] * m[1][2],
          ],
          [
            m[1][0] * m[2][1] - m[2][0] * m[1][1],
            m[0][1] * m[2][0] - m[0][0] * m[2][1],
            m[0][0] * m[1][1] - m[1][0] * m[0][1],
          ],
        ],
      }
    }
  }
}

const getDiag = (m: number[][]) => {}

export default MathPage
