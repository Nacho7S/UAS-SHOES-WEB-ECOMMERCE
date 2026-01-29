import mongoose from "mongoose";
import { connectDB } from "../libs/mongoDb";
import Cart from "../models/cartModels";
import Shoes from "../models/shoeModel";


class cartController {

  static async addToCart(req, res, next) {
    try {
      await connectDB();

      const userId = req.user?.id;
      const { shoeId, quantity = 1, size, color } = req.body;

    
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


      const shoe = await Shoes.findById(shoeId);
      if (!shoe) {
        return res.status(404).json({
          success: false,
          message: 'Shoe not found'
        });
      }

     
      if (shoe.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${shoe.stock} items available in stock`
        });
      }

    
      let cart = await Cart.findOne({ userId });

      if (!cart) {
      
        cart = new Cart({
          userId,
          items: []
        });
      }

     
      const existingItem = cart.hasItem(shoeId, size, color);

      if (existingItem) {
       
        const newQuantity = existingItem.quantity + quantity;
        
       
        if (shoe.stock < newQuantity) {
          return res.status(400).json({
            success: false,
            message: `Cannot add ${quantity} more. Only ${shoe.stock - existingItem.quantity} available`
          });
        }

        existingItem.quantity = newQuantity;
      } else {
      
        cart.items.push({
          shoeId,
          quantity,
          size,
          color,
          priceAtAdd: shoe.price
        });
      }

      await cart.save();

    
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

  
    const cartAggregation = await Cart.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'shoes',
          localField: 'items.shoeId',
          foreignField: '_id',
          as: 'shoeData'
        }
      }
    ]);

    let cart = await Cart.findOne({ userId })
      .populate({
        path: 'items.shoeId',
        select: 'name brand images price stock'
      })
      .lean();

    if (!cart) {
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


    const originalLength = cart.items.length;
    const validItems = cart.items.filter(item => item.shoeId !== null);
    const removedCount = originalLength - validItems.length;


    if (removedCount > 0) {
      const orphanedItemIds = cart.items
        .filter(item => item.shoeId === null)
        .map(item => item._id.toString());

  
      await Cart.updateOne(
        { userId },
        { $pull: { items: { _id: { $in: orphanedItemIds.map(id => new mongoose.Types.ObjectId(id)) } } } }
      );

      // console.log(`Removed ${removedCount} orphaned items from cart ${cart._id}`);
    }


    const totals = {
      subtotal: validItems.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0),
      discount: cart.discountAmount || 0,
      total: Math.max(0, validItems.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0) - (cart.discountAmount || 0)),
      itemCount: validItems.reduce((sum, item) => sum + item.quantity, 0)
    };

    res.status(200).json({
      success: true,
      message: removedCount > 0 ? `Cart cleaned up. Removed ${removedCount} unavailable items.` : 'Cart retrieved successfully',
      data: {
        ...cart,
        items: validItems,
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

     
      const item = cart.items.id(itemId);
      
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }

     
      const shoe = await Shoes.findById(item.shoeId);
      if (shoe.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${shoe.stock} items available in stock`
        });
      }

      item.quantity = quantity;
      await cart.save();

      
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
      const { itemId } = await req.params;

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

  
      cart.items.pull(itemId);
      await cart.save();

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