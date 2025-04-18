import React from 'react';
import { Star, Calendar, Leaf, X } from 'lucide-react';

const FiltersPanel = ({ filters, setFilters }) => {
  const handleRatingChange = (rating) => {
    setFilters({ ...filters, minRating: rating });
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
  
  // Sustainable practices options
  const practicesOptions = [
    { id: 'organic', label: 'Organic Farming' },
    { id: 'conservation', label: 'Conservation Tillage' },
    { id: 'rotation', label: 'Crop Rotation' },
    { id: 'water', label: 'Water Conservation' }
  ];
  
  // Crop type options
  const cropTypeOptions = [
    'Coffee',
    'Soybean',
    'Corn',
    'Wheat',
    'Rice'
  ];
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
        >
          <X className="h-4 w-4 mr-1" />
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Farmer Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Star className="h-4 w-4 mr-1 text-amber-500" />
            Minimum Rating
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  filters.minRating >= rating 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
        
        {/* Harvest Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-green-600" />
            Harvest Before
          </label>
          <input 
            type="date"
            value={filters.harvestDateBefore || ''}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        {/* Sustainable Practices Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Leaf className="h-4 w-4 mr-1 text-green-600" />
            Sustainable Practices
          </label>
          <div className="space-y-1">
            {practicesOptions.map((practice) => (
              <div key={practice.id} className="flex items-center">
                <input 
                  type="checkbox"
                  id={`practice-${practice.id}`}
                  checked={filters.sustainablePractices.includes(practice.id)}
                  onChange={() => handlePracticeChange(practice.id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor={`practice-${practice.id}`} className="ml-2 text-sm text-gray-600">
                  {practice.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Crop Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crop Type
          </label>
          <div className="space-y-1">
            {cropTypeOptions.map((cropType) => (
              <div key={cropType} className="flex items-center">
                <input 
                  type="checkbox"
                  id={`crop-${cropType}`}
                  checked={filters.cropTypes.includes(cropType)}
                  onChange={() => handleCropTypeChange(cropType)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor={`crop-${cropType}`} className="ml-2 text-sm text-gray-600">
                  {cropType}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;