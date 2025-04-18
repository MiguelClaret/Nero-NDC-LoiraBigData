import React from 'react';
import hero_image from '../assets/sorrindo.jpg';


const Hero = ({ openWalletModal }) => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-12 px-8 py-12">
      <div className="flex-1 px-52">
        <h1 className="text-5xl font-bold mb-6">
        Tokenize your harvest, <br />
          <span className="text-green-700">Cultivate the fulture</span>
        </h1>
        <p className="text-lg max-w-xl mb-8">
        Early funding for farmers and investment in future crops with a positive environmental impact, all with no fees on the NERO Chain.        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="py-4 px-8 rounded-md text-lg font-semibold bg-green-700 text-white hover:bg-green-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
            <i className="fas fa-seedling"></i> I'm a Producer
          </button>
          <button className="py-4 px-8 rounded-md text-lg font-semibold bg-amber-600 text-white hover:bg-amber-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
            <i className="fas fa-chart-line"></i> I'm a investor
          </button>
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
      <div className="flex-1 flex justify-center items-center">
        <img 
          src={hero_image} 
          alt="Agricultura tokenizada sustentável" 
          className="max-w-[90%] rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Hero;