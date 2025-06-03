import {
  addIngredientToConstructor,
  burgerConstructorSliceReducer,
  downPositionOfIngredient,
  initialState,
  removeIngredientFromConstructor,
  upPositionOfIngredient
} from '../burgerConstructorSlice';

const customBun = {
  id: 'zgLfj3Sx_7Bx7bTX4U71A',
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};
const customIngredient = {
  id: 'IR1R_ZJA-zRpoebahtv-K',
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};
describe('Тесты экшенов конструктора бургера', () => {
  describe('Добавление продукта', () => {
    test('Добавление в список булок', () => {
      const newState = burgerConstructorSliceReducer(
        initialState,
        addIngredientToConstructor(customBun)
      );
      const { constructorBun } = newState;

      expect(constructorBun).toEqual(customBun);
    });
    test('Добавление в список ингредиентов', () => {
      const newState = burgerConstructorSliceReducer(
        initialState,
        addIngredientToConstructor(customIngredient)
      );
      const { constructorIngredients } = newState;

      expect(constructorIngredients).toEqual([customIngredient]);
    });
  });

  describe('Удаление продукта', () => {
    test('Удаление продукта из списка булок', () => {
      const prevState = burgerConstructorSliceReducer(
        initialState,
        addIngredientToConstructor(customBun)
      );
      const newState = burgerConstructorSliceReducer(
        prevState,
        removeIngredientFromConstructor('zgLfj3Sx_7Bx7bTX4U71A')
      );
      const { constructorBun } = newState;
      expect(constructorBun).toEqual(prevState.constructorBun);
    });
    test('Удаление продукта из списка ингредиентов', () => {
      const prevState = burgerConstructorSliceReducer(
        initialState,
        addIngredientToConstructor(customIngredient)
      );
      const newState = burgerConstructorSliceReducer(
        prevState,
        removeIngredientFromConstructor('IR1R_ZJA-zRpoebahtv-K')
      );
      const { constructorIngredients } = newState;
      expect(constructorIngredients).toHaveLength(0);
    });
  });

  describe('Перемещение продукта', () => {
    const initialState = {
      constructorBun: null,
      constructorIngredients: [
        {
          id: 'IR1R_ZJA-zRpoebahtv-K',
          _id: '643d69a5c3f7b9001cfa0941',
          name: 'Биокотлета из марсианской Магнолии',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        },
        {
          id: 'testId',
          _id: '_testId',
          name: 'testName',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        }
      ]
    };
    test('перемещение вверх', () => {
      const expectedResult = [
        {
          id: 'testId',
          _id: '_testId',
          name: 'testName',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        },
        customIngredient
      ];
      const newState = burgerConstructorSliceReducer(
        initialState,
        upPositionOfIngredient('testId')
      );
      const { constructorIngredients } = newState;
      expect(constructorIngredients).toEqual(expectedResult);
    });
    test('перемещение вниз', () => {
      const expectedResult = [
        {
          id: 'testId',
          _id: '_testId',
          name: 'testName',
          type: 'main',
          proteins: 420,
          fat: 142,
          carbohydrates: 242,
          calories: 4242,
          price: 424,
          image: 'https://code.s3.yandex.net/react/code/meat-01.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
          image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
        },
        customIngredient
      ];
      const newState = burgerConstructorSliceReducer(
        initialState,
        downPositionOfIngredient(customIngredient._id)
      );
      const { constructorIngredients } = newState;
      expect(constructorIngredients).toEqual(expectedResult);
    });
  });
});
