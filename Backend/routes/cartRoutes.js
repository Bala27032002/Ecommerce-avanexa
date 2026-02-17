import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from '../controllers/cartController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// All cart routes require authentication
router.use(verifyToken);

// GET /api/cart - Get user's cart
router.get('/', getCart);

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// PUT /api/cart - Update cart item quantity
router.put('/', updateCartItem);

// DELETE /api/cart/:productId - Remove item from cart (must come before DELETE /)
router.delete('/:productId', removeFromCart);

// DELETE /api/cart - Clear entire cart
// router.delete('/', clearCart);

export default router;
