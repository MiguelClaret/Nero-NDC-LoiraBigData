import React, { useState } from 'react';
import { 
  Leaf, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Droplets, 
  Sprout, 
  Recycle, 
  Wind 
} from 'lucide-react';

const SustainablePracticeCard = ({ id, title, description, icon: Icon, isSelected, onChange }) => {
  return (
    <div 
      className={`cursor-pointer rounded-lg p-4 transition-all duration-300 border ${
        isSelected 
          ? 'border-green-500 bg-green-50 shadow-[0_0_15px_rgba(74,222,128,0.5)]' 
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
      onClick={() => onChange(id, !isSelected)}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-full ${isSelected ? 'bg-green-100' : 'bg-gray-100'} mr-3`}>
          <Icon className={`h-5 w-5 ${isSelected ? 'text-green-600 animate-pulse' : 'text-gray-500'}`} />
        </div>
        <div>
          <h4 className={`font-medium mb-1 ${isSelected ? 'text-green-700' : 'text-gray-800'}`}>
            {title}
          </h4>
          <p className={`text-xs ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const CropForm = ({ formData, handleInputChange, handleCheckboxChange, handleStepOneSubmit }) => {
  // Map to track which cards are selected
  const [selectedPractices, setSelectedPractices] = useState(
    formData.sustainablePractices || []
  );
  
  // Form validation state
  const [dateError, setDateError] = useState('');
  
  // Handle card selection
  const handlePracticeSelection = (practiceId, isSelected) => {
    let updatedPractices = [...selectedPractices];
    
    if (isSelected) {
      updatedPractices.push(practiceId);
    } else {
      updatedPractices = updatedPractices.filter(id => id !== practiceId);
    }
    
    setSelectedPractices(updatedPractices);
    
    // Update the form data via the parent component's handler
    const mockEvent = {
      target: {
        name: 'sustainablePractices',
        value: practiceId,
        checked: isSelected
      }
    };
    handleCheckboxChange(mockEvent);
  };
  
  // Validate harvest date is in the future
  const validateDate = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    
    // Clear hours, minutes, seconds for comparison
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setDateError('Harvest date must be in the future');
    } else {
      setDateError('');
    }
    
    // Still update the form data
    handleInputChange(e);
  };
  
  // Override submit to check date is valid
  const onSubmit = (e) => {
    e.preventDefault();
    
    // Check date is valid before submitting
    if (dateError) {
      return;
    }
    
    handleStepOneSubmit(e);
  };
  
  // List of sustainable practices with descriptions
  const sustainablePractices = [
    {
      id: 'organic',
      title: 'Organic Farming',
      description: 'No synthetic pesticides or fertilizers, increasing carbon sequestration',
      icon: Sprout
    },
    {
      id: 'conservation',
      title: 'Conservation Tillage',
      description: 'Minimal soil disturbance, preserving soil carbon and reducing emissions',
      icon: Recycle
    },
    {
      id: 'rotation',
      title: 'Crop Rotation',
      description: 'Diverse planting cycles that enhance soil health and carbon storage',
      icon: Wind
    },
    {
      id: 'water',
      title: 'Water Conservation',
      description: 'Efficient irrigation systems reducing water use and energy consumption',
      icon: Droplets
    }
  ];
  
  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Crop Details</h2>
      <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
        <p className="text-green-700 text-sm">
          <span className="font-semibold">Token Combo:</span> For each crop token, you'll receive a Carbon Credit token based on your sustainable practices. These tokens form an NFT Combo that can be traded in our marketplace.
        </p>
      </div>
      
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crop Type
            </label>
            <select 
              name="cropType"
              value={formData.cropType}
              onChange={handleInputChange}
              className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Select crop type</option>
              <option value="coffee">Coffee</option>
              <option value="soybean">Soybean</option>
              <option value="corn">Corn</option>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Quantity (kg)
            </label>
            <input 
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. 1000"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1 text-green-600" />
              Expected Harvest Date
            </label>
            <input 
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={validateDate}
              className={`w-full p-2 bg-white text-gray-800 border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              required
            />
            {dateError && (
              <p className="text-red-500 text-xs mt-1">{dateError}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="h-4 w-4 inline mr-1 text-green-600" />
              Farm Location
            </label>
            <input 
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="City, State"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Leaf className="h-4 w-4 inline mr-1 text-green-600" />
              Sustainable Practices (Select all that apply)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Each practice increases your carbon credit allocation and improves your NFT value.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sustainablePractices.map(practice => (
                <SustainablePracticeCard
                  key={practice.id}
                  id={practice.id}
                  title={practice.title}
                  description={practice.description}
                  icon={practice.icon}
                  isSelected={selectedPractices.includes(practice.id)}
                  onChange={handlePracticeSelection}
                />
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition duration-300 flex items-center justify-center"
              disabled={!!dateError}
            >
              Register Crop
              <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CropForm;