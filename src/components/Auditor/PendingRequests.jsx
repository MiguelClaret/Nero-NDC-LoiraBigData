import React from 'react';
import { Calendar, MapPin, User, ChevronRight, Leaf, FileText, AlertCircle, Check, X } from 'lucide-react';

const StatusBadge = ({ status }) => {
  switch(status) {
    case 'pending':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="h-3 w-3 mr-1" />
          Approved
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="h-3 w-3 mr-1" />
          Rejected
        </span>
      );
    default:
      return null;
  }
};

const PendingRequests = ({ audits, onSelectAudit }) => {
  // Format the date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Generate sustainable practices badges
  const renderPracticeCount = (practices) => {
    if (!practices || practices.length === 0) return null;
    
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
        <Leaf className="h-3 w-3 mr-1" />
        {practices.length} practices
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {audits.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No audit requests match your criteria.
          </div>
        ) : (
          audits.map(audit => (
            <div 
              key={audit.id}
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex flex-col md:flex-row md:items-center"
              onClick={() => onSelectAudit(audit.id)}
            >
              <div className="flex-grow">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-800 mr-3">
                    {audit.quantity}kg {audit.cropType}
                  </h3>
                  <StatusBadge status={audit.status} />
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center text-sm text-gray-600 space-y-1 md:space-y-0 md:space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-1.5" />
                    {audit.farmerName}
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-1.5" />
                    {audit.location}
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-1.5" />
                    {formatDate(audit.harvestDate)}
                  </div>
                  
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-500 mr-1.5" />
                    {audit.documents.length} Documents
                  </div>
                </div>
                
                <div className="mt-2">
                  {renderPracticeCount(audit.sustainablePractices)}
                  
                  {audit.status === 'pending' && (
                    <span className="ml-2 text-xs text-yellow-600">
                      Submitted {formatDate(audit.submissionDate)}
                    </span>
                  )}
                  
                  {audit.status === 'approved' && (
                    <span className="ml-2 text-xs text-green-600">
                      Approved {formatDate(audit.auditDate)} • {audit.carbonCredits} TCO2e
                    </span>
                  )}
                  
                  {audit.status === 'rejected' && (
                    <span className="ml-2 text-xs text-red-600">
                      Rejected {formatDate(audit.auditDate)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingRequests;