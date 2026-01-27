import { connectDB } from "../libs/mongoDb";
import Cart from "../models/cartModels";
import Shoes from "../models/shoeModel";


class cartController {

  static async addToCart(req, res, next) {
    try {
      await connectDB();

      const userId = req.user?.id;
      const { shoeId, quantity = 1, size, color } = req.body;

      // Validation
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!shoeId || !size || !color) {
        return res.status(400).json({
          success: false,
          message: 'Shoe ID, size, and color are required'
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1'
        });
      }

      // Check if shoe exists
      const shoe = await Shoes.findById(shoeId);
      if (!shoe) {
        return res.status(404).json({
          success: false,
          message: 'Shoe not found'
        });
      }

      // Check stock availability
      if (shoe.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${shoe.stock} items available in stock`
        });
      }

      // Find or create cart
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        // Create new cart
        cart = new Cart({
          userId,
          items: []
        });
      }

      // Check if item already exists (same shoe, size, color)
      const existingItem = cart.hasItem(shoeId, size, color);

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        
        // Check if new quantity exceeds stock
        if (shoe.stock < newQuantity) {
          return res.status(400).json({
            success: false,
            message: `Cannot add ${quantity} more. Only ${shoe.stock - existingItem.quantity} available`
          });
        }

        existingItem.quantity = newQuantity;
      } else {
        // Add new item
        cart.items.push({
          shoeId,
          quantity,
          size,
          color,
          priceAtAdd: shoe.price
        });
      }

      await cart.save();

      // Populate shoe details for response
      await cart.populate({
        path: 'items.shoeId',
        select: 'name brand images price'
      });

      const totals = cart.calculateTotals();

      res.status(200).json({
        success: true,
        message: existingItem ? 'Quantity updated' : 'Item added to cart',
        data: {
          cart,
          totals
        }
      });

    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding to cart',
        error: error.message
      });
    }
  }

  static async getCart(req, res, next) {
    try {
      await connectDB();

      const userId = req.user?.id; 
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const cart = await Cart.findOne({ userId })
        .populate({
          path: 'items.shoeId',
          select: 'name brand images price' // Select only needed fields
        })
        .lean();     

      if (!cart) {
        // Return empty cart structure if none exists
        return res.status(200).json({
          success: true,
          message: 'Cart is empty',
          data: {
            items: [],
            totals: {
              subtotal: 0,
              discount: 0,
              total: 0,
              itemCount: 0
            }
          }
        });
      }


      cart.calculateTotals = function() {
  return {
    subtotal: this.items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0),
    discount: this.discountAmount || 0,
    total: Math.max(0, this.items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0) - (this.discountAmount || 0)),
    itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0)
  };
};

      const totals = cart.calculateTotals();

      console.log(totals);
      

      res.status(200).json({
        success: true,
        message: 'Cart retrieved successfully',
        data: {
          ...cart,
          totals
        }
      });

    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching cart',
        error: error.message
      });
    }
  }

  static async updateQuantity(req, res, next) {
    try {
      await connectDB();

      const userId = req.user?.id;
      const { itemId, quantity } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!itemId || quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Item ID and quantity are required'
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1'
        });
      }

      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      // Find item in cart
      const item = cart.items.id(itemId);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }

      // Check stock availability
      const shoe = await Shoes.findById(item.shoeId);
      if (shoe.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${shoe.stock} items available in stock`
        });
      }

      item.quantity = quantity;
      await cart.save();

      // Populate for response
      await cart.populate({
        path: 'items.shoeId',
        select: 'name brand images price'
      });

      const totals = cart.calculateTotals();

      res.status(200).json({
        success: true,
        message: 'Quantity updated successfully',
        data: {
          cart,
          totals
        }
      });

    } catch (error) {
      console.error('Update quantity error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating quantity',
        error: error.message
      });
    }
  }

  static async removeFromCart(req, res, next) {
    try {
      await connectDB();

      const userId = req.user?.id;
      const { itemId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!itemId) {
        return res.status(400).json({
          success: false,
          message: 'Item ID is required'
        });
      }

      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      // Remove item
      cart.items.pull(itemId);
      await cart.save();

      // If cart is empty, you might want to delete it
      if (cart.items.length === 0) {
        await Cart.findByIdAndDelete(cart._id);
        return res.status(200).json({
          success: true,
          message: 'Item removed. Cart is now empty.',
          data: {
            items: [],
            totals: {
              subtotal: 0,
              discount: 0,
              total: 0,
              itemCount: 0
            }
          }
        });
      }

      // Populate for response
      await cart.populate({
        path: 'items.shoeId',
        select: 'name brand images price'
      });

      const totals = cart.calculateTotals();

      res.status(200).json({
        success: true,
        message: 'Item removed successfully',
        data: {
          cart,
          totals
        }
      });

    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Error removing item from cart',
        error: error.message
      });
    }
  }

  static async clearCart(req, res, next) {
    try {
      await connectDB();

      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const result = await Cart.findOneAndDelete({ userId });
      
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully'
      });

    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Error clearing cart',
        error: error.message
      });
    }
  }

  static async applyCoupon(req, res, next) {
    try {
      await connectDB();

      const userId = req.user?.id;
      const { couponCode } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      if (!couponCode) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code is required'
        });
      }

      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Cart not found'
        });
      }

      const validCoupons = {
        'SAVE10': 10,
        'SAVE20': 20,
        'WELCOME': 15
      };

      const discountAmount = validCoupons[couponCode];
      
      if (!discountAmount) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coupon code'
        });
      }

      cart.couponCode = couponCode;
      cart.discountAmount = discountAmount;
      await cart.save();

      await cart.populate({
        path: 'items.shoeId',
        select: 'name brand images price'
      });

      const totals = cart.calculateTotals();

      res.status(200).json({
        success: true,
        message: 'Coupon applied successfully',
        data: {
          cart,
          totals
        }
      });

    } catch (error) {
      console.error('Apply coupon error:', error);
      res.status(500).json({
        success: false,
        message: 'Error applying coupon',
        error: error.message
      });
    }
  }

}

export default cartController