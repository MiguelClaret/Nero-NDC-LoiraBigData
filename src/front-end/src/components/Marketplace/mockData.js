// Mock data for crop listings
export const mockListings = [
    {
      id: 1,
      cropType: 'Coffee',
      quantity: 2000,
      harvestDate: '2025-12-15',
      location: 'Minas Gerais, Brazil',
      farmerName: 'João Silva',
      farmerRating: 4.8,
      pricePerKg: 5.25,
      sustainablePractices: ['organic', 'water', 'conservation'],
      carbonCredits: 8.4,
      totalValue: 10500
    },
    {
      id: 2,
      cropType: 'Soybean',
      quantity: 5000,
      harvestDate: '2025-09-30',
      location: 'Mato Grosso, Brazil',
      farmerName: 'Maria Santos',
      farmerRating: 4.2,
      pricePerKg: 0.85,
      sustainablePractices: ['rotation', 'conservation'],
      carbonCredits: 3.5,
      totalValue: 4250
    },
    {
      id: 3,
      cropType: 'Corn',
      quantity: 10000,
      harvestDate: '2025-10-20',
      location: 'Goiás, Brazil',
      farmerName: 'Carlos Oliveira',
      farmerRating: 3.9,
      pricePerKg: 0.65,
      sustainablePractices: ['rotation', 'water'],
      carbonCredits: 2.8,
      totalValue: 6500
    },
    {
      id: 4,
      cropType: 'Rice',
      quantity: 3000,
      harvestDate: '2025-11-10',
      location: 'Rio Grande do Sul, Brazil',
      farmerName: 'Ana Pereira',
      farmerRating: 5.0,
      pricePerKg: 1.20,
      sustainablePractices: ['organic', 'water', 'conservation', 'rotation'],
      carbonCredits: 10.2,
      totalValue: 3600
    },
    {
      id: 5,
      cropType: 'Wheat',
      quantity: 4500,
      harvestDate: '2025-08-15',
      location: 'Paraná, Brazil',
      farmerName: 'Roberto Costa',
      farmerRating: 4.5,
      pricePerKg: 0.90,
      sustainablePractices: ['conservation'],
      carbonCredits: 1.8,
      totalValue: 4050
    },
    {
      id: 6,
      cropType: 'Coffee',
      quantity: 1500,
      harvestDate: '2026-01-20',
      location: 'São Paulo, Brazil',
      farmerName: 'Fernanda Lima',
      farmerRating: 4.3,
      pricePerKg: 5.50,
      sustainablePractices: ['organic', 'water'],
      carbonCredits: 6.5,
      totalValue: 8250
    },
    {
      id: 7,
      cropType: 'Soybean',
      quantity: 8000,
      harvestDate: '2025-09-10',
      location: 'Tocantins, Brazil',
      farmerName: 'Paulo Mendes',
      farmerRating: 3.7,
      pricePerKg: 0.82,
      sustainablePractices: ['rotation'],
      carbonCredits: 2.2,
      totalValue: 6560
    },
    {
      id: 8,
      cropType: 'Corn',
      quantity: 12000,
      harvestDate: '2025-10-30',
      location: 'Minas Gerais, Brazil',
      farmerName: 'Antônio Souza',
      farmerRating: 4.1,
      pricePerKg: 0.68,
      sustainablePractices: ['water', 'conservation'],
      carbonCredits: 5.4,
      totalValue: 8160
    },
    {
      id: 9,
      cropType: 'Rice',
      quantity: 2500,
      harvestDate: '2026-02-15',
      location: 'Santa Catarina, Brazil',
      farmerName: 'Luiza Gomes',
      farmerRating: 4.9,
      pricePerKg: 1.25,
      sustainablePractices: ['organic', 'rotation', 'water'],
      carbonCredits: 9.8,
      totalValue: 3125
    }
  ];
  
  // Supporting data for filters
  export const sustainablePracticesOptions = [
    { id: 'organic', label: 'Organic Farming', description: 'No synthetic pesticides or fertilizers' },
    { id: 'conservation', label: 'Conservation Tillage', description: 'Minimizing soil disturbance' },
    { id: 'rotation', label: 'Crop Rotation', description: 'Diverse planting cycles' },
    { id: 'water', label: 'Water Conservation', description: 'Efficient irrigation systems' }
  ];
  
  export const cropTypeOptions = [
    'Coffee',
    'Soybean',
    'Corn',
    'Wheat',
    'Rice'
  ];