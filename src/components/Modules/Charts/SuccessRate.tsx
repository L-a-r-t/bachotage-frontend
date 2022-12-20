import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar, getElementAtEvent } from "react-chartjs-2"
import { Attempt } from "types/user"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function SuccessRate({ userHistory }: Props) {
  return (
    <Bar
      options={{
        responsive: true,
        indexAxis: "y",
        parsing: {
          xAxisKey: "stat",
          yAxisKey: "tag",
        },
      }}
      data={{
        labels: userHistory.stats.byTag.map((tag) => tag.tag),
        datasets: [
          {
            label: "Taux de réussite",
            data: userHistory.stats.byTag.map((tag) => ({
              tag: tag.tag,
              stat: Math.round((tag.score * 100) / tag.questions.length) / 100,
            })),
            backgroundColor: "rgb(17, 94, 87)",
          },
        ],
      }}
    />
  )
}

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
