"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Leaf,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import FiltersPanel from "./FiltersPanel";
import CropCard from "./CropCard";
import PurchaseModal from "./PurchaseModal";
import { mockListings } from "./mockData";
import MarketplaceOnboarding from "./MarketplaceOnboarding";
import BlockchainSecurityInfo from "./BlockchainSecurityInfo";
import MarketplaceHowItWorksButton from "./HowItWorksButton"; // Import the new button component

// Define the RefreshCw component once, at the top
const RefreshCw = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 2v6h-6"></path>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
      <path d="M3 22v-6h6"></path>
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
    </svg>
  );
};

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    sustainablePractices: [],
    harvestDateBefore: null,
    cropTypes: [],
  });
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load mock data with a simulated delay to show loading state
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setListings(mockListings);
      setFilteredListings(mockListings);
      setIsLoading(false);
    }, 800);
  }, []);
  
  // Handler for the "How It Works" button
  const handleHowItWorksClick = () => {
    // Mostrar o onboarding independentemente de ter sido concluído antes
    setShowOnboarding(true);
  };
  
  // Handle onboarding completion
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Apply filters and search
  useEffect(() => {
    let results = [...listings];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (listing) =>
          listing.cropType.toLowerCase().includes(query) ||
          listing.farmerName.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query)
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      results = results.filter(
        (listing) => listing.farmerRating >= filters.minRating
      );
    }

    // Apply sustainable practices filter
    if (filters.sustainablePractices.length > 0) {
      results = results.filter((listing) =>
        filters.sustainablePractices.every((practice) =>
          listing.sustainablePractices.includes(practice)
        )
      );
    }

    // Apply crop type filter
    if (filters.cropTypes.length > 0) {
      results = results.filter((listing) =>
        filters.cropTypes.includes(listing.cropType)
      );
    }

    // Apply harvest date filter
    if (filters.harvestDateBefore) {
      const targetDate = new Date(filters.harvestDateBefore);
      results = results.filter((listing) => {
        const harvestDate = new Date(listing.harvestDate);
        return harvestDate <= targetDate;
      });
    }

    // Apply sorting
    if (sortOrder === "price-low") {
      results.sort((a, b) => a.pricePerKg - b.pricePerKg);
    } else if (sortOrder === "price-high") {
      results.sort((a, b) => b.pricePerKg - a.pricePerKg);
    } else if (sortOrder === "rating") {
      results.sort((a, b) => b.farmerRating - a.farmerRating);
    } else if (sortOrder === "carbon") {
      results.sort((a, b) => b.carbonCredits - a.carbonCredits);
    }

    setFilteredListings(results);
  }, [searchQuery, filters, listings, sortOrder]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle investment button click
  const handleInvestClick = (listing) => {
    setSelectedListing(listing);
    setShowPurchaseModal(true);
  };

  // Function to handle purchase confirmation
  const handlePurchaseConfirm = () => {
    // This would typically involve blockchain transactions
    console.log("Purchase confirmed for:", selectedListing);
    // Further processing would happen here
  };

  // Function to add staggered animation delay
  const getAnimationDelay = (index) => {
    return `${index * 50}ms`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg mb-5 pt-4 border border-gray-100 animate-fadeIn max-w-7xl mx-auto py-8 px-4 bg-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
          <Leaf className="mr-2 h-8 w-8 text-green-600" />
          Crop Marketplace
        </h1>
        <Link
          to="/register"
          className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md flex items-center transition-colors"
        >
          <Leaf className="mr-2 h-5 w-5" />
          Register Your Crop
        </Link>
      </div>

      {/* Blockchain Security Information */}
      <BlockchainSecurityInfo />

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <p className="text-gray-700 mb-6">
            Browse sustainable farming opportunities. Each listing includes
            carbon credits and a combination token (NFT) with both crop yield
            and environmental impact.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow relative search-bar">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by crop, farmer, or location"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <button
            onClick={toggleFilters}
            className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center justify-center transition-all duration-300 hover:shadow-md"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {showFilters ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </button>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
          >
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="carbon">Most Carbon Credits</option>
          </select>
        </div>

        {/* Filters Panel - with animation */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {showFilters && (
            <FiltersPanel filters={filters} setFilters={setFilters} />
          )}
        </div>

        {/* Results Info */}
        <div className="mb-4 text-gray-600 flex items-center">
          Showing {filteredListings.length} results
          {isLoading && (
            <RefreshCw className="ml-2 h-4 w-4 text-green-600 animate-spin" />
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12 bg-white rounded-lg shadow">
          <RefreshCw className="h-12 w-12 text-amber-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Listings Grid - Using the grid-cards class from your CSS */}
          <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-6">
            {filteredListings.map((listing, index) => (
              <div
                key={listing.id}
                className="opacity-0 animate-fadeIn"
                style={{
                  animationDelay: getAnimationDelay(index),
                  animationFillMode: "forwards",
                }}
              >
                <CropCard listing={listing} onInvestClick={handleInvestClick} />
              </div>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center p-12 bg-white rounded-lg shadow mt-6">
              <p className="text-gray-600">
                No listings match your search criteria.
              </p>
            </div>
          )}
        </>
      )}

      {/* Purchase Modal */}
      {selectedListing && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          listing={selectedListing}
          onConfirm={handlePurchaseConfirm}
        />
      )}
      
      {/* Onboarding Component */}
      <MarketplaceOnboarding 
        isOpen={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />
      
      {/* Marketplace How It Works Button - positioned above the general onboarding button */}
      <MarketplaceHowItWorksButton onClick={handleHowItWorksClick} />

      {/* CSS Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Marketplace;