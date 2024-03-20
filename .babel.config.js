module.exports = function (api) {
  // Check if the build is in production mode
  const isProduction = api.env('production');

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      // Remove console statements in production builds
      isProduction && 'transform-remove-console',
    ].filter(Boolean),
  }
};
