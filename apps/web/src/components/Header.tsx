import useResponsive from "@hooks/useResponsive";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import truncateTextFromMiddle from "@utils/textHelper";
import MetaMaskIcon from "./icons/MetaMaskIcon";

interface Wallet {
  address: string;
  token: string;
}

interface MobileProps {
  walletText: string;
  show: boolean;
}

interface TabletOrWebProps extends MobileProps {
  wallet: Wallet;
}

function MobileWallet({ walletText, show }: MobileProps) {
  return show ? (
    <>
      <div className="mr-2 h-3 w-3 rounded-full bg-valid" />
      <span className="text-xs text-dark-1000">{walletText}</span>
    </>
  ) : null;
}

function TabletOrWebWallet({ wallet, walletText, show }: TabletOrWebProps) {
  return show ? (
    <div className="flex items-center">
      <MetaMaskIcon />

      <div className="ml-2 text-left">
        <span className="block text-sm text-dark-1000">{walletText}</span>
        <div className="flex items-center">
          <span className="text-xs text-dark-700">{wallet.token}</span>
          <div className="ml-1 h-2 w-2 rounded-full bg-valid" />
        </div>
      </div>
    </div>
  ) : null;
}

// TODO: Replace test data here
export const mockWallet = {
  address: "0xaab27b150451726ecsds38aa1d0a94505c8729bd1",
  token: "Ethereum",
};

function ConnectButtonDisplay({
  onClick,
}: {
  onClick: () => void;
}): JSX.Element {
  const { isMd } = useResponsive();
  const btnLabel = isMd ? "Connect wallet" : "Connect";
  return (
    <button
      data-testid="connect-button"
      type="button"
      className={clsx(
        `dark-bg-gradient-1 hover:fill-bg-gradient-1 active:fill-bg-gradient-5 flex h-full items-center justify-center
          rounded-3xl border-[1.5px] border-transparent px-4 py-2 md:px-6
          md:py-2.5 lg:px-6 lg:py-3`
      )}
      onClick={onClick}
    >
      <span className="text-sm font-semibold text-dark-1000">{btnLabel}</span>
    </button>
  );
}

function WalletDisplay({
  wallet,
  onClick,
}: {
  wallet: Wallet;
  onClick: () => void;
}): JSX.Element {
  const { isMd, isLg } = useResponsive();
  const walletText = truncateTextFromMiddle(wallet.address, isLg ? 5 : 4);
  return (
    <button
      data-testid="wallet-button"
      type="button"
      onClick={onClick}
      className={clsx(
        `hover:dark-btn-hover active:dark-btn-pressed dark-card-bg flex h-8 items-center rounded-[48px]
          border-[0.5px] border-dark-card-stroke px-3 py-2 hover:border-transparent md:h-[52px]
          md:w-[156px] lg:h-12 lg:w-[165px]
          lg:px-2.5 lg:py-1.5`
      )}
    >
      <TabletOrWebWallet wallet={wallet} walletText={walletText} show={isMd} />
      <MobileWallet walletText={walletText} show={!isMd} />
    </button>
  );
}

export default function Header(): JSX.Element {
  const [wallet, setWallet] = useState<Wallet>();

  return (
    <div className="relative z-[1] flex items-center justify-between bg-dark-00 px-5 pt-8 pb-6 md:px-12 md:py-6 lg:px-[120px] lg:pt-10 lg:pb-12">
      <Link href="/">
        <div className="relative h-[32px] w-[140px] cursor-pointer lg:h-[60px] lg:w-[264px]">
          <Image
            fill
            data-testid="bridge-logo"
            src="/header-logo.svg"
            alt="Bridge Logo"
          />
        </div>
      </Link>
      <div className="flex h-9 items-center md:h-10 lg:h-12">
        {wallet ? (
          <WalletDisplay wallet={wallet} onClick={() => setWallet(undefined)} />
        ) : (
          <ConnectButtonDisplay onClick={() => setWallet(mockWallet)} />
        )}
        {/* TODO: Add back if needed */}
        {/* {isLg && (
          <div className="flex items-center ml-3">
            <ThemeSwitch />
          </div>
        )} */}
      </div>
    </div>
  );
}
