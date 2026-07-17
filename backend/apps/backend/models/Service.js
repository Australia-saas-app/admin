const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  serviceId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  serviceType: {
    type: String,
    enum: ['technical', 'construction', 'real-estate', 'import-export', 'visa-traveling', 'solutions'],
    required: true,
    index: true
  },
  // Common fields for all service types
  title: {
    type: String,
    required: true,
    index: true
  },
  photo: {
    type: String, // URL to photo/image
    default: ''
  },
  photos: [String], // Multiple photos (for real estate)
  tag: String, // Tag for the service
  category: {
    type: String,
    required: true,
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: {
    type: String,
    required: true
  },
  // Visibility control
  isVisible: {
    type: Boolean,
    default: true,
    index: true
  },
  // Row ordering
  displayOrder: {
    type: Number,
    default: 0,
    index: true
  },
  // Real Estate specific fields
  propertyType: {
    type: String,
    enum: [
      // Residential
      'Houses', 'Flats', 'Apartments', 'Townhouses', 'Villas', 'Condominiums',
      // Commercial
      'Office Buildings', 'Stores', 'Shopping Malls', 'Hotel', 'Resorts', 'Co-working Spaces',
      // Industrial
      'Distribution Centers', 'Industrial Sites', 'Multi-Family Units', 'Parking Sites',
      'Factories', 'Warehouses', 'Logistics Sites', 'Units', 'Cold Storage', 'Recycling Centers',
      'Data Centers', 'Aircraft Hangars', 'Laboratories', 'Transportation', 'Fuel Stations',
      // Land
      'Raw Land', 'Development Land', 'Agricultural Land', 'Future Development Land',
      'Land Plots', 'Riverside Land', 'Seaside Land', 'Supervised Land', 'Other'
    ]
  },
  propertyStatus: {
    type: String,
    enum: ['Rent', 'Buy', 'Sale', 'Mortgage']
  },
  size: Number, // Square feet
  price: Number, // Price/budget
  budget: Number, // Alternative price field
  // Real Estate Features (multiple select)
  features: [{
    type: String,
    enum: [
      'Air conditioning', 'Assigned parking', 'Allows pets', 'Beachfront', 'BBQ grill',
      'Breakfast', 'Balcony/terrace', 'Backup Generator', 'Business center', 'Carbon monoxide alarm',
      'Carpet', 'Crib', 'CCTV', 'Central heat', 'Concierge service', 'Controlled access',
      'Dishwasher', 'Dryer', 'Lift / Elevator', 'EV charging', 'Electricity Connection',
      'Free parking', 'Fireplace', 'Fire Safety', 'Furnished', 'Garage parking', 'Gym',
      'Heating', 'Hardwood floor', 'High certified', 'Hair dryer', 'Instant Book',
      'King bed', 'Gas Connection', 'Security Guard', 'Water Supply', 'Garden',
      'Wheelchair accessible', 'Washing machine', 'Deck', 'Door parson',
      'Dry cleaning service', 'On site management', 'Outdoor space', 'Package service',
      'Pool', 'Pets allowed', 'Parking', 'Residents lounge', 'Roof deck', 'Storage',
      'Walk-in closet', 'Iron', 'Ski-in/ski-out', 'Smoke alarm', 'Self check-in',
      'Hot tub', 'Indoor fireplace', 'Smoking allowed', 'Internet & Network Ready',
      'Private attached bathroom', 'Washer', 'Heating', 'Dedicated workspace', 'TV'
    ]
  }],
  // Residential property specific fields
  beds: Number, // Number of bedrooms
  bathrooms: Number, // Number of bathrooms
  kitchen: Number, // Number of kitchens
  // Metadata
  createdBy: {
    type: String, // Admin email
    required: true
  },
  updatedBy: {
    type: String, // Admin email
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate service ID
ServiceSchema.statics.generateServiceId = function(serviceType) {
  const prefix = {
    'technical': 'TECH',
    'construction': 'CONST',
    'real-estate': 'RE',
    'import-export': 'IE',
    'visa-traveling': 'VT',
    'solutions': 'SOL'
  }[serviceType] || 'SRV';
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Auto-update updatedAt
ServiceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for efficient queries
ServiceSchema.index({ serviceType: 1, isVisible: 1, displayOrder: 1 });
ServiceSchema.index({ category: 1, isVisible: 1 });
ServiceSchema.index({ title: 'text', description: 'text' }); // Text search index

module.exports = mongoose.model('Service', ServiceSchema);

