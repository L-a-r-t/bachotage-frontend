import dayjs from "dayjs"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { Attempt } from "types/user"
import { formatDate, formatTime } from "utils/functions"
import { forwardRef } from "react"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const HistoryChart = forwardRef<any, Props>(
  ({ userHistory, onHistoryClick }, chartRef) => {
    return (
      <Bar
        ref={chartRef}
        onClick={onHistoryClick}
        options={{
          responsive: true,
          scales: {
            xAxes: { display: true },
            y1: {
              type: "linear",
              position: "left",
              display: true,
              beginAtZero: true,
            },
            y2: {
              type: "linear",
              position: "right",
              display: true,
              grid: {
                drawOnChartArea: false,
              },
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                title: (ctx) => {
                  const raw = ctx[0].raw as HistoryChartData
                  return `${raw.score}/${raw.questions} - ${formatTime(
                    raw.time
                  )}`
                },
                label: (ctx) => {
                  const raw = ctx.raw as HistoryChartData
                  return `Score: ${raw.score}/${raw.questions}`
                },
                afterBody: (ctx) => {
                  const raw = ctx[0].raw as HistoryChartData
                  return `Durée: ${formatTime(raw.time)}`
                },
              },
            },
          },
          parsing: {
            yAxisKey: "stat",
            xAxisKey: "t",
          },
        }}
        data={{
          labels: userHistory.attempts.map((a) => formatDate(a.date._seconds)),
          datasets: [
            {
              label: "Score (équivalent /10)",
              yAxisID: "y1",
              data: userHistory.attempts.map(
                (attempt) =>
                  ({
                    uid: attempt.uid,
                    score: attempt.score,
                    stat:
                      Math.round(
                        (attempt.score * 100) / attempt.questions.length
                      ) / 10,
                    time: attempt.time,
                    questions: attempt.questions.length,
                    date: dayjs(attempt.date._seconds * 1000).format(
                      "DD/MM - HH[h]mm"
                    ),
                    quizId: attempt.quizId,
                    t: attempt.date._seconds,
                  } as HistoryChartData)
              ),
              backgroundColor: "rgb(17, 94, 87)",
            },
            {
              label: "Durée (secondes)",
              yAxisID: "y2",
              hidden: true,
              data: userHistory.attempts.map(
                (attempt) =>
                  ({
                    uid: attempt.uid,
                    score: attempt.score,
                    stat: attempt.time,
                    time: attempt.time,
                    questions: attempt.questions.length,
                    date: dayjs(attempt.date._seconds * 1000).format(
                      "DD/MM - HH[h]mm"
                    ),
                    quizId: attempt.quizId,
                    t: attempt.date._seconds,
                  } as HistoryChartData)
              ),
              backgroundColor: "rgb(147, 229, 223)",
            },
          ],
        }}
      />
    )
  }
)
HistoryChart.displayName = "HistoryChart"

export default HistoryChart

type Props = {
  onHistoryClick: (e: any) => void
  userHistory: {
    stats: Stats
    attempts: Attempt[]
  }
}

type Stats = {
  timeAverages: number[]
  byTag: { tag: string; score: number; questions: number[] }[]
}

type HistoryChartData = {
  score: number
  stat: number
  time: number
  questions: number
  date: string
  quizId: string
  uid: string
  t: number
}
