import GenerateTokenModal from "@/components/modal/GenerateTokenModal";

export default async function SettingsPage() {
  return (
    <div className="p-4">
      <div className="flex flex-col p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <div className="flex gap-4 items-center">
          <span>Generate your token</span>
          <GenerateTokenModal />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 cursor-pointer"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
