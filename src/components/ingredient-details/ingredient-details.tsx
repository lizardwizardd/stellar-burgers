import { FC } from 'react';
import { IngredientDetailsUI, Preloader } from '@ui';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIngredientsData } from '../../services/slices/ingredients/ingredientsSlice';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const location = useLocation();
  const ingredients = useSelector(getIngredientsData);
  const ingredientToFind = location.pathname.replace('/ingredients/', '');

  const ingredientData: TIngredient = ingredients.find(
    (ingredient) => ingredient._id === ingredientToFind
  )!;

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
