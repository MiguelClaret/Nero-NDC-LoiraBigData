import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Calendar, Leaf, MapPin, Archive, DollarSign } from 'lucide-react';
import FiltersPanel from './FiltersPanel';
import CropCard from './CropCard';
import { mockListings } from './mockData';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minRating: 0,
    sustainablePractices: [],
    harvestDateBefore: null,
    cropTypes: []
  });

  // Load mock data
  useEffect(() => {
    setListings(mockListings);
    setFilteredListings(mockListings);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let results = [...listings];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(listing => 
        listing.cropType.toLowerCase().includes(query) || 
        listing.farmerName.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query)
      );
    }
    
    // Apply rating filter
    if (filters.minRating > 0) {
      results = results.filter(listing => listing.farmerRating >= filters.minRating);
    }
    
    // Apply sustainable practices filter
    if (filters.sustainablePractices.length > 0) {
      results = results.filter(listing => 
        filters.sustainablePractices.every(practice => 
          listing.sustainablePractices.includes(practice)
        )
      );
    }
    
    // Apply crop type filter
    if (filters.cropTypes.length > 0) {
      results = results.filter(listing => 
        filters.cropTypes.includes(listing.cropType)
      );
    }
    
    // Apply harvest date filter
    if (filters.harvestDateBefore) {
      const targetDate = new Date(filters.harvestDateBefore);
      results = results.filter(listing => {
        const harvestDate = new Date(listing.harvestDate);
        return harvestDate <= targetDate;
      });
    }
    
    setFilteredListings(results);
  }, [searchQuery, filters, listings]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-6">Crop Marketplace</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <p className="text-gray-700 mb-6">
          Browse sustainable farming opportunities. Each listing includes carbon credits and a combination token (NFT) with both crop yield and environmental impact.
        </p>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by crop, farmer, or location"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          
          <button
            onClick={toggleFilters}
            className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 px-4 py-2 rounded-md flex items-center"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <FiltersPanel filters={filters} setFilters={setFilters} />
        )}
        
        {/* Results Info */}
        <div className="mb-4 text-gray-600">
          Showing {filteredListings.length} results
        </div>
      </div>
      
      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map(listing => (
          <CropCard key={listing.id} listing={listing} />
        ))}
      </div>
      
      {filteredListings.length === 0 && (
        <div className="text-center p-12 bg-white rounded-lg shadow mt-6">
          <p className="text-gray-600">No listings match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;