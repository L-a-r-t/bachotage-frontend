import { forwardRef } from "react"
import { formatTime } from "utils/functions"
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const QuestionsAvg = forwardRef<any, Props>(({ userHistory }, timesRef) => {
  return (
    <Bar
      ref={timesRef}
      options={{
        responsive: true,
        scales: {
          xAxes: { display: true },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (ctx) => {
                const raw = ctx[0].raw as TimeChartData
                return raw.question
              },
              label: (ctx) => {
                const raw = ctx.raw as TimeChartData
                return `Temps: ${formatTime(raw.time)}`
              },
            },
          },
        },
        parsing: {
          yAxisKey: "time",
          xAxisKey: "index",
        },
      }}
      data={{
        labels: userHistory.stats.timeAverages.map((a, index) => index),
        datasets: [
          {
            label: "Temps moyen par question (secondes)",
            data: userHistory.stats.timeAverages.map((stat, index) => ({
              index: index + 1,
              question: `Question #${index + 1}`,
              time: stat ?? 0,
            })),
            backgroundColor: "rgb(17, 94, 87)",
          },
        ],
      }}
    />
  )
})
QuestionsAvg.displayName = "QuestionsAvg"

export default QuestionsAvg

type Props = {
  userHistory: {
    stats: Stats
    attempts: Attempt[]
  }
}

type Stats = {
  timeAverages: number[]
  byTag: { tag: string; score: number; questions: number[] }[]
}

type TimeChartData = { index: number; question: string; time: number }
