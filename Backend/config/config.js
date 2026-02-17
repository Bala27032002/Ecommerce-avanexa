export const config = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'VXS7mXg7eFRKEfq77iAOekIaqea3wbqtyOC30+uiTLDu8BM4b7O1arIqxwR/0FSP',
  JWT_EXPIRES_IN: '24h',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*'
};
