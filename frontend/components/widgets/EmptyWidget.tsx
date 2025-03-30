import { PlusIcon } from "../icons";

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default async function EmptyWidget({ delay }: { delay: number }) {
  await wait(delay);
  return (
    <div className="flex items-center justify-center h-24 rounded-sm bg-gray-50 dark:bg-gray-800">
      <div className="text-2xl text-gray-400 dark:text-gray-500">
        <PlusIcon />
      </div>
    </div>
  );
}
