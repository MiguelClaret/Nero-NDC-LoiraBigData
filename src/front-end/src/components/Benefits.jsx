import React from "react";
import { ButtonTooltip } from "./ButtonToolTips"; // Import the ButtonTooltip component
import { Link } from "react-router-dom";

const BenefitCard = ({
  icon,
  title,
  benefits,
  buttonText,
  url,
  walletInfo,
  openWalletModal,
}) => {
  const handleProtectedNav = (e, role) => {
    if (!walletInfo) {
      e.preventDefault();
      openWalletModal();
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 w-full max-w-[350px] border border-white/20 transition-all hover:-translate-y-3 hover:shadow-2xl flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
          <i className={icon}></i>
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      <ul className="mb-6 flex-grow">
        {benefits.map((benefit, index) => (
          <li key={index} className="mb-3 flex items-center gap-2">
            <i className="fas fa-check text-amber-300"></i>
            {benefit}
          </li>
        ))}
      </ul>

      <button className="w-full py-2 px-4 rounded-md font-semibold bg-white/20 text-white border-2 border-white/40 hover:bg-white/30 hover:-translate-y-0.5 transition-all">
        <Link
          to={url}
          className="py-4 px-8 rounded-md text-lg font-semibold text-white hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          onClick={(e) => handleProtectedNav(e, "producer")}
        >
          <i className="fas fa-chart-line"></i> {buttonText}
        </Link>
      </button>
    </div>
  );
};

const Benefits = ({ walletInfo, openWalletModal }) => {
  const benefitCards = [
    {
      icon: "fas fa-tractor",
      title: "For Producers",
      benefits: [
        "Advanced capital without abusive interest",
        "Extra income with carbon credits",
        "Zero transaction fees (gasless)",
        "Building on-chain reputation",
        "Access to premium sustainable market",
      ],
      buttonText: "I am a Producer",
      url: "/register",
    },
    {
      icon: "fas fa-chart-pie",
      title: "For Investors",
      benefits: [
        "Exposure to fractionalized commodities",
        "ESG impact NFT Combo",
        "Protection by Guarantee Fund",
        "Complete on-chain traceability",
        "Carbon footprint compensation",
      ],
      buttonText: "I am an Investor",
      url: "/marketplace",
    },
    {
      icon: "fas fa-building",
      title: "For Companies",
      benefits: [
        "Verified and traceable TCO₂",
        "ESG goals verification",
        "Direct support to small producers",
        "Transparent supply chain",
        "Automatic impact reports",
      ],
      buttonText: "I am a Company",
      url: "/auditor",
    },
  ];

  return (
    <section
      id="benefits"
      className="py-12 px-8 bg-gradient-to-br from-green-800 to-green-700 text-white"
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Benefits for everyone</h2>
        <p className="text-lg text-white/80">
          A platform that balances financial gains and positive impact
        </p>
      </div>
      <div className="flex flex-wrap gap-6 justify-center">
        {benefitCards.map((card, index) => (
          <BenefitCard
            key={index}
            icon={card.icon}
            title={card.title}
            benefits={card.benefits}
            buttonText={card.buttonText}
            url={card.url}
            walletInfo={walletInfo}
            openWalletModal={openWalletModal}
          />
        ))}
      </div>
    </section>
  );
};

export default Benefits;
