import { FC, useEffect, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import {
  getOrderByNumber,
  getOrderByNumberSelector,
  isSearchSuccessSelector
} from '../../services/slices/feeds/feedsSlice';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredientsData } from '../../services/slices/ingredients/ingredientsSlice';
import { OrderInfoUI, Preloader } from '@ui';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const currentNumber = Number(useParams().number);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrderByNumber(currentNumber));
  }, [dispatch]);
  const isSearchSuccess = useSelector(isSearchSuccessSelector);
  const orderData = useSelector(getOrderByNumberSelector);

  const ingredients: TIngredient[] = useSelector(getIngredientsData);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo || !isSearchSuccess) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
