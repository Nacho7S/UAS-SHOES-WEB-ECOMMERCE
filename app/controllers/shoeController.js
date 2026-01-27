import { connectDB } from "../libs/mongoDb";
import Shoes from "../models/shoeModel";

class shoeController {

  static async addShoe(req, res, next) {
    try {
      await connectDB();

      const { name, releaseYear, description, price, stock, brand, size, color, images } = req.body;

      // Validation
      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: 'Name and price are required'
        });
      }

      if (price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price cannot be negative'
        });
      }

      if (stock !== undefined && stock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock cannot be negative'
        });
      }

      // Check for duplicate shoe name
      const existingShoe = await Shoes.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      });

      if (existingShoe) {
        return res.status(409).json({
          success: false,
          message: 'Shoe with this name already exists'
        });
      }

      const newShoe = new Shoes({
        name,
        releaseYear: releaseYear || new Date().getFullYear(),
        description: description || '',
        price,
        stock: stock || 0,
        brand: brand || 'Unknown',
        size: size || [],
        color: color || [],
        images: images || []
      });

      const savedShoe = await newShoe.save();

      res.status(201).json({
        success: true,
        message: 'Shoe added successfully',
        data: savedShoe
      });

    } catch (error) {
      console.error('Add shoe error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while adding shoe',
        error: error.message
      });
    }
  }

  static async getAllshoe(req,res,next) {
    try {
      await connectDB();

      // Pagination
      const page = parseInt(req.query?.page) || 1;
      const limit = parseInt(req.query?.limit) || 10;
      const skip = (page - 1) * limit;

      // Filtering
      const filter = {};
      
      if (req.query?.brand) filter.brand = req.query.brand;
      if (req.query?.minPrice) filter.price = { $gte: parseFloat(req.query.minPrice) };
      if (req.query?.maxPrice) {
        filter.price = { 
          ...filter.price, 
          $lte: parseFloat(req.query.maxPrice) 
        };
      }
      if (req.query?.inStock === 'true') filter.stock = { $gt: 0 };
      if (req.query?.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      // Sorting
      const sortBy = req.query?.sortBy || 'createdAt';
      const order = req.query?.order === 'asc' ? 1 : -1;

      const shoes = await Shoes.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: order });

      const total = await Shoes.countDocuments(filter);

      res.status(200).json({
        success: true,
        message: 'Shoes retrieved successfully',
        data: shoes,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalShoes: total,
          limit
        }
      });

    } catch (error) {
      console.error('Get all shoes error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching shoes',
        error: error.message
      });
    }
  }

  static async getShoeById(req,res,next) {
    try {
      await connectDB();

      const { id } = await req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Shoe ID is required'
        });
      }

      const shoe = await Shoes.findById(id);

      if (!shoe) {
        return res.status(404).json({
          success: false,
          message: 'Shoe not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Shoe retrieved successfully',
        data: shoe
      });

    } catch (error) {
      console.error('Get shoe by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while fetching shoe',
        error: error.message
      });
    }
  }
  static async editShoe(req,res,next) {
    try {
      await connectDB();

      const { id } = await req.params;
      const { name, releaseYear, description, price, stock, brand, size, color, images } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Shoe ID is required'
        });
      }

      // Check if shoe exists
      const existingShoe = await Shoes.findById(id);
      if (!existingShoe) {
        return res.status(404).json({
          success: false,
          message: 'Shoe not found'
        });
      }

      // Check for name conflict if updating name
      if (name && name !== existingShoe.name) {
        const nameConflict = await Shoes.findOne({
          _id: { $ne: id },
          name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (nameConflict) {
          return res.status(409).json({
            success: false,
            message: 'Another shoe with this name already exists'
          });
        }
      }

      // Validate price and stock
      if (price !== undefined && price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price cannot be negative'
        });
      }

      if (stock !== undefined && stock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock cannot be negative'
        });
      }

      // Build update object (only include provided fields)
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (releaseYear !== undefined) updateData.releaseYear = releaseYear;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (stock !== undefined) updateData.stock = stock;
      if (brand !== undefined) updateData.brand = brand;
      if (size !== undefined) updateData.size = size;
      if (color !== undefined) updateData.color = color;
      if (images !== undefined) updateData.images = images;

      const updatedShoe = await Shoes.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Shoe updated successfully',
        data: updatedShoe
      });

    } catch (error) {
      console.error('Edit shoe error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating shoe',
        error: error.message
      });
    }
  }

  static async deleteShoe(req, res, next) {
    try {
      await connectDB();

      const { id } = await req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Shoe ID is required'
        });
      }

      const shoe = await Shoes.findById(id);
      
      if (!shoe) {
        return res.status(404).json({
          success: false,
          message: 'Shoe not found'
        });
      }

      await Shoes.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Shoe deleted successfully',
        data: {
          deletedShoeId: id,
          name: shoe.name
        }
      });

    } catch (error) {
      console.error('Delete shoe error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting shoe',
        error: error.message
      });
    }
  }

  static async updateStock(req, res, next) {
    try {
      await connectDB();

      const { id } = await req.params;
      const { quantity } = req.body; // Can be positive (restock) or negative (purchase)

      if (!id || quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Shoe ID and quantity are required'
        });
      }

      const shoe = await Shoes.findById(id);
      
      if (!shoe) {
        return res.status(404).json({
          success: false,
          message: 'Shoe not found'
        });
      }

      const newStock = shoe.stock + parseInt(quantity);

      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available'
        });
      }

      const updatedShoe = await Shoes.findByIdAndUpdate(
        id,
        { stock: newStock },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: `Stock ${quantity > 0 ? 'increased' : 'decreased'} successfully`,
        data: {
          shoe: updatedShoe,
          previousStock: shoe.stock,
          newStock: updatedShoe.stock
        }
      });

    } catch (error) {
      console.error('Update stock error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating stock',
        error: error.message
      });
    }
  }
}

export default shoeController