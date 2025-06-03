import {
  createSelector,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../../store';

type TBurgerConstructorSlice = {
  constructorBun: TConstructorIngredient | null;
  constructorIngredients: TConstructorIngredient[];
};

export const initialState: TBurgerConstructorSlice = {
  constructorBun: null,
  constructorIngredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredientToConstructor: {
      prepare: (item: TIngredient) => {
        const id = nanoid();
        return { payload: { id, ...item } };
      },
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        action.payload.type === 'bun'
          ? (state.constructorBun = action.payload)
          : state.constructorIngredients.push(action.payload);
        console.log(action.payload._id);
      }
    },

    removeIngredientFromConstructor: (state, action: PayloadAction<string>) => {
      state.constructorIngredients = state.constructorIngredients.filter(
        (item) => item.id !== action.payload
      );
    },
    upPositionOfIngredient: (state, action: PayloadAction<string>) => {
      const ingredientIndex = state.constructorIngredients.findIndex(
        (item) => item.id === action.payload
      );
      // console.log(ingredientIndex);
      const [ingredient] = state.constructorIngredients.splice(
        ingredientIndex,
        1
      );

      state.constructorIngredients.splice(ingredientIndex - 1, 0, ingredient);
    },
    downPositionOfIngredient: (state, action: PayloadAction<string>) => {
      const ingredientIndex = state.constructorIngredients.findIndex(
        (item) => item.id === action.payload
      );
      const [ingredient] = state.constructorIngredients.splice(
        ingredientIndex,
        1
      );

      state.constructorIngredients.splice(ingredientIndex + 1, 0, ingredient);
    },
    resetConstructor: (state: TBurgerConstructorSlice) => {
      state.constructorIngredients = [];
      state.constructorBun = null;
    }
  }
});

const constructorSliceSelectors = (state: RootState) => state.constructorItems;

export const getConstructorIngredients = createSelector(
  [constructorSliceSelectors],
  (state) => state.constructorIngredients
);
export const getConstructorBun = createSelector(
  [constructorSliceSelectors],
  (state) => state.constructorBun
);

export const {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  upPositionOfIngredient,
  downPositionOfIngredient,
  resetConstructor
} = burgerConstructorSlice.actions;
export const burgerConstructorSliceReducer = burgerConstructorSlice.reducer;
