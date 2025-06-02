const testUrl = 'http://localhost:4000';
const burgerConstructorSelector = '[data-cy=burger-constructor]';
const mainsConstructorSelector = '[data-cy=ingredients-mains]';
const saucesConstructorSelector = '[data-cy=ingredients-sauces]';
const closeModalSelector = '[data-cy=modal-close]';

describe('проверяем доступность приложения', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(testUrl);
  });

  it('ингредиент должен добавляться в коструктор', () => {
    cy.get(mainsConstructorSelector).contains('Добавить').click();
    cy.get(saucesConstructorSelector).contains('Добавить').click();
    cy.get(burgerConstructorSelector).contains('Ингредиент 2').should('exist');
    cy.get('[data-cy=burger-constructor]')
      .contains('Ингредиент 4')
      .should('exist');
  });
});

describe('тесты модального окна', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit(testUrl);
  });

  it('открывается модальное окно при клике на ингредиент', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Ингредиент 1').should('exist');
  });

  it('закрывается при клике на крестик', () => {
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get(closeModalSelector).click();
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

describe('тесты оформления заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'userData.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'userOrder.json' }).as(
      'postOrder'
    );
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('fakeRefreshToken')
    );
    cy.setCookie('accessToken', 'fakeAccessToken');
    cy.visit(testUrl);
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearCookies();
  });

  it('сборка бургера для заказа и нажатие на кнопку заказа', () => {
    cy.get('[data-cy=ingredients-buns]').contains('Добавить').click();
    cy.get(mainsConstructorSelector).contains('Добавить').click();
    cy.get(saucesConstructorSelector).contains('Добавить').click();
    cy.get('[data-cy=order-button]').click();
    cy.get('[data-cy=order-number]').contains('1').should('exist');

    cy.get(closeModalSelector).click();
    cy.get('[data-cy=order-number]').should('not.exist');

    cy.get(burgerConstructorSelector)
      .contains('Ингредиент 1')
      .should('not.exist');
    cy.get(burgerConstructorSelector)
      .contains('Ингредиент 2')
      .should('not.exist');
    cy.get(burgerConstructorSelector)
      .contains('Ингредиент 4')
      .should('not.exist');
  });
});
