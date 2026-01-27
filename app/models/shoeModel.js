import mongoose from 'mongoose';

const shoeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shoe name is required'],
    trim: true,
    unique: true
  },
  brand: {
    type: String,
    default: 'Unknown'
  },
  releaseYear: {
    type: Number,
    default: () => new Date().getFullYear()
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  size: [{
    type: Number
  }],
  color: [{
    type: String
  }],
  images: [{
    type: String 
  }]
}, {
  timestamps: true
});

const Shoes = mongoose.models.Shoes || mongoose.model('Shoes', shoeSchema);

export default Shoes;