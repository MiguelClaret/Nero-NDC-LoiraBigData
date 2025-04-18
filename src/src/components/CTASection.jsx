import React from 'react';
// Importação direta dos assets
import partner1 from '../assets/nerochain.svg';

const CTASection = ({ openWalletModal }) => {
  return (
    <section className="py-12 px-8 bg-gray-100 text-center">
      <div className="max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Ready to revolutionize agriculture?</h2>
        <p className="text-lg mb-8">
          Join hundreds of producers and investors on the platform that is transforming sustainable agricultural financing
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={openWalletModal}
            className="py-4 px-8 rounded-md text-lg font-semibold bg-green-700 text-white hover:bg-green-800 hover:-translate-y-0.5 transition-all"
          >
            Start Now
          </button>
        </div>
      </div>
<<<<<<< Updated upstream
      
=======
      <div className="partners">
        <h4 className="text-gray-600 mb-6 font-medium text-xl">Powered by</h4>
        <div className="flex justify-center flex-wrap gap-8 items-center">
          {/* Envolvendo a imagem com uma tag de âncora para torná-la clicável */}
          <a 
            href="https://nerochain.io/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-all hover:scale-105"
          >
            <img
              src={partner1}
              alt="NERO Chain"
              className="opacity-70 hover:opacity-100 transition-opacity size-fit"
            />
          </a>
        </div>
      </div>
>>>>>>> Stashed changes
    </section>
  );
};

export default CTASection;