import { Commet } from "react-loading-indicators";

const Loader = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <Commet
        color="#d0362e"
        size="medium"
        text=""
        textColor=""
      />
    </div>
  );
};

export default Loader;