import { combineReducers } from 'redux';
import { ingredientsSliceReducer } from '../slices/ingredients/ingredientsSlice';
import { burgerConstructorSliceReducer } from '../slices/burgerConstructor/burgerConstructorSlice';
import { feedsSliceReducer } from '../slices/feeds/feedsSlice';
import { userSliceReducer } from '../slices/user/userSlice';

describe('Root Reducer', () => {
  it('should combine all slice reducers correctly', () => {
    const rootReducer = combineReducers({
      ingredients: ingredientsSliceReducer,
      constructorItems: burgerConstructorSliceReducer,
      feeds: feedsSliceReducer,
      auth: userSliceReducer
    });

    const initialState = rootReducer(undefined, { type: '@@redux/INIT' });

    expect(initialState).toEqual({
      ingredients: ingredientsSliceReducer(undefined, { type: '@@redux/INIT' }),
      constructorItems: burgerConstructorSliceReducer(undefined, {
        type: '@@INIT'
      }),
      feeds: feedsSliceReducer(undefined, { type: '@@redux/INIT' }),
      auth: userSliceReducer(undefined, { type: '@@redux/INIT' })
    });
  });
});
