import React from 'react';
import { Star, Leaf, Calendar, MapPin, User, Archive, Award } from 'lucide-react';

const CropCard = ({ listing }) => {
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
            className={`h-3 w-3 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
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
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {practices.map(practice => (
          <span 
            key={practice} 
            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800"
          >
            <Leaf className="h-2.5 w-2.5 mr-0.5" />
            {practiceLabels[practice]}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      {/* Card Header - Crop Image */}
      <div className="bg-green-100 h-32 relative flex items-center justify-center flex-shrink-0">
        <Archive className="h-12 w-12 text-green-600" />
        <div className="absolute top-2 right-2 bg-white rounded-full px-1.5 py-0.5 text-xs font-medium text-green-800 flex items-center shadow">
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
          <span className="text-xs font-medium text-green-700 whitespace-nowrap">
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
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700">Carbon Credits:</span>
            <span className="text-xs font-medium text-green-700">{listing.carbonCredits} TCO2e</span>
          </div>
          
          {renderPractices(listing.sustainablePractices)}
        </div>
        
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-md font-medium transition duration-300 flex items-center justify-center text-sm mt-auto">
          Invest Now
        </button>
      </div>
    </div>
  );
};

export default CropCard;