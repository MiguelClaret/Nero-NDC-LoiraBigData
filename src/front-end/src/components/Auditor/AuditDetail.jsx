
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, User, Leaf, FileText, Image, Clipboard, Check, X, Trash, Calculator, CheckCircle, ExternalLink } from 'lucide-react';
import { auditHarvestUserOp } from "../../utils/userOp/auditHarvestUserOp";
import { getSigner } from "../../utils/aaUtils";

const DocumentItem = ({ document }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-start">
      <div className="p-2 bg-gray-100 rounded-lg mr-3">
        {document.type === "image" && (
          <Image className="h-5 w-5 text-gray-600" />
        )}
        {document.type === "pdf" && (
          <FileText className="h-5 w-5 text-gray-600" />
        )}
        {document.type === "spreadsheet" && (
          <Clipboard className="h-5 w-5 text-gray-600" />
        )}
      </div>
      <div className="flex-grow">
        <h4 className="text-sm font-medium text-gray-700">{document.name}</h4>
        <p className="text-xs text-gray-500">{document.description}</p>
      </div>
      <button className="text-blue-600 text-sm hover:text-blue-800">
        View
      </button>
    </div>
  );
};

const PracticeItem = ({ practice }) => {
  const practiceLabels = {
    organic: "Organic Farming",
    conservation: "Conservation Tillage",
    rotation: "Crop Rotation",
    water: "Water Conservation",
  };

  const practiceDescriptions = {
    organic:
      "No synthetic pesticides or fertilizers used. Increases carbon sequestration in soil.",
    conservation:
      "Minimal soil disturbance techniques used. Preserves soil carbon and reduces emissions.",
    rotation:
      "Diverse planting cycles implemented. Enhances soil health and carbon storage capacity.",
    water:
      "Efficient irrigation systems in place. Reduces water use and related energy consumption.",
  };

  // Crédito de carbono estimado para cada prática (toneladas por hectare)
  const practiceCarbonCredits = {
    organic: 1.2,
    conservation: 0.8,
    rotation: 0.6,
    water: 0.4,
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center mb-2">
        <Leaf className="h-5 w-5 text-green-600 mr-2" />
        <h4 className="text-md font-medium text-gray-800">
          {practiceLabels[practice]}
        </h4>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        {practiceDescriptions[practice]}
      </p>
      <div className="bg-green-50 p-2 rounded text-xs text-green-700">
        Estimated impact: {practiceCarbonCredits[practice]} TCO2e per hectare
      </div>
    </div>
  );
};

