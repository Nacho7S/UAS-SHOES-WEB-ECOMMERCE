import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  shoeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shoes',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1'],
    default: 1
  },
  size: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  priceAtAdd: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  
  },
  items: [cartItemSchema],
  couponCode: {
    type: String,
    default: null
  },
  discountAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true  
});


cartSchema.methods.calculateTotals = function() {
  const subtotal = this.items.reduce((sum, item) => {
    return sum + (item.priceAtAdd * item.quantity);
  }, 0);
  
  const total = subtotal - this.discountAmount;
  
  return {
    subtotal,
    discount: this.discountAmount,
    total: total > 0 ? total : 0,
    itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0)
  };
};


cartSchema.methods.hasItem = function(shoeId, size, color) {
  return this.items.find(item => 
    item.shoeId.toString() === shoeId.toString() &&
    item.size === size &&
    item.color === color
  );
};

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;