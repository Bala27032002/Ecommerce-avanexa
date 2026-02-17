import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { items, userDetails } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    if (!userDetails || !userDetails.name || !userDetails.email || !userDetails.phone || !userDetails.address) {
      return res.status(400).json({
        success: false,
        message: 'Complete user details are required'
      });
    }

    // Generate unique order ID
    const orderId = 'ORD' + Date.now();

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create order
    const order = new Order({
      orderId,
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      userDetails,
      total,
      status: 'Confirmed'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        orderId: order.orderId,
        items: order.items,
        userDetails: order.userDetails,
        total: order.total,
        status: order.status,
        date: order.createdAt
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.productId');
    
    res.json({
      success: true,
      orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};
