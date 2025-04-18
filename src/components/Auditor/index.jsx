import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, ClipboardCheck, X, AlertCircle } from 'lucide-react';
import AuditorHeader from './AuditorHeader';
import PendingRequests from './PendingRequests';
import AuditDetail from './AuditDetail';
import { mockAudits } from './mockData';

const AuditorDashboard = () => {
  const [audits, setAudits] = useState([]);
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'

  // Load mock data
  useEffect(() => {
    setAudits(mockAudits);
    setFilteredAudits(mockAudits.filter(audit => audit.status === 'pending'));
  }, []);

  // Apply filters and search
  useEffect(() => {
    let results = [...audits];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(audit => 
        audit.farmerName.toLowerCase().includes(query) || 
        audit.cropType.toLowerCase().includes(query) ||
        audit.location.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(audit => audit.status === statusFilter);
    }
    
    setFilteredAudits(results);
  }, [searchQuery, statusFilter, audits]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleSelectAudit = (auditId) => {
    const audit = audits.find(a => a.id === auditId);
    setSelectedAudit(audit);
  };

  const handleBackToList = () => {
    setSelectedAudit(null);
  };

  const handleApproveAudit = (auditId, comments, carbonEstimate) => {
    const updatedAudits = audits.map(audit => {
      if (audit.id === auditId) {
        return {
          ...audit,
          status: 'approved',
          auditorComments: comments,
          carbonCredits: carbonEstimate,
          auditDate: new Date().toISOString()
        };
      }
      return audit;
    });
    
    setAudits(updatedAudits);
    setSelectedAudit(null);
  };

  const handleRejectAudit = (auditId, comments) => {
    const updatedAudits = audits.map(audit => {
      if (audit.id === auditId) {
        return {
          ...audit,
          status: 'rejected',
          auditorComments: comments,
          auditDate: new Date().toISOString()
        };
      }
      return audit;
    });
    
    setAudits(updatedAudits);
    setSelectedAudit(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <AuditorHeader />
      
      {!selectedAudit ? (
        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Auditor Dashboard</h2>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by farmer, crop, or location"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusFilter('pending')}
                  className={`px-4 py-2 rounded-md ${
                    statusFilter === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Pending
                </button>
                
                <button
                  onClick={() => handleStatusFilter('approved')}
                  className={`px-4 py-2 rounded-md ${
                    statusFilter === 'approved' 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <ClipboardCheck className="h-4 w-4 inline mr-1" />
                  Approved
                </button>
                
                <button
                  onClick={() => handleStatusFilter('rejected')}
                  className={`px-4 py-2 rounded-md ${
                    statusFilter === 'rejected' 
                      ? 'bg-red-100 text-red-800 border border-red-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <X className="h-4 w-4 inline mr-1" />
                  Rejected
                </button>
                
                <button
                  onClick={() => handleStatusFilter('all')}
                  className={`px-4 py-2 rounded-md ${
                    statusFilter === 'all' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
              </div>
            </div>
            
            {/* Results Info */}
            <div className="mb-4 text-gray-600">
              Showing {filteredAudits.length} audit requests
            </div>
          </div>
          
          <PendingRequests 
            audits={filteredAudits} 
            onSelectAudit={handleSelectAudit} 
          />
        </div>
      ) : (
        <AuditDetail 
          audit={selectedAudit} 
          onBack={handleBackToList}
          onApprove={handleApproveAudit}
          onReject={handleRejectAudit}
        />
      )}
    </div>
  );
};

export default AuditorDashboard;