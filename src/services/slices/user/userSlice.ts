import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  TAuthResponse,
  TRegisterData,
  TUserResponse,
  updateUserApi,
  TFeedsResponse,
  TNewOrderResponse,
  TServerResponse
} from '../../../utils/burger-api';
import { RootState } from '../../store';
import { TOrder } from '@utils-types';
import { setCookie } from '../../../utils/cookie';

export const initialState: Pick<TAuthResponse, 'user' | 'success'> & {
  orders: TOrder[];
  lastOrder: TOrder | null;
  orderRequestData: boolean;
  loading: boolean;
  error: string | null;
} = {
  success: false,
  user: {
    email: '',
    name: ''
  },
  orders: [],
  lastOrder: null,
  orderRequestData: false,
  loading: false,
  error: null
};

export const getUserAuth = createAsyncThunk<
  TUserResponse,
  void,
  { rejectValue: string }
>('user/getUser', async (_, thunkAPI) => {
  try {
    return await getUserApi();
  } catch (error: unknown) {
    let errorMessage = 'Failed to get user authentication details.';
    if (error instanceof Error) errorMessage = error.message;
    else if (typeof error === 'string') errorMessage = error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk<
  TAuthResponse,
  Omit<TRegisterData, 'name'>,
  { rejectValue: string }
>('user/loginUser', async (loginPayload, thunkAPI) => {
  try {
    const responseData = await loginUserApi(loginPayload);
    localStorage.setItem('refreshToken', responseData.refreshToken);
    setCookie('accessToken', responseData.accessToken);
    return responseData;
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred during login.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as any).message === 'string'
    ) {
      errorMessage = (error as any).message;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const registerUser = createAsyncThunk<
  TAuthResponse,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (registerPayload, thunkAPI) => {
  try {
    const responseData = await registerUserApi(registerPayload);
    localStorage.setItem('refreshToken', responseData.refreshToken);
    setCookie('accessToken', responseData.accessToken);
    return responseData;
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred during registration.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as any).message === 'string'
    ) {
      errorMessage = (error as any).message;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const updateUserData = createAsyncThunk<
  TUserResponse,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/updateUserData', async (updatePayload, thunkAPI) => {
  try {
    return await updateUserApi(updatePayload);
  } catch (error: unknown) {
    let errorMessage = 'Failed to update user data.';
    if (error instanceof Error) errorMessage = error.message;
    else if (typeof error === 'string') errorMessage = error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const userLogout = createAsyncThunk<
  TServerResponse<{}>,
  void,
  { rejectValue: string }
>('user/logout', async (_, thunkAPI) => {
  try {
    return await logoutApi();
  } catch (error: unknown) {
    let errorMessage = 'Logout failed.';
    if (error instanceof Error) errorMessage = error.message;
    else if (typeof error === 'string') errorMessage = error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const getUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('user/getUserOrders', async (_, thunkAPI) => {
  try {
    return await getOrdersApi();
  } catch (error: unknown) {
    let errorMessage = 'Failed to get user orders.';
    if (error instanceof Error) errorMessage = error.message;
    else if (typeof error === 'string') errorMessage = error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const newUserOrder = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { rejectValue: string }
>('user/newUserOrder', async (orderData, thunkAPI) => {
  try {
    return await orderBurgerApi(orderData);
  } catch (error: unknown) {
    let errorMessage = 'Failed to create new order.';
    if (error instanceof Error) errorMessage = error.message;
    else if (typeof error === 'string') errorMessage = error;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    makeLoginUserSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setLastOrder: (state, action: PayloadAction<TOrder | null>) => {
      state.lastOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserAuth.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getUserAuth.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        if (
          action.meta.rejectedWithValue &&
          typeof action.payload === 'string'
        ) {
          state.error = action.payload;
        } else {
          state.error =
            action.error.message || 'Failed to get user auth (unknown error)';
        }
      })
      .addCase(
        getUserAuth.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.user = action.payload.user;
          state.error = null;
        }
      )

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        if (
          action.meta.rejectedWithValue &&
          typeof action.payload === 'string'
        ) {
          state.error = action.payload;
        } else {
          state.error = action.error.message || 'Login failed (unknown error)';
        }
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.user = action.payload.user;
          state.error = null;
        }
      )

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        if (
          action.meta.rejectedWithValue &&
          typeof action.payload === 'string'
        ) {
          state.error = action.payload;
        } else {
          state.error =
            action.error.message || 'Registration failed (unknown error)';
        }
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<TAuthResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.user = action.payload.user;
          state.error = null;
        }
      )

      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        if (
          action.meta.rejectedWithValue &&
          typeof action.payload === 'string'
        ) {
          state.error = action.payload;
        } else {
          state.error =
            action.error.message ||
            'Failed to update user data (unknown error)';
        }
      })
      .addCase(
        updateUserData.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.user = action.payload.user;
          state.error = null;
        }
      )

      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        if (
          action.meta.rejectedWithValue &&
          typeof action.payload === 'string'
        ) {
          state.error = action.payload;
        } else {
          state.error = action.error.message || 'Logout failed (unknown error)';
        }
      })
      .addCase(
        userLogout.fulfilled,
        (state, action: PayloadAction<TServerResponse<{}>>) => {
          state.loading = false;
          state.success = false;
          state.user = initialState.user;
          state.error = null;
        }
      )

      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        if (
          action.meta.rejectedWithValue &&
          typeof action.payload === 'string'
        ) {
          state.error = action.payload;
        } else {
          state.error =
            action.error.message || 'Failed to get user orders (unknown error)';
        }
      })
      .addCase(
        getUserOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.loading = false;
          state.orders = action.payload;
          state.error = null;
        }
      )

      .addCase(newUserOrder.pending, (state) => {
        state.orderRequestData = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(newUserOrder.rejected, (state, action) => {
        state.orderRequestData = false;
        state.loading = false;
        if (
          action.meta.rejectedWithValue &&
          typeof action.payload === 'string'
        ) {
          state.error = action.payload;
        } else {
          state.error =
            action.error.message ||
            'Failed to create new order (unknown error)';
        }
      })
      .addCase(
        newUserOrder.fulfilled,
        (state, action: PayloadAction<TNewOrderResponse>) => {
          state.orderRequestData = false;
          state.loading = false;
          state.lastOrder = action.payload.order;
          state.orders.unshift(action.payload.order);
          state.error = null;
        }
      );
  }
});

const userSliceSelectors = (state: RootState) => state.auth;

export const getUserAuthStatus = createSelector(
  [userSliceSelectors],
  (state) => state.success
);

export const getIsAuthLoading = createSelector(
  [userSliceSelectors],
  (state) => state.loading
);

export const getUser = createSelector(
  [userSliceSelectors],
  (state) => state.user
);

export const getOrders = createSelector(
  [userSliceSelectors],
  (state) => state.orders
);

export const getOrderRequestStatus = createSelector(
  [userSliceSelectors],
  (state) => state.orderRequestData
);

export const getLastOrder = createSelector(
  [userSliceSelectors],
  (state) => state.lastOrder
);

export const { makeLoginUserSuccess, setLastOrder } = userSlice.actions;
export const userSliceReducer = userSlice.reducer;
