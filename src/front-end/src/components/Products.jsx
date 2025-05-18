import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import futuraSafra from "../assets/futureharvest.png";
import tco2 from "../assets/tco2.png";
import comboNTF from "../assets/combonft.png";
import marketplaceImg from "../assets/marketplace.png";

const ProductTab = ({ title, isActive, onClick, index }) => {
  return (
    <motion.button
      className={`py-3 px-6 rounded-full font-semibold transition-all relative overflow-hidden ${
        isActive
          ? "text-white"
          : "bg-white/80 text-gray-600 hover:text-green-700"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500 -z-10"
          layoutId="activeBg"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      {title}
    </motion.button>
  );
};

const TabContent = ({ id, isActive, children }) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          id={id}
          className="bg-white p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FeatureList = ({ features }) => {
  return (
    <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg bg-green-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{
            scale: 1.02,
            backgroundColor: "rgba(34, 197, 94, 0.15)",
          }}
        >
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
            <i className={feature.icon}></i>
          </div>
          <span className="font-medium">{feature.text}</span>
        </motion.div>
      ))}
    </div>
  );
};

const Products = () => {
  const [activeTab, setActiveTab] = useState("future-harvest");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("products");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

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
      image: marketplaceImg,
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
    <section
      id="products"
      className="py-16 px-8 bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <motion.div
        className="text-center max-w-2xl mx-auto mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
          Our Products
        </h2>
        <p className="text-lg text-gray-600">
          Innovative blockchain solutions for sustainable agribusiness
        </p>
      </motion.div>

      <div className="max-w-[1100px] mx-auto">
        <motion.div
          className="flex justify-center gap-3 flex-wrap mb-10 p-2 bg-white/50 backdrop-blur-sm shadow-sm rounded-md"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {tabs.map((tab, index) => (
            <ProductTab
              key={tab.id}
              title={tab.title}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              index={index}
            />
          ))}
        </motion.div>

        <div className="tabs-content">
          {Object.keys(products).map((productId) => {
            const product = products[productId];
            return (
              <TabContent
                key={productId}
                id={productId}
                isActive={activeTab === productId}
              >
                <div className="flex flex-row gap-8 items-center ">
                  <motion.div
                    className="md:w-2/5 min-w-[200px] order-1 md:order-1 py-5"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div
                      className="w-full h-full rounded-xl overflow-hidden shadow-md bg-white"
                      style={{
                        aspectRatio: "1/1",
                        maxWidth: "280px",
                        margin: "0 auto",
                      }}
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover object-center transition-all duration-700 hover:scale-105"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Content section - Right side */}
                  <motion.div
                    className="md:w-3/5 order-1 md:order-2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold mb-4 text-green-700">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <FeatureList features={product.features} />
                    <motion.button
                      onClick={() => navigate(`/marketplace`)}
                      className="py-3 px-8 rounded-full font-semibold bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md hover:shadow-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {product.buttonText}
                    </motion.button>
                  </motion.div>
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
