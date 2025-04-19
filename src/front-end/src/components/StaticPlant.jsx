const StaticPlant = () => {
    return (
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg bg-green-50 flex items-center justify-center">
        <div className="w-64 h-64 bg-green-100 rounded-full flex items-center justify-center">
          <i className="fas fa-seedling text-green-600 text-6xl"></i>
        </div>
        <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">
          Plant Illustration
        </div>
      </div>
    )
  }
  
  export default StaticPlant
  