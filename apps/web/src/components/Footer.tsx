import React from "react";
import { FaYoutube, FaReddit, FaGithub, FaTwitter } from "react-icons/fa";
import Container from "./commons/Container";

const SocialItems = [
  {
    icon: FaYoutube,
    testId: "youtube",
    label: "Youtube",
    href: "https://www.youtube.com/DeFiChain",
  },
  {
    icon: FaReddit,
    testId: "reddit",
    label: "Reddit",
    href: "https://www.reddit.com/r/defiblockchain",
  },
  {
    icon: FaGithub,
    testId: "gitHub",
    label: "GitHub",
    href: "https://github.com/DeFiCh",
  },
  {
    icon: FaTwitter,
    testId: "twitter",
    label: "Twitter",
    href: "https://twitter.com/defichain",
  },
];

export default function Footer() {
  return (
    <footer className="relative z-[1] w-full border-t border-dark-300 bg-dark-00 pb-8 pt-4 md:border-t-0 md:pb-12 md:pt-3">
      <Container className="px-5 md:px-12 lg:px-[120px]">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row">
            <div className="text-xs font-semibold text-dark-700">
              Developed by&nbsp;
            </div>
            <div className="text-xs font-semibold text-dark-700">
              Birthday Research
            </div>
          </div>
          <div className="flex flex-row space-x-2 md:space-x-4">
            {SocialItems.map(({ href, testId, icon: Icon }) => (
              <a
                href={href}
                key={testId}
                target="_blank"
                rel="noreferrer"
                className="p-1"
                data-testid={testId}
              >
                <Icon size={24} className="text-dark-700" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
