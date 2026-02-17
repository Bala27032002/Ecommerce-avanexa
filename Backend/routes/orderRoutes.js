import express from 'express';
import { createOrder, getOrderById, getAllOrders } from '../controllers/orderController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', createOrder);

router.get('/', getAllOrders);

router.get('/:orderId', getOrderById);

export default router;
