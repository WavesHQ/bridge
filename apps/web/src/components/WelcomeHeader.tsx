import { FiBook, FiHelpCircle } from "react-icons/fi";
import IconTooltip from "./commons/IconTooltip";

export default function WelcomeHeader() {
  return (
    <div>
      <h1 className="text-[32px] leading-[44px] text-dark-1000 lg:text-[44px] lg:leading-[60px]">
        Welcome to
      </h1>
      <h1 className="text-[32px] leading-[44px] text-dark-1000 lg:text-[44px] lg:leading-[60px]">
        DeFiChain Bridge
      </h1>
      <div className="mt-2">
        <span className="align-middle text-base text-dark-700 lg:text-xl">
          A secure and easy way to transfer tokens wrapped by DeFiChain
          Consortium
        </span>
        <button type="button" className="ml-1 align-middle">
          {/* TODO: Add title for mobile */}
          <IconTooltip content="DeFiChain members that have been given the rights to mint and burn the Tokenized Assets on DeFiChain." />
        </button>
      </div>
      <div className="hidden md:block">
        <div className="flex flex-row items-center md:mt-5">
          <button type="button" className="flex flex-row items-center">
            <FiBook size={20} className="text-dark-700" />
            <span className="ml-2 text-base font-semibold text-dark-700">
              User Guide
            </span>
          </button>
          <button type="button" className="ml-6 flex flex-row items-center">
            <FiHelpCircle size={20} className="text-dark-700" />
            <span className="ml-2 text-base font-semibold text-dark-700">
              FAQs
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
