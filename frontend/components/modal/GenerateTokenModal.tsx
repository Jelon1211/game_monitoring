"use client";

import { useState } from "react";
import Modal from "./Modal";
import CloseModalIcon from "../icons/CloseModalIcon";
import { RightArrowIcon } from "../icons";
import ModalHeader from "./components/ModalHeader";
import { generateJWT } from "@/lib/actions/generateJWT";
import { SupportedPlatforms } from "@/enums/platforms";
import { JwtPayload } from "@/types/jwt";
import { useUser } from "@/context/user-context";

export default function GenerateTokenModal() {
  const { user } = useUser();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [selectedGame, setSelectedGame] = useState<SupportedPlatforms | null>(
    null
  );
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenDescription, setTokenDescription] = useState<string>("");

  const handleSelect = (val: SupportedPlatforms) => setSelectedGame(val);
  const handleNext = () => {
    if (selectedGame) setStep(2);
  };
  const handleBack = () => {
    if (selectedGame) setStep(1);
  };
  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep(1);
      setSelectedGame(null);
    }, 300);
  };

  const handleGenerateJWT = async () => {
    const jwtPayload: JwtPayload = {
      platform: selectedGame!,
      name: tokenName,
      description: tokenDescription,
      user_id: user!.id,
      role: "free",
    };
    await generateJWT(jwtPayload);
    return setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 cursor-pointer"
      >
        Generate
      </button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <div className="relative w-full max-w-md bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-600">
            <ModalHeader
              title={step === 1 ? "Available gmaes" : "Configure token"}
            />
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
              onClick={closeModal}
            >
              <CloseModalIcon />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="relative min-h-[300px]">
            <div
              className={`w-full h-full transition-all duration-300 ease-in-out ${
                step === 1
                  ? "opacity-100 translate-x-0 z-10"
                  : "opacity-0 -translate-x-full z-0"
              }`}
            >
              <div className="p-4 md:p-5">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Select your desired game server:
                </p>
                <ul className="space-y-4 mb-4">
                  <li>
                    <input
                      type="radio"
                      id="job-1"
                      name="job"
                      value="job-1"
                      className="hidden peer"
                      required
                      onChange={() => handleSelect(SupportedPlatforms.ROBLOX)}
                    />
                    <label
                      htmlFor="job-1"
                      className="inline-flex items-center justify-between w-full p-5 text-gray-900 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-500 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 dark:peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-900 hover:bg-gray-100 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
                    >
                      <div className="block">
                        <div className="w-full text-lg font-semibold">
                          Roblox
                        </div>
                        <div className="w-full text-gray-500 dark:text-gray-400">
                          Server
                        </div>
                      </div>
                      <RightArrowIcon />
                    </label>
                  </li>
                </ul>
                <button
                  className="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
                  disabled={!selectedGame}
                  onClick={handleNext}
                >
                  Next step
                </button>
              </div>
            </div>
            <div
              className={`absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out overflow-auto ${
                step === 2
                  ? "opacity-100 translate-x-0 z-10"
                  : "opacity-0 translate-x-full z-0"
              }`}
            >
              <div className="p-5 space-y-4">
                <p className="text-gray-500 dark:text-gray-400">
                  You selected: <strong>{selectedGame}</strong>
                </p>
                <div className="mb-6">
                  <label
                    htmlFor="default-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Give your token a name
                  </label>
                  <input
                    type="text"
                    id="default-input"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="default-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Describe your token
                  </label>
                  <input
                    type="text"
                    id="default-input"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={tokenDescription}
                    onChange={(e) => setTokenDescription(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="focus:outline-none w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 cursor-pointer"
                  onClick={handleGenerateJWT}
                >
                  Generate token
                </button>

                <button
                  className="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer"
                  disabled={!selectedGame}
                  onClick={() => handleBack()}
                >
                  Go back
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
