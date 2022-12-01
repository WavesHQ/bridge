import BridgeForm from "@components/BridgeForm";
import WelcomeHeader from "@components/WelcomeHeader";

function Home() {
  return (
    <section
      className="relative mt-8 flex min-h-screen flex-col md:mt-7 lg:mt-12"
      data-testid="homepage"
    >
      <div className="flex w-full flex-col px-0 md:flex-row md:px-12 lg:px-[120px]">
        <div className="px-6 pb-6 md:mr-8 md:w-5/12 md:px-0 md:pb-0 lg:mr-[72px]">
          <WelcomeHeader />
        </div>
        <div className="flex-1">
          <BridgeForm />
        </div>
      </div>
    </section>
  );
}

export default Home;
