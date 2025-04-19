// Mock data for auditor dashboard
export const mockAudits = [
    {
      id: 1,
      cropType: 'Coffee',
      quantity: 2000,
      harvestDate: '2025-12-15',
      submissionDate: '2025-04-15',
      location: 'Minas Gerais, Brazil',
      farmerName: 'João Silva',
      status: 'pending',
      area: 4.5,
      sustainablePractices: ['organic', 'water', 'conservation'],
      documents: [
        {
          type: 'pdf',
          name: 'Farm_Certificate.pdf',
          description: 'Organic certification document'
        },
        {
          type: 'image',
          name: 'Farm_Aerial_View.jpg',
          description: 'Aerial view of the farm showing coffee plantation'
        },
        {
          type: 'pdf',
          name: 'Soil_Analysis.pdf',
          description: 'Report on soil quality and carbon content'
        },
        {
          type: 'spreadsheet',
          name: 'Production_History.xlsx',
          description: 'Last 3 years of production data'
        }
      ]
    },
    {
      id: 2,
      cropType: 'Soybean',
      quantity: 5000,
      harvestDate: '2025-09-30',
      submissionDate: '2025-04-10',
      location: 'Mato Grosso, Brazil',
      farmerName: 'Maria Santos',
      status: 'pending',
      area: 12.0,
      sustainablePractices: ['rotation', 'conservation'],
      documents: [
        {
          type: 'pdf',
          name: 'Land_Ownership.pdf',
          description: 'Property deed and registration'
        },
        {
          type: 'image',
          name: 'Field_Photos.jpg',
          description: 'Photos showing crop rotation practices'
        },
        {
          type: 'spreadsheet',
          name: 'Yield_Projections.xlsx',
          description: 'Expected yield based on historical data'
        }
      ]
    },
    {
      id: 3,
      cropType: 'Corn',
      quantity: 10000,
      harvestDate: '2025-10-20',
      submissionDate: '2025-04-05',
      location: 'Goiás, Brazil',
      farmerName: 'Carlos Oliveira',
      status: 'approved',
      auditDate: '2025-04-12',
      area: 15.5,
      sustainablePractices: ['rotation', 'water'],
      carbonCredits: 5.2,
      auditorComments: 'All documentation is complete and verified. Sustainable practices are well-implemented.',
      documents: [
        {
          type: 'pdf',
          name: 'Water_Management.pdf',
          description: 'Documentation of water conservation systems'
        },
        {
          type: 'image',
          name: 'Field_Irrigation.jpg',
          description: 'Photos of drip irrigation system'
        }
      ]
    },
    {
      id: 4,
      cropType: 'Rice',
      quantity: 3000,
      harvestDate: '2025-11-10',
      submissionDate: '2025-03-25',
      location: 'Rio Grande do Sul, Brazil',
      farmerName: 'Ana Pereira',
      status: 'rejected',
      auditDate: '2025-04-02',
      area: 6.0,
      sustainablePractices: ['organic', 'water', 'conservation', 'rotation'],
      auditorComments: 'The production estimate exceeds historical yield for the area. Documentation for organic certification needs to be updated.',
      documents: [
        {
          type: 'pdf',
          name: 'Expired_Certification.pdf',
          description: 'Expired organic certification'
        },
        {
          type: 'spreadsheet',
          name: 'Production_Estimates.xlsx',
          description: 'Yield projections'
        }
      ]
    },
    {
      id: 5,
      cropType: 'Wheat',
      quantity: 4500,
      harvestDate: '2025-08-15',
      submissionDate: '2025-04-08',
      location: 'Paraná, Brazil',
      farmerName: 'Roberto Costa',
      status: 'pending',
      area: 10.2,
      sustainablePractices: ['conservation'],
      documents: [
        {
          type: 'pdf',
          name: 'Soil_Conservation.pdf',
          description: 'Documentation of tillage practices'
        },
        {
          type: 'image',
          name: 'Field_Status.jpg',
          description: 'Current state of wheat field'
        }
      ]
    },
    {
      id: 6,
      cropType: 'Coffee',
      quantity: 1500,
      harvestDate: '2026-01-20',
      submissionDate: '2025-03-15',
      location: 'São Paulo, Brazil',
      farmerName: 'Fernanda Lima',
      status: 'approved',
      auditDate: '2025-03-25',
      area: 3.5,
      sustainablePractices: ['organic', 'water'],
      carbonCredits: 6.8,
      auditorComments: 'Excellent implementation of organic practices. All documentation verified.',
      documents: [
        {
          type: 'pdf',
          name: 'Organic_Certification.pdf',
          description: 'Current organic certification'
        },
        {
          type: 'image',
          name: 'Water_Management.jpg',
          description: 'Photos of water conservation system'
        }
      ]
    },
    {
      id: 7,
      cropType: 'Soybean',
      quantity: 8000,
      harvestDate: '2025-09-10',
      submissionDate: '2025-04-01',
      location: 'Tocantins, Brazil',
      farmerName: 'Paulo Mendes',
      status: 'rejected',
      auditDate: '2025-04-10',
      area: 18.0,
      sustainablePractices: ['rotation'],
      auditorComments: 'Documentation incomplete. Could not verify land ownership and sustainable practices implementation.',
      documents: [
        {
          type: 'image',
          name: 'Field_Photo.jpg',
          description: 'Single photo of the field'
        }
      ]
    },
    {
      id: 8,
      cropType: 'Corn',
      quantity: 12000,
      harvestDate: '2025-10-30',
      submissionDate: '2025-04-12',
      location: 'Minas Gerais, Brazil',
      farmerName: 'Antônio Souza',
      status: 'pending',
      area: 20.0,
      sustainablePractices: ['water', 'conservation'],
      documents: [
        {
          type: 'pdf',
          name: 'Land_Records.pdf',
          description: 'Property documentation'
        },
        {
          type: 'spreadsheet',
          name: 'Water_Usage.xlsx',
          description: 'Water conservation data'
        }
      ]
    }
  ];
  
  // Supporting data
  export const sustainablePracticesOptions = [
    { id: 'organic', label: 'Organic Farming', description: 'No synthetic pesticides or fertilizers' },
    { id: 'conservation', label: 'Conservation Tillage', description: 'Minimizing soil disturbance' },
    { id: 'rotation', label: 'Crop Rotation', description: 'Diverse planting cycles' },
    { id: 'water', label: 'Water Conservation', description: 'Efficient irrigation systems' }
  ];