import { FiBook, FiHelpCircle } from "react-icons/fi";
import IconTooltip from "./commons/IconTooltip";

export default function WelcomeHeader() {
  return (
    <div>
      <h1 className="text-dark-1000 text-[32px] leading-[44px] lg:text-[44px] lg:leading-[60px]">
        Welcome to
      </h1>
      <h1 className="text-dark-1000 text-[32px] leading-[44px] lg:text-[44px] lg:leading-[60px]">
        DeFiChain Bridge
      </h1>
      <div className="mt-2">
        <span className="text-dark-700 align-middle text-base lg:text-xl">
          A secure and easy way to transfer tokens wrapped by DeFiChain
          Consortium
        </span>
        <button type="button" className="ml-1 align-middle">
          {/* TODO: Add proper tooltip description */}
          <IconTooltip content="DeFiChain Consortium ..." />
        </button>
      </div>
      <div className="hidden md:block">
        <div className="flex flex-row items-center md:mt-5">
          <button type="button" className="flex flex-row items-center">
            <FiBook size={20} className="text-dark-700" />
            <span className="text-dark-700 ml-2 text-base font-semibold">
              User Guide
            </span>
          </button>
          <button type="button" className="ml-6 flex flex-row items-center">
            <FiHelpCircle size={20} className="text-dark-700" />
            <span className="text-dark-700 ml-2 text-base font-semibold">
              FAQs
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
