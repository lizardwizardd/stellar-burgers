import { describe, test } from '@jest/globals';
import {
  getIngredients,
  ingredientsSliceReducer,
  initialState
} from '../ingredientsSlice';
import { ingredients } from '../mockIngredientsData';

describe('тест асинхронных экшенов', () => {
  const expectedResult = ingredients;

  test('тест загрузки ингредиентов', async () => {
    const state = ingredientsSliceReducer(
      initialState,
      getIngredients.fulfilled(expectedResult, 'fulfilled')
    );
    expect(state.loadingData).toBe(false);
    expect(state.ingredients).toEqual(expectedResult);
  });

  test('тест сообщения ошибки при rejected', async () => {
    const state = ingredientsSliceReducer(
      initialState,
      getIngredients.rejected(new Error('error'), 'rejected')
    );
    expect(state.loadingData).toBe(false);
    expect(state.error).toBe('error');
  });

  test('тест состояния загрузи при pending', async () => {
    const state = ingredientsSliceReducer(
      initialState,
      getIngredients.pending('pending')
    );
    expect(state.loadingData).toBe(true);
  });
});
