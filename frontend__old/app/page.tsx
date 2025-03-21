import { redisHelper } from "@/lib/redis/redisHelper";

export default async function Page() {
  const test = await redisHelper.get("server_id:jelon_0_0_1", true);
  console.log("tutaj test --> ", JSON.stringify(test));
  return (
    <main className="flex min-h-screen flex-col ">
      <ul>
        {test ? (
          test.map((item: any, index: number) => (
            <li key={index} className="border p-2">
              {JSON.stringify(item)}
            </li>
          ))
        ) : (
          <li>Brak danych w Redis</li>
        )}
      </ul>
    </main>
  );
}