const AuditDetail = ({ audit, onBack, onApprove, onReject }) => {
  const [comments, setComments] = useState("");
  const [carbonEstimate, setCarbonEstimate] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [automaticEstimate, setAutomaticEstimate] = useState(0);

  const [txHash, setTxHash] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  

  // Calcular estimativa automática baseada nas práticas sustentáveis e área
  useEffect(() => {
    if (audit) {
      // Base de crédito por prática (toneladas por hectare)
      const practiceCredits = {
        organic: 1.2,
        conservation: 0.8,
        rotation: 0.6,
        water: 0.4,
      };

      // Calcular com base nas práticas e área da fazenda
      let totalCredits = 0;
      audit.sustainablePractices.forEach((practice) => {
        if (practiceCredits[practice]) {
          totalCredits += practiceCredits[practice];
        }
      });

      // Multiplicar pela área total da fazenda
      const estimatedCredits = (totalCredits * audit.area).toFixed(2);
      setAutomaticEstimate(estimatedCredits);
      setCarbonEstimate(estimatedCredits);
    }
  }, [audit]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
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


const handleSubmitApproval = async () => {
  if (!comments) {
    alert("Please provide comments for this approval");
    return;
  }

  if (!carbonEstimate) {
    alert("Please estimate the carbon credits");
    return;
  }

  try {
    const signer = await getSigner();
    const address = await signer.getAddress();

    const hash = await auditHarvestUserOp(signer, {
      harvestId: audit.id,
      action: "approve",
      tco2Amount: carbonEstimate,
      toAddress: address,
      paymentType: "0"
      });

      setTxHash(hash);

    onApprove(audit.id, comments, parseFloat(carbonEstimate));
  } catch (error) {
    console.error("Erro ao aprovar safra:", error);
    alert("Erro ao aprovar safra. Verifique o console.");
  }
};

const handleSubmitRejection = async () => {
  if (!comments) {
    alert("Explique o motivo da rejeição.");
    return;
  }

  try {
    const signer = await getSigner();
    const hash = await auditHarvestUserOp(signer, {
    harvestId: audit.id,
    action: "reject",
    paymentType: "0"
    });

    setTxHash(hash);

    console.log("Safra rejeitada com sucesso!", hash);
    onReject(audit.id, comments);
  } catch (err) {
    alert("Erro ao rejeitar: " + err.message);
  }
};
  
  const calculateCarbonCredits = () => {
    const calculatedEstimate = automaticEstimate;
    setCarbonEstimate(calculatedEstimate);
  };

  if (!audit) return null;

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
            {!isApproving && !isRejecting && audit.status === "pending" && (
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
          <h3 className="text-lg font-medium text-green-800 mb-3">
            Approve This Crop
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Carbon Credits (TCO2e)
            </label>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.01"
                value={carbonEstimate}
                onChange={(e) => setCarbonEstimate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. 5.25"
                required
              />

              <button
                type="button"
                onClick={calculateCarbonCredits}
                className="shrink-0 bg-green-100 text-green-700 p-2 rounded-md hover:bg-green-200 transition-colors"
                title="Calculate based on practices and area"
              >
                <Calculator className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-green-600 mt-1">
              Automatic estimate: {automaticEstimate} TCO2e (based on{" "}
              {audit.area} hectares and {audit.sustainablePractices.length}{" "}
              practices)
            </p>
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
          <h3 className="text-lg font-medium text-red-800 mb-3">
            Reject This Crop
          </h3>

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
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Farmer Information
          </h3>

          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium">
                {audit.farmerName}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-700">{audit.location}</span>
            </div>

            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-700">
                Harvest expected by {formatDate(audit.harvestDate)}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <FileText className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-gray-700">
                Submitted on {formatDate(audit.submissionDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Crop Details
          </h3>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-500">Crop Type</p>
                <p className="text-sm font-medium text-gray-700">
                  {audit.cropType}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="text-sm font-medium text-gray-700">
                  {audit.quantity} kg
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Area</p>
                <p className="text-sm font-medium text-gray-700">
                  {audit.area} hectares
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Expected Yield</p>
                <p className="text-sm font-medium text-gray-700">
                  {(audit.quantity / audit.area).toFixed(2)} kg/ha
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Practices */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Sustainable Practices
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audit.sustainablePractices.map((practice) => (
            <PracticeItem key={practice} practice={practice} />
          ))}
        </div>
      </div>

      {/* Documents */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Submitted Documents
        </h3>

        <div className="space-y-3">
          {audit.documents.map((doc, index) => (
            <DocumentItem key={index} document={doc} />
          ))}
        </div>
      </div>

      {txHash && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center max-w-md">
      <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">Audit Successful!</h3>
      <p className="text-gray-600 text-center mb-4">
        The crop has been successfully audited on the blockchain.
      </p>

      <div className="w-full bg-gray-50 p-3 rounded-lg mb-4">
        <p className="text-sm text-gray-600 mb-1">Transaction Hash:</p>
        <div className="flex items-center gap-2">
          <code className="text-xs bg-gray-100 p-2 rounded flex-1 text-ellipsis overflow-hidden">
            {txHash.slice(0, 6)}...{txHash.slice(-4)}
          </code>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(txHash);
              setCopyFeedback("copied");
              setTimeout(() => setCopyFeedback(""), 2000);
            }}
            className="p-2 hover:bg-gray-200 rounded"
          >
            {copyFeedback ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
          </button>
        </div>
        <a
          href={`https://testnet.neroscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 text-sm underline mt-2 inline-block"
        >
          View on Explorer
        </a>
      </div>

      <button
        onClick={() => {
          setTxHash('');
          setIsApproving(false);
          setIsRejecting(false);
        }}
        className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Back
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default AuditDetail;
