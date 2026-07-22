const StoreSetting = require('../models/StoreSetting');

const getStorePreferences = () =>
  StoreSetting.findOneAndUpdate(
    { key: 'store-preferences' },
    {},
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

const updateStorePreferences = (preferences) =>
  StoreSetting.findOneAndUpdate(
    { key: 'store-preferences' },
    { preferences },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

module.exports = {
  getStorePreferences,
  updateStorePreferences,
};