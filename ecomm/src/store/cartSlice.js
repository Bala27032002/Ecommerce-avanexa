import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../api/axios';

// Async thunks for cart operations
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartAPI.getCart();
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCartAsync = createAsyncThunk('cart/addToCart', async (productId, { rejectWithValue }) => {
  try {
    const response = await cartAPI.addToCart(productId);
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateQuantityAsync = createAsyncThunk('cart/updateQuantity', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await cartAPI.updateQuantity(productId, quantity);
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
  }
});

export const removeFromCartAsync = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
  try {
    const response = await cartAPI.removeFromCart(productId);
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
  }
});

export const clearCartAsync = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const response = await cartAPI.clearCart();
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null
  },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to cart
      .addCase(addToCartAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update quantity
      .addCase(updateQuantityAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(updateQuantityAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Remove from cart
      .addCase(removeFromCartAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Clear cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
      });
  }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;

