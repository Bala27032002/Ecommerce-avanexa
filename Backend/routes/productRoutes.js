import express from 'express';
import { getAllProducts, searchProducts, getProductById } from '../controllers/productController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getAllProducts);

router.get('/search', searchProducts);

router.get('/:id', getProductById);

export default router;
