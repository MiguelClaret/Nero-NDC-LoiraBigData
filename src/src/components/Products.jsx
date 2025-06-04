import React, { useState } from "react";

import futuraSafra from "../assets/futureharvest.png";
import tco2 from "../assets/tco2.png";
import comboNTF from "../assets/combonft.png";
import marketplace from "../assets/marketplace.png";

const ProductTab = ({ title, isActive, onClick }) => {
  return (
    <button
      className={`py-3 px-6 rounded-md font-semibold transition-all ${
        isActive
          ? "bg-green-700 text-white"
          : "bg-white text-gray-500 hover:bg-green-700/10 hover:text-green-700"
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

const TabContent = ({ id, isActive, children }) => {
  return (
    <div
      id={id}
      className={`${
        isActive ? "block" : "hidden"
      } bg-white p-6 rounded-lg shadow-md`}
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {children}
    </div>
  );
};

const FeatureList = ({ features }) => {
  return (
    <ul className="my-6">
      {features.map((feature, index) => (
        <li key={index} className="mb-2 flex items-center gap-2">
          <i className={`${feature.icon} text-green-700`}></i>
          {feature.text}
        </li>
      ))}
    </ul>
  );
};

const Products = () => {
  const [activeTab, setActiveTab] = useState("future-harvest");

  const tabs = [
    { id: "future-harvest", title: "FutureHarvest Tokens" },
    { id: "tco2", title: "AgroCarbon TCO₂" },
    { id: "combo-nft", title: "Combo NFT" },
    { id: "marketplace", title: "Marketplace" },
  ];

  const products = {
    "future-harvest": {
      title: "FutureHarvest Tokens (ERC-1155)",
      description:
        "Tokens that represent fractions of future harvests, allowing producers to raise funds in advance and investors to diversify their portfolio with exposure to agricultural commodities.",
      image: futuraSafra,
      features: [
        { icon: "fas fa-shield-alt", text: "Integrated guarantee fund" },
        {
          icon: "fas fa-sync-alt",
          text: "Automatic proportional distribution",
        },
        { icon: "fas fa-qrcode", text: "Complete traceability" },
        { icon: "fas fa-star", text: "On-chain reputation system" },
      ],
      buttonText: "Explore Harvests",
    },
    tco2: {
      title: "AgroCarbon TCO₂ (ERC-20)",
      description:
        "Tokens that represent 1 ton of CO₂ sequestered or not emitted, generated through sustainable agricultural practices verified by independent third parties.",
      image: tco2,
      features: [
        { icon: "fas fa-check-double", text: "Third-party verification" },
        { icon: "fas fa-exchange-alt", text: "Fully tradable" },
        { icon: "fas fa-leaf", text: "Origin traceability" },
        { icon: "fas fa-certificate", text: "On-chain certification" },
      ],
      buttonText: "Explore Credits",
    },
    "combo-nft": {
      title: "Combo NFT (ERC-721)",
      description:
        "Exclusive digital certificates that prove participation in future harvests AND positive environmental impact, combining harvest fractions and carbon credits in a single token.",
      image: comboNTF,
      features: [
        { icon: "fas fa-trophy", text: "ESG impact proof" },
        { icon: "fas fa-cubes", text: "Digital collectibles" },
        { icon: "fas fa-fingerprint", text: "Certificate of authenticity" },
        { icon: "fas fa-share-alt", text: "Shareable on social networks" },
      ],
      buttonText: "View Collection",
    },
    marketplace: {
      title: "Integrated Marketplace",
      description:
        "A digital market where producers can list their future harvests and carbon credits, and investors can explore opportunities with full transparency on origin and impact.",
      image: marketplace,
      features: [
        { icon: "fas fa-search", text: "Filters by crop type" },
        { icon: "fas fa-map-marker-alt", text: "Geographic visualization" },
        { icon: "fas fa-chart-line", text: "Transaction history" },
        { icon: "fas fa-user-check", text: "Producer ratings" },
      ],
      buttonText: "Access Marketplace",
    },
  };

  return (
    <section id="products" className="py-12 px-8 bg-gray-100">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Products</h2>
        <p className="text-lg text-gray-500">
          Innovative blockchain solutions for sustainable agribusiness
        </p>
      </div>

      <div className="max-w-[1100px] mx-auto">
        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {tabs.map((tab) => (
            <ProductTab
              key={tab.id}
              title={tab.title}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        <div className="tabs-content">
          {Object.keys(products).map((productId) => {
            const product = products[productId];
            return (
              <TabContent
                key={productId}
                id={productId}
                isActive={activeTab === productId}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1 min-w-[300px]">
                    <div className="aspect-square w-full overflow-hidden rounded-lg shadow-sm bg-white">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-[300px]">
                    <h3 className="text-xl font-bold mb-4">{product.title}</h3>
                    <p>{product.description}</p>
                    <FeatureList features={product.features} />
                    <button className="py-2 px-6 rounded-md font-semibold bg-green-700 text-white hover:bg-green-800 hover:-translate-y-0.5 transition-all">
                      {product.buttonText}
                    </button>
                  </div>
                </div>
              </TabContent>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;
