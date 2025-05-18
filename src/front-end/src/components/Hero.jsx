// Importação direta da imagem
import { Link } from "react-router-dom";
import heroImage from "../assets/DesignToken.png"; // Ajuste o caminho conforme necessário
import { ButtonTooltip } from "./ButtonToolTips"; // Import the ButtonTooltip component
import bgPattern from "../assets/bg-pattern.svg";

const Hero = ({ openWalletModal, backgroundStyle, walletInfo }) => {
  const handleProtectedNav = (e, role) => {
    if (!walletInfo) {
      e.preventDefault();
      openWalletModal();
    }
  };

  return (
    <div
      className="flex flex-row justify-center items-center gap-12 px-8 py-12"
      style={backgroundStyle}
    >
      <div className="flex-1 md:max-w-[600px]">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Tokenize your harvest, <br />
          <span className="text-green-700">Cultivate the future</span>
        </h1>
        <p className="text-lg max-w-xl mb-8">
          Early funding for farmers and investment in future crops with a
          positive environmental impact, all with no fees on the NERO Chain.{" "}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Enhanced with tooltip */}
          <ButtonTooltip text="Register your crop details and sustainable practices to receive advance funding">
            <Link
              to="/register"
              className="py-4 px-8 rounded-md text-lg font-semibold bg-green-700 text-white hover:bg-green-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              onClick={(e) => handleProtectedNav(e, "producer")}
            >
              <i className="fas fa-seedling"></i> I'm a Producer
            </Link>
          </ButtonTooltip>

          {/* Enhanced with tooltip */}
          <ButtonTooltip text="Browse available harvest tokens and carbon credits to support sustainable agriculture">
            <Link
              to="/marketplace"
              className="py-4 px-8 rounded-md text-lg font-semibold bg-amber-600 text-white hover:bg-amber-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              onClick={(e) => handleProtectedNav(e, "investor")}
            >
              <i className="fas fa-chart-line"></i> I'm an Investor
            </Link>
          </ButtonTooltip>
          {/* Auditor */}
          <ButtonTooltip text="Access the review panel to validate sustainable harvest submissions on-chain">
            <Link
              to="/auditor"
              className="py-4 px-8 rounded-md text-lg font-semibold bg-gray-400 text-gray-800 hover:bg-gray-600 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              onClick={(e) => handleProtectedNav(e, "auditor")}
            >
              <i className="fas fa-user-check"></i> I'm an Auditor
            </Link>
          </ButtonTooltip>
        </div>
      </div>
      <div className="py-12 flex justify-center items-center">
        <img
          src={heroImage || "/placeholder.svg"}
          alt="Agricultura tokenizada sustentável"
          className="rounded-lg shadow-lg max-w-md w-full h-auto"
        />
      </div>
    </div>
  );
};

export default Hero;
