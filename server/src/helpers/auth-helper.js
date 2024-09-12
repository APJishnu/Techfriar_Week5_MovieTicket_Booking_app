const User = require('../models/user-models');

module.exports = {
  emailVerified: async (email, verifiedDate) => {
    try {
      console.log(verifiedDate)
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
        // If no document was found and updated, return false
        return false;
      }

      return true

    } catch (error) {

      return false
    }
  }, 
};
