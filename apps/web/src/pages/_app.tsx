import "../styles/globals.scss";
import NextNProgress from "nextjs-progressbar";
import Base from "../layouts/Base";

// @ts-ignore
export default function BridgeApp({ Component, pageProps }): JSX.Element {
  return (
    <Base {...pageProps}>
      <NextNProgress
        startPosition={0.3}
        stopDelayMs={200}
        showOnShallow
        color="#5B10FF"
        height={4}
        options={{ showSpinner: false }}
      />
      <Component {...pageProps} />
    </Base>
  );
}
