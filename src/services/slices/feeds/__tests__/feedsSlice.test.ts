import { describe, test } from '@jest/globals';
import {
  feedsSliceReducer,
  getAllFeeds,
  getOrderByNumber,
  initialState
} from '../feedsSlice';
import { mockFeedsData } from '../mockFeedsData';

const expectedResultById = {
  success: true,
  orders: [
    {
      _id: '6666ebbe97ede0001d06fc65',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa0946',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный минеральный антарианский бургер',
      createdAt: '2024-06-10T12:04:14.552Z',
      updatedAt: '2024-06-10T12:04:14.925Z',
      number: 42042
    }
  ]
};

describe('тест экшенов feedsSlice', () => {
  test('тест загрузки ленты заказов', async () => {
    const state = feedsSliceReducer(
      initialState,
      getAllFeeds.fulfilled(mockFeedsData, 'fulfilled')
    );
    expect(state.loadingData).toBe(false);
    expect(state.orders).toEqual(mockFeedsData.orders);
  });

  test('тест сообщения ошибки при rejected', async () => {
    const state = feedsSliceReducer(
      initialState,
      getAllFeeds.rejected(new Error('error'), 'rejected')
    );
    expect(state.loadingData).toBe(false);
    expect(state.error).toBe('error');
  });

  test('тест состояния загрузи при pending', async () => {
    const state = feedsSliceReducer(
      initialState,
      getAllFeeds.pending('pending')
    );
    expect(state.loadingData).toBe(true);
  });

  test('тест получения заказа по id fulfilled', () => {
    const state = feedsSliceReducer(
      initialState,
      getOrderByNumber.fulfilled(
        expectedResultById,
        'fulfilled',
        +'6666ebbe97ede0001d06fc65'
      )
    );
    expect(state.loadingData).toBe(false);
    expect(state.orderByNumber).toEqual(expectedResultById);
    expect(state.error).toBe(null);
  });

  test('тест получения заказа по id pending', () => {
    const state = feedsSliceReducer(
      initialState,
      getOrderByNumber.pending('pending', +'6666ebbe97ede0001d06fc65')
    );
    expect(state.loadingData).toBe(true);
    expect(state.error).toBe(null);
  });

  test('тест получения заказа по id rejected', () => {
    const state = feedsSliceReducer(
      initialState,
      getOrderByNumber.rejected(
        new Error('error'),
        'rejected',
        +'6666ebbe97ede0001d06fc65'
      )
    );
    expect(state.loadingData).toBe(false);
    expect(state.error).toBe('error');
  });
});
