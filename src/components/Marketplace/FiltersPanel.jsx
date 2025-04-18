import React from 'react';
import { Star, Calendar, Leaf, X, Crop, Droplet, Filter } from 'lucide-react';

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

const FiltersPanel = ({ filters, setFilters }) => {
  const handleRatingChange = (rating) => {
    setFilters({ ...filters, minRating: rating === filters.minRating ? 0 : rating });
  };
  
  const handlePracticeChange = (practice) => {
    let updatedPractices = [...filters.sustainablePractices];
    
    if (updatedPractices.includes(practice)) {
      updatedPractices = updatedPractices.filter(p => p !== practice);
    } else {
      updatedPractices.push(practice);
    }
    
    setFilters({ ...filters, sustainablePractices: updatedPractices });
  };
  
  const handleCropTypeChange = (cropType) => {
    let updatedCropTypes = [...filters.cropTypes];
    
    if (updatedCropTypes.includes(cropType)) {
      updatedCropTypes = updatedCropTypes.filter(type => type !== cropType);
    } else {
      updatedCropTypes.push(cropType);
    }
    
    setFilters({ ...filters, cropTypes: updatedCropTypes });
  };
  
  const handleDateChange = (e) => {
    setFilters({ ...filters, harvestDateBefore: e.target.value });
  };
  
  const clearFilters = () => {
    setFilters({
      minRating: 0,
      sustainablePractices: [],
      harvestDateBefore: null,
      cropTypes: []
    });
  };
  
  // Check if any filters are active
  const hasActiveFilters = filters.minRating > 0 || 
    filters.sustainablePractices.length > 0 || 
    filters.harvestDateBefore || 
    filters.cropTypes.length > 0;
  
  // Sustainable practices options with icons
  const practicesOptions = [
    { id: 'organic', label: 'Organic Farming', icon: <Leaf className="h-4 w-4 mr-1 text-green-600" /> },
    { id: 'conservation', label: 'Conservation Tillage', icon: <Crop className="h-4 w-4 mr-1 text-green-600" /> },
    { id: 'rotation', label: 'Crop Rotation', icon: <RefreshCw className="h-4 w-4 mr-1 text-green-600" /> },
    { id: 'water', label: 'Water Conservation', icon: <Droplet className="h-4 w-4 mr-1 text-green-600" /> }
  ];
  
  // Crop type options with colors
  const cropTypeOptions = [
    { id: 'Coffee', color: 'bg-amber-100' },
    { id: 'Soybean', color: 'bg-yellow-100' },
    { id: 'Corn', color: 'bg-yellow-200' },
    { id: 'Wheat', color: 'bg-amber-200' },
    { id: 'Rice', color: 'bg-blue-100' }
  ];
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-green-600" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </h3>
        <button 
          onClick={clearFilters}
          className={`text-sm flex items-center px-2 py-1 rounded transition-all duration-300 ${
            hasActiveFilters 
              ? 'text-red-600 hover:bg-red-50' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          disabled={!hasActiveFilters}
        >
          <X className="h-4 w-4 mr-1" />
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Farmer Rating Filter */}
        <div className="bg-white p-3 rounded-md shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Star className="h-4 w-4 mr-1 text-amber-500" />
            Minimum Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  filters.minRating >= rating 
                    ? 'bg-amber-500 text-white shadow-md transform scale-110' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
        
        {/* Harvest Date Filter */}
        <div className="bg-white p-3 rounded-md shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-green-600" />
            Harvest Before
          </label>
          <input 
            type="date"
            value={filters.harvestDateBefore || ''}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
          />
        </div>
        
        {/* Sustainable Practices Filter */}
        <div className="bg-white p-3 rounded-md shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Leaf className="h-4 w-4 mr-1 text-green-600" />
            Sustainable Practices
          </label>
          <div className="space-y-2">
            {practicesOptions.map((practice) => (
              <div key={practice.id} className="flex items-center">
                <div 
                  onClick={() => handlePracticeChange(practice.id)}
                  className={`flex items-center cursor-pointer transition-all duration-300 ${
                    filters.sustainablePractices.includes(practice.id)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  } px-2 py-1 rounded-md w-full`}
                >
                  <input 
                    type="checkbox"
                    id={`practice-${practice.id}`}
                    checked={filters.sustainablePractices.includes(practice.id)}
                    onChange={() => {}}
                    className={`h-4 w-4 focus:ring-green-500 border-gray-300 rounded transition-all duration-300 ${
                      filters.sustainablePractices.includes(practice.id)
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <label htmlFor={`practice-${practice.id}`} className="ml-2 text-sm cursor-pointer flex items-center">
                    {practice.icon}
                    {practice.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Crop Type Filter */}
        <div className="bg-white p-3 rounded-md shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crop Type
          </label>
          <div className="space-y-2">
            {cropTypeOptions.map((cropType) => (
              <div key={cropType.id} className="flex items-center">
                <div 
                  onClick={() => handleCropTypeChange(cropType.id)}
                  className={`flex items-center cursor-pointer transition-all duration-300 ${
                    filters.cropTypes.includes(cropType.id)
                      ? `${cropType.color} text-gray-800`
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  } px-2 py-1 rounded-md w-full`}
                >
                  <input 
                    type="checkbox"
                    id={`crop-${cropType.id}`}
                    checked={filters.cropTypes.includes(cropType.id)}
                    onChange={() => {}}
                    className={`h-4 w-4 focus:ring-green-500 border-gray-300 rounded transition-all duration-300 ${
                      filters.cropTypes.includes(cropType.id)
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <label htmlFor={`crop-${cropType.id}`} className="ml-2 text-sm cursor-pointer">
                    {cropType.id}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.minRating > 0 && (
              <div className="flex items-center bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs">
                <Star className="h-3 w-3 mr-1 text-amber-500 fill-amber-500" />
                Rating: {filters.minRating}+
                <button 
                  onClick={() => setFilters({...filters, minRating: 0})}
                  className="ml-1 text-amber-800 hover:text-amber-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {filters.harvestDateBefore && (
              <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                <Calendar className="h-3 w-3 mr-1 text-green-600" />
                Before: {filters.harvestDateBefore}
                <button 
                  onClick={() => setFilters({...filters, harvestDateBefore: null})}
                  className="ml-1 text-green-800 hover:text-green-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {filters.sustainablePractices.map(practice => {
              const practiceOption = practicesOptions.find(p => p.id === practice);
              return (
                <div key={practice} className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                  {practiceOption?.icon}
                  {practiceOption?.label || practice}
                  <button 
                    onClick={() => handlePracticeChange(practice)}
                    className="ml-1 text-green-800 hover:text-green-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            
            {filters.cropTypes.map(cropType => {
              const cropOption = cropTypeOptions.find(c => c.id === cropType);
              return (
                <div 
                  key={cropType} 
                  className={`flex items-center px-2 py-1 rounded-md text-xs text-gray-800 ${cropOption?.color || 'bg-gray-100'}`}
                >
                  {cropType}
                  <button 
                    onClick={() => handleCropTypeChange(cropType)}
                    className="ml-1 text-gray-800 hover:text-gray-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;