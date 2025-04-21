// Importação direta da imagem
import { Link } from "react-router-dom";
import heroImage from "../assets/DesignToken.png"; // Ajuste o caminho conforme necessário

const Hero = ({ openWalletModal }) => {
  return (
    <div className="flex md:flex-row justify-center items-center gap-12 px-8 py-12">
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
          <Link
            to="/register"
            className="py-4 px-8 rounded-md text-lg font-semibold bg-green-700 text-white hover:bg-green-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-seedling"></i> I'm a Producer
          </Link>
          <Link
            to="/marketplace"
            className="py-4 px-8 rounded-md text-lg font-semibold bg-amber-600 text-white hover:bg-amber-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-chart-line"></i> I'm an Investor
          </Link>
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-800">120+</span>
            <span className="text-sm text-gray-600">Active Producers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-800">X NERO</span>
            <span className="text-sm text-gray-600">Captured in 2025</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-800">5.8K</span>
            <span className="text-sm text-gray-600">TCO₂ tokenized</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
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
