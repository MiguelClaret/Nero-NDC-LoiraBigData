"use client"

import { useState, useEffect } from "react"
import { X, MessageCircle, AlertTriangle } from "lucide-react"

const PurchaseModal = ({ isOpen, onClose, listing, onConfirm }) => {
  const [quantity, setQuantity] = useState("")
  const [total, setTotal] = useState(0)
  const [platformFee, setPlatformFee] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (quantity && !isNaN(quantity)) {
      const qty = Number.parseInt(quantity)
      const sub = (listing.pricePerKg * qty).toFixed(2)
      setSubtotal(sub)

      // Calculate 5% platform fee
      const fee = (sub * 0.05).toFixed(2)
      setPlatformFee(fee)

      // Calculate total
      setTotal((Number.parseFloat(sub) + Number.parseFloat(fee)).toFixed(2))
    } else {
      setSubtotal(0)
      setPlatformFee(0)
      setTotal(0)
    }
  }, [quantity, listing])

  const handleConfirm = () => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onConfirm()
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-sm shadow-lg animate-fadeIn text-slate-50">
        {showSuccess ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl animate-pulse">
              ✓
            </div>
            <p className="text-xl font-semibold text-slate-50 mb-2">Purchase Confirmed!</p>
            <p className="text-slate-300">Tokens will be sent to your wallet shortly.</p>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-700 p-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-center w-full">Buy Crop Token (#{listing.id})</h2>
              <button onClick={onClose} className="text-slate-300 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <span>Crop:</span>
                <span className="font-medium">{listing.cropType}</span>
              </div>

              <div className="flex justify-between">
                <span>Producer:</span>
                <span className="font-medium">{listing.farmerName}</span>
              </div>

              <div className="flex justify-between">
                <span>Price per kg:</span>
                <span className="font-medium">${listing.pricePerKg}</span>
              </div>

              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-medium">{listing.quantity} kg</span>
              </div>

              <div className="flex items-center border-t border-slate-700 pt-3">
                <span className="mr-2">Quantity to Buy:</span>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  max={listing.quantity}
                  className="bg-slate-700 border border-slate-600 rounded p-1 w-20 text-right focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="0"
                />
                <span className="ml-2">kg</span>
              </div>
            </div>

            <div className="border-t border-slate-700 p-4 space-y-2 bg-slate-700 rounded-b-lg">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Platform Fee (5%):</span>
                <span>${platformFee}</span>
              </div>

              <div className="flex justify-between font-semibold border-t border-slate-600 pt-2 mt-2">
                <span>Total:</span>
                <span>${total}</span>
              </div>
            </div>

            <div className="border-t border-slate-700 p-3 space-y-2 text-xs text-slate-300">
              <div className="flex items-start">
                <MessageCircle size={14} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>You'll receive crop tokens in your wallet.</span>
              </div>

              <div className="flex items-start">
                <AlertTriangle size={14} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>Gas is already sponsored via Paymaster.</span>
              </div>
            </div>

            <div className="border-t border-slate-700 p-3 flex justify-between">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className={`px-3 py-1.5 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors text-sm text-white ${
                  !quantity || quantity <= 0 || quantity > listing.quantity
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-md"
                }`}
                disabled={!quantity || quantity <= 0 || quantity > listing.quantity}
              >
                Confirm Purchase
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PurchaseModal
