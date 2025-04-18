import React from 'react';

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
          <button className="py-4 px-8 rounded-md text-lg font-semibold border-2 border-gray-300 hover:border-green-700 hover:text-green-700 hover:-translate-y-0.5 transition-all">
            Schedule a Demo
          </button>
        </div>
      </div>
      
    </section>
  );
};

export default CTASection;