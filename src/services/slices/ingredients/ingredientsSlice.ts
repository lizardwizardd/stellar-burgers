import { TIngredient } from '@utils-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../../utils/burger-api';

export type TIngredientsSlice = {
  ingredients: TIngredient[];
  loadingData: boolean;
  error: string | null | undefined;
};

export const initialState: TIngredientsSlice = {
  ingredients: [],
  loadingData: true,
  error: null
};

export const getIngredients = createAsyncThunk(
  'ingredients/getAllIngredients',
  async () => getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredientsData: (state) => state.ingredients,
    getIsLoading: (state) => state.loadingData
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.loadingData = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.loadingData = false;
        state.error = action.error.message;
      })
      .addCase(
        getIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loadingData = false;
          state.error = null;
          state.ingredients = action.payload;
          console.log(action.payload);
        }
      );
  }
});

export const { getIngredientsData, getIsLoading } = ingredientsSlice.selectors;
export const ingredientsSliceReducer = ingredientsSlice.reducer;
