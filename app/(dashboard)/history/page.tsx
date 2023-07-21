import HistoryChart from "@/components/HistoryChart";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getData = async () => {
  const user = await getUserByClerkID();
  const analyses = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const sum = analyses.reduce( (all, current) => all + current.sentimentScore, 0);
  const avg = Math.round( sum / analyses.length );
  return { analyses, avg }
}

const History = async () => {
  const { avg, analyses } = await getData();
  return <div className="w-[calc(100vw-230px)] h-[calc(100vh-70px)]">
    <div>{ `Avg. Sentiment ${avg}` }</div>
    <div className="w-[calc(100vw-230px)] h-[calc(100vh-70px)]">
      <HistoryChart data={ analyses } />
    </div>
  </div>
}
export default History;