import React, { useState } from 'react';
import { Star, Leaf, Calendar, MapPin, User, Archive, Award, Droplet, Crop, Thermometer, ChevronUp, ChevronDown } from 'lucide-react';

// Define the RefreshCw component
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

const CropCard = ({ listing }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Format the date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Generate star rating display
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-3 w-3 transition-all duration-300 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-600">({rating})</span>
      </div>
    );
  };
  
  // Generate sustainable practices badges
  const renderPractices = (practices) => {
    const practiceLabels = {
      organic: 'Organic',
      conservation: 'Conservation',
      rotation: 'Rotation',
      water: 'Water'
    };
    
    const practiceIcons = {
      organic: <Leaf className="h-2.5 w-2.5 mr-0.5" />,
      conservation: <Crop className="h-2.5 w-2.5 mr-0.5" />,
      rotation: <RefreshCw className="h-2.5 w-2.5 mr-0.5" />,
      water: <Droplet className="h-2.5 w-2.5 mr-0.5" />
    };
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {practices.map(practice => (
          <span 
            key={practice} 
            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800 hover:bg-green-200 transition-all duration-300"
          >
            {practiceIcons[practice] || <Leaf className="h-2.5 w-2.5 mr-0.5" />}
            {practiceLabels[practice]}
          </span>
        ))}
      </div>
    );
  };

  // Custom icon based on crop type
  const getCropIcon = (cropType) => {
    switch(cropType.toLowerCase()) {
      case 'coffee':
        return <Thermometer className="h-12 w-12 text-amber-600" />;
      case 'soybean':
        return <Crop className="h-12 w-12 text-yellow-600" />;
      case 'corn':
        return <Crop className="h-12 w-12 text-yellow-500" />;
      case 'wheat':
        return <Crop className="h-12 w-12 text-amber-500" />;
      case 'rice':
        return <Droplet className="h-12 w-12 text-blue-500" />;
      default:
        return <Archive className="h-12 w-12 text-green-600" />;
    }
  };

  // Get background color based on crop type
  const getBackgroundColor = (cropType) => {
    switch(cropType.toLowerCase()) {
      case 'coffee':
        return 'bg-amber-50';
      case 'soybean':
        return 'bg-yellow-50';
      case 'corn':
        return 'bg-yellow-100';
      case 'wheat':
        return 'bg-amber-100';
      case 'rice':
        return 'bg-blue-50';
      default:
        return 'bg-green-100';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 h-full flex flex-col ${isHovered ? 'shadow-xl -translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header - Crop Image */}
      <div className={`${getBackgroundColor(listing.cropType)} h-32 relative flex items-center justify-center flex-shrink-0 transition-all duration-300`}>
        {getCropIcon(listing.cropType)}
        <div className="absolute top-2 right-2 bg-white rounded-full px-1.5 py-0.5 text-xs font-medium text-green-800 flex items-center shadow hover:shadow-md transition-all duration-300 cursor-pointer">
          <Award className="h-2.5 w-2.5 mr-0.5 text-amber-500" />
          NFT
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-3 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-base font-semibold text-gray-800 truncate">
            {listing.quantity}kg {listing.cropType}
          </h3>
          <span className={`text-xs font-medium ${isHovered ? 'text-green-800' : 'text-green-700'} whitespace-nowrap transition-all duration-300`}>
            ${listing.pricePerKg}/kg
          </span>
        </div>
        
        <div className="flex items-center mb-0.5 text-xs text-gray-600">
          <User className="h-3 w-3 text-gray-500 mr-0.5 flex-shrink-0" />
          <span className="truncate">{listing.farmerName}</span>
          <span className="mx-1">•</span>
          {renderRating(listing.farmerRating)}
        </div>
        
        <div className="flex items-center mb-0.5 text-xs text-gray-600">
          <MapPin className="h-3 w-3 text-gray-500 mr-0.5 flex-shrink-0" />
          <span className="truncate">{listing.location}</span>
        </div>
        
        <div className="flex items-center mb-2 text-xs text-gray-600">
          <Calendar className="h-3 w-3 text-gray-500 mr-0.5 flex-shrink-0" />
          <span className="truncate">Harvest by {formatDate(listing.harvestDate)}</span>
        </div>
        
        <div className="border-t border-gray-100 pt-2 mb-2 mt-auto">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-medium text-gray-600 hover:text-green-700 transition-colors duration-300 flex items-center"
            >
              {showDetails ? (
                <>Details <ChevronUp className="ml-1 h-3 w-3" /></>
              ) : (
                <>Details <ChevronDown className="ml-1 h-3 w-3" /></>
              )}
            </button>
            <span className="text-xs font-medium text-green-700">{listing.carbonCredits} TCO2e</span>
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ${showDetails ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            {showDetails && (
              <>
                <div className="text-xs text-gray-600 mb-1">Total Value: ${listing.totalValue}</div>
                {renderPractices(listing.sustainablePractices)}
              </>
            )}
          </div>
        </div>
        
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-md font-medium transition-all duration-300 flex items-center justify-center text-sm mt-auto relative overflow-hidden group">
          <span className="relative z-10">Invest Now</span>
          <div className="absolute inset-0 bg-green-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>
        </button>
      </div>
    </div>
  );
};

export default CropCard;