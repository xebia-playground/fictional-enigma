const mongoose = require('mongoose');

const storeSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'store-preferences',
      unique: true,
    },
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        theme: 'light',
        storeName: 'DevShop',
        supportEmail: 'support@example.com',
        featuredCategory: 'electronics',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StoreSetting', storeSettingSchema);