export const userData = {
  existingUser: {
    username: 'mo_tester',
    password: 'Mo@1234',
  },
  invalidUsername: 'invalid_user_999',
  invalidPassword: 'wrongPass123',
  name: 'Max Mustermann',
  country: 'Germany',
  city: 'Berlin',
};
export const categories = {
  laptops: 'Laptops',
  laptopsApi: 'notebook',
  phones: 'Phones',
  monitors: 'Monitors',
};
export const products = {
  laptops: {
    MacBook_Pro: {
      name: 'MacBook Pro',
      price: 1100,
    },
    MacBook_air: {
      name: 'MacBook air',
      price: 700,
    },
  },
};

export const cards = {
  valid: { number: '4111111111111111', month: '12', year: '2028' },
  invalid: { number: '4111111111', month: '12', year: '2021' },
};

export const oneProduct = [{ name: 'MacBook Pro', price: 1100 }];
export const twoProducts = [
  { name: 'MacBook Pro', price: 1100 },
  { name: 'MacBook air', price: 700 },
];
