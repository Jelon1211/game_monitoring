// import GameBartChart from "@/components/charts/GameBartChart";
// import { redisHelper } from "@/lib/redis/redisHelper";

import ChartLoading from "@/components/loading/ChartLoading";
import EmptyWidget from "@/components/widgets/EmptyWidget";
import { Suspense } from "react";

export default async function DashboardPage() {
  // const redis = redisHelper;

  // const data: [string, number][] | null = await redis.get(
  //   "sample_leaderboard:tetris"
  // );

  const widgetDelays = [300, 500, 700];

  return (
    <div className="p-4">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {widgetDelays.map((delay, index) => (
            <Suspense key={index} fallback={<ChartLoading />}>
              <EmptyWidget delay={delay} />
            </Suspense>
          ))}
        </div>
        <div className="p-4 flex items-center justify-center h-96 mb-4 rounded-sm bg-gray-50 dark:bg-gray-800">
          {/* <GameBartChart
            data={data ? data.map(([name, value]) => ({ name, value })) : null}
          /> */}
        </div>
      </div>
    </div>
  );
}
