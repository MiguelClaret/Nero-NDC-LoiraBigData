import React from 'react';

const Step = ({ icon, title, description }) => {
  return (
    <div className="flex-1 min-w-[180px] text-center p-6 rounded-lg bg-white shadow-md transition-all hover:-translate-y-3 hover:shadow-lg">
      <div className="w-[70px] h-[70px] rounded-full bg-green-700/10 flex items-center justify-center mx-auto mb-4">
        <i className={`${icon} text-2xl text-green-700`}></i>
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: 'fas fa-user-plus',
      title: 'Easy Registration',
      description: 'Producers join the platform without gas costs using our Account Abstraction technology.'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Tokenize your Harvest',
      description: 'Register your next crop and issue ERC-1155 tokens that represent fractions of your production.'
    },
    {
      icon: 'fas fa-hand-holding-usd',
      title: 'Receive Investment',
      description: 'Investors buy tokens in advance, securing capital for the production cycle.'
    },
    {
      icon: 'fas fa-tree',
      title: 'Obtain TCO₂',
      description: 'Sustainable practices are verified, generating carbon credit tokens as an additional benefit.'
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Transparent Delivery',
      description: 'After harvest, tokens are redeemed proportionally to the actual registered production.'
    }
  ];

  return (
    <section id="how-it-works" className="py-12 px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-lg text-gray-500">A simple journey to democratize access to capital and sustainable certification</p>
      </div>
      <div className="flex flex-wrap justify-between gap-6 mb-12">
        {steps.map((step, index) => (
          <Step
            key={index}
            icon={step.icon}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    
    </section>
  );
};

export default HowItWorks;