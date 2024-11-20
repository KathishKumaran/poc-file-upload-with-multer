export const loginOpts = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' },
  },
};

export const logoutOpts = {
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
};
