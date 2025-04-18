import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, User, Leaf, FileText, Image, Clipboard, Check, X, Trash } from 'lucide-react';

const DocumentItem = ({ document }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-start">
      <div className="p-2 bg-gray-100 rounded-lg mr-3">
        {document.type === 'image' && <Image className="h-5 w-5 text-gray-600" />}
        {document.type === 'pdf' && <FileText className="h-5 w-5 text-gray-600" />}
        {document.type === 'spreadsheet' && <Clipboard className="h-5 w-5 text-gray-600" />}
      </div>
      <div className="flex-grow">
        <h4 className="text-sm font-medium text-gray-700">{document.name}</h4>
        <p className="text-xs text-gray-500">{document.description}</p>
      </div>
      <button className="text-blue-600 text-sm hover:text-blue-800">View</button>
    </div>
  );
};

const PracticeItem = ({ practice }) => {
  const practiceLabels = {
    organic: 'Organic Farming',
    conservation: 'Conservation Tillage',
    rotation: 'Crop Rotation',
    water: 'Water Conservation'
  };
  
  const practiceDescriptions = {
    organic: 'No synthetic pesticides or fertilizers used. Increases carbon sequestration in soil.',
    conservation: 'Minimal soil disturbance techniques used. Preserves soil carbon and reduces emissions.',
    rotation: 'Diverse planting cycles implemented. Enhances soil health and carbon storage capacity.',
    water: 'Efficient irrigation systems in place. Reduces water use and related energy consumption.'
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <Leaf className="h-5 w-5 text-green-600 mr-2" />
        <h4 className="text-md font-medium text-gray-800">{practiceLabels[practice]}</h4>
      </div>
      <p className="text-sm text-gray-600">{practiceDescriptions[practice]}</p>
    </div>
  );
};

const AuditDetail = ({ audit, onBack, onApprove, onReject }) => {
  const [comments, setComments] = useState('');
  const [carbonEstimate, setCarbonEstimate] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleApproveClick = () => {
    setIsApproving(true);
    setIsRejecting(false);
  };
  
  const handleRejectClick = () => {
    setIsRejecting(true);
    setIsApproving(false);
  };
  
  const handleCancelDecision = () => {
    setIsApproving(false);
    setIsRejecting(false);
  };
  
  const handleSubmitApproval = () => {
    if (!comments) {
      alert('Please provide comments for this approval');
      return;
    }
    
    if (!carbonEstimate) {
      alert('Please estimate the carbon credits');
      return;
    }
    
    onApprove(audit.id, comments, parseFloat(carbonEstimate));
  };
  
  const handleSubmitRejection = () => {
    if (!comments) {
      alert('Please provide comments for this rejection');
      return;
    }
    
    onReject(audit.id, comments);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Audit Requests
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 md:mb-0">
            {audit.quantity}kg {audit.cropType}
          </h2>
          
          <div className="flex space-x-3">
            {!isApproving && !isRejecting && audit.status === 'pending' && (
              <>
                <button 
                  onClick={handleApproveClick}
                  className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-md flex items-center transition-colors"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </button>
                
                <button 
                  onClick={handleRejectClick}
                  className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-md flex items-center transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </>
            )}
            
            {(isApproving || isRejecting) && (
              <button 
                onClick={handleCancelDecision}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center transition-colors"
              >
                <Trash className="h-4 w-4 mr-2" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Approval or Rejection Form */}
      {isApproving && (
        <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-lg font-medium text-green-800 mb-3">Approve This Crop</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Carbon Credits (TCO2e)
            </label>
            <input 
              type="number"
              step="0.01"
              value={carbonEstimate}
              onChange={(e) => setCarbonEstimate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. 5.25"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auditor Comments
            </label>
            <textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows="3"
              placeholder="Add your comments about this approval..."
              required
            />
          </div>
          
          <button 
            onClick={handleSubmitApproval}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <Check className="h-4 w-4 mr-2" />
            Confirm Approval
          </button>
        </div>
      )}
      
      {isRejecting && (
        <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-lg font-medium text-red-800 mb-3">Reject This Crop</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Rejection
            </label>
            <textarea 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              rows="3"
              placeholder="Explain why this crop submission is being rejected..."
              required
            />
          </div>
          
          <button 
            onClick={handleSubmitRejection}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Confirm Rejection
          </button>
        </div>
      )}
      
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Farmer Information</h3>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium">{audit.farmerName}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-700">{audit.location}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-700">Harvest expected by {formatDate(audit.harvestDate)}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <FileText className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-700">Submitted on {formatDate(audit.submissionDate)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Crop Details</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-500">Crop Type</p>
                <p className="text-sm font-medium text-gray-700">{audit.cropType}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="text-sm font-medium text-gray-700">{audit.quantity} kg</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Area</p>
                <p className="text-sm font-medium text-gray-700">{audit.area} hectares</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Expected Yield</p>
                <p className="text-sm font-medium text-gray-700">{audit.quantity / audit.area} kg/ha</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sustainable Practices */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Sustainable Practices</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audit.sustainablePractices.map(practice => (
            <PracticeItem key={practice} practice={practice} />
          ))}
        </div>
      </div>
      
      {/* Documents */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Submitted Documents</h3>
        
        <div className="space-y-3">
          {audit.documents.map((doc, index) => (
            <DocumentItem key={index} document={doc} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditDetail;