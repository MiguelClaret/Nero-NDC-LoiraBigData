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
            className={`h-4 w-4 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };
  
  // Generate sustainable practices badges
  const renderPractices = (practices) => {
    const practiceLabels = {
      organic: 'Organic',
      conservation: 'Conservation',
      rotation: 'Crop Rotation',
      water: 'Water Saving'
    };
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {practices.map(practice => (
          <span 
            key={practice} 
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
          >
            <Leaf className="h-3 w-3 mr-1" />
            {practiceLabels[practice]}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Card Header - Crop Image */}
      <div className="bg-green-100 h-40 relative flex items-center justify-center">
        <Archive className="h-16 w-16 text-green-600" />
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium text-green-800 flex items-center shadow">
          <Award className="h-3 w-3 mr-1 text-amber-500" />
          NFT Combo
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {listing.quantity}kg {listing.cropType}
          </h3>
          <span className="text-sm font-medium text-green-700">
            ${listing.pricePerKg}/kg
          </span>
        </div>
        
        <div className="flex items-center mb-1 text-sm text-gray-600">
          <User className="h-4 w-4 text-gray-500 mr-1" />
          {listing.farmerName}
          <span className="mx-2">•</span>
          {renderRating(listing.farmerRating)}
        </div>
        
        <div className="flex items-center mb-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-500 mr-1" />
          {listing.location}
        </div>
        
        <div className="flex items-center mb-3 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
          Harvest by {formatDate(listing.harvestDate)}
        </div>
        
        <div className="border-t border-gray-100 pt-3 mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Carbon Credits:</span>
            <span className="text-sm font-medium text-green-700">{listing.carbonCredits} TCO2e</span>
          </div>
          
          {renderPractices(listing.sustainablePractices)}
        </div>
        
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition duration-300 flex items-center justify-center">
          Invest Now
        </button>
      </div>
    </div>
  );
};

export default CropCard;