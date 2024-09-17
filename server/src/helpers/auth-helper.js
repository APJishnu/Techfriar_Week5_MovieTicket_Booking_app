const User = require('../models/user-models');

module.exports = {
  
  emailVerified: async (email, verifiedDate) => {
    try {
      let updateObject = {
        emailVerifiedAt: verifiedDate,
      };
      const updatedEmailAt = await User.findOneAndUpdate(
        { email: email },
        {
          $set: updateObject,
        },
        { returnOriginal: false }
      );

      if (!updatedEmailAt) {
        return false;
      }
      return true
    } catch (error) {
      return false
    }
  },


  phoneVerified: async (phone, verifiedDate, userId) => {
    try {
      let updateObject = {
        phone: phone,
        phoneVerifiedAt: verifiedDate,
      };
      const updatedPhoneAt = await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: updateObject,
        },
        { returnOriginal: false }
      );

      if (!updatedPhoneAt) {
        return false;
      }
      return true

    } catch (error) {
      return false
    }
  },

};
