import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.email;
    
    let cart = await Cart.findOne({ userId }).populate('items.productId');
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    res.json({
      success: true,
      cart: {
        items: cart.items,
        totalAmount: cart.totalAmount
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.email;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + 1;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Not enough stock available'
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: 1
      });
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Product added to cart',
      cart: {
        items: cart.items,
        totalAmount: cart.totalAmount
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    console.log('UPDATE CART - Request body:', req.body);
    console.log('UPDATE CART - User:', req.user);
    
    const userId = req.user.userId || req.user.email;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      console.log('Missing productId or quantity');
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
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
      console.log('Cart not found for user:', userId);
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      console.log('Item not found in cart:', productId);
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Verify stock
    const product = await Product.findById(productId);
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    console.log('Cart updated successfully');
    res.json({
      success: true,
      message: 'Cart updated',
      cart: {
        items: cart.items,
        totalAmount: cart.totalAmount
      }
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.email;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: {
        items: cart.items,
        totalAmount: cart.totalAmount
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item',
      error: error.message
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.email;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart: {
        items: [],
        totalAmount: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};
