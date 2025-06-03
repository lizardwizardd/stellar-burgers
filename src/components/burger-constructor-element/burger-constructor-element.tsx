import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  downPositionOfIngredient,
  removeIngredientFromConstructor,
  upPositionOfIngredient
} from '../../services/slices/burgerConstructor/burgerConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () =>
      dispatch(downPositionOfIngredient(ingredient.id));
    const handleMoveUp = () => dispatch(upPositionOfIngredient(ingredient.id));
    const handleClose = () =>
      dispatch(removeIngredientFromConstructor(ingredient.id));

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
