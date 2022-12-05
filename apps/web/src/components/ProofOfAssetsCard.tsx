import Image from "next/image";
import Link from "next/link";
import { TokenDetailI } from "types";
import { truncateTextFromMiddle } from "@utils/textHelper";
import { useNetworkContext } from "@contexts/NetworkContext";
import useResponsive from "@hooks/useResponsive";
import NumericFormat from "./commons/NumericFormat";
import BrLogo from "./icons/BrLogo";
import DailyLimit from "./DailyLimit";
import { mockWallet } from "./Header";
import IconTooltip from "./commons/IconTooltip";

export default function ProofOfAssetsCard() {
  const { isMd, isLg } = useResponsive();
  const { selectedTokensA, selectedTokensB } = useNetworkContext();

  return (
    <div className="h-full md:h-auto relative w-full md:dark-card-bg-image md:rounded-lg lg:rounded-xl md:border md:border-dark-200 md:backdrop-blur-[18px] md:px-6 md:pt-6 lg:px-8 lg:pt-8">
      <span className="hidden md:block text-lg lg:text-2xl font-semibold leading-6 lg:leading-9 tracking-wide text-dark-900">
        Proof of assets
      </span>
      <Link
        href={`/address/${mockWallet.address}`}
        className="focus:outline-none"
      >
        <div className="text-sm md:text-xs lg:text-sm text-valid break-all pr-[76px] md:pr-0 hover:underline">
          {isMd
            ? truncateTextFromMiddle(mockWallet.address, isLg ? 16 : 10)
            : mockWallet.address}
        </div>
      </Link>
      <div className="flex items-center mt-5 lg:mt-6">
        <span className="text-xs lg:text-sm font-semibold lg:tracking-wide text-dark-700">
          TOKEN SUPPLY
        </span>
        <div className="ml-2">
          <IconTooltip
            title="Token Supply"
            content="Token supply indicates the amount of liquidity currently available for a particular token pair on DeFi Bridge"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 lg:gap-2 mt-2">
        <TokenSupplyItem token={selectedTokensA.tokenA} />
        <TokenSupplyItem token={selectedTokensB.tokenA} />
      </div>
      <div className="hidden md:block mt-5 lg:mt-6">
        <DailyLimit />
      </div>
      <div className="flex items-center border-t-[0.5px] border-t-dark-200 md:border-t-0 rounded-b-lg lg:rounded-b-xl md:dark-bg-card-section md:-mx-6 mt-5 md:mt-4 lg:mt-6 lg:-mx-8 pt-4 pb-0 md:pb-5 md:px-6 lg:px-8">
        <span className="text-xs text-dark-700 mr-2 lg:mr-3">Backed by</span>
        <BrLogo size={isLg ? 20 : 14} />
      </div>
    </div>
  );
}

function TokenSupplyItem({ token }: { token: TokenDetailI }) {
  return (
    <div className="flex flex-row items-center min-w-[45%] 2xl:min-w-[30%]">
      <Image
        width={100}
        height={100}
        src={token.icon}
        alt={token.name}
        className="w-5 h-5 lg:w-6 lg:h-6"
      />
      <NumericFormat
        className="text-left text-dark-900 lg:text-lg leading-5 lg:leading-6 tracking-[0.01em] lg:tracking-normal ml-2 lg:ml-1"
        value={token.supply}
        decimalScale={4}
        thousandSeparator
        suffix={` ${token.name}`}
      />
    </div>
  );
}
