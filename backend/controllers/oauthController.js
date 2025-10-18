// backend/controllers/oauthController.js
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

const oauthController = {
  // Google OAuth Login/Register
  googleAuth: async (req, res) => {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({
          success: false,
          message: 'Google credential is required'
        });
      }

      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const { email, name, given_name, family_name, picture, sub: googleId } = payload;

      // Check if user exists
      let user = await User.findOne({
        where: { email }
      });

      if (user) {
        // Update existing user with Google info if not already linked
        if (user.provider === 'local') {
          user.provider = 'google';
          user.provider_id = googleId;
          if (picture && !user.profile_image) {
            user.profile_image = picture;
          }
          await user.save();
        }
      } else {
        // Create new user
        user = await User.create({
          name: name || `${given_name} ${family_name}`.trim(),
          email,
          first_name: given_name || '',
          last_name: family_name || '',
          provider: 'google',
          provider_id: googleId,
          profile_image: picture || null,
          role: 'customer',
          password: null // OAuth users don't need password
        });
      }

      // Generate token
      const token = generateToken(user);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          profile_image: user.profile_image,
          provider: user.provider
        }
      });
    } catch (error) {
      console.error('Google OAuth error:', error);
      res.status(500).json({
        success: false,
        message: 'Google authentication failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Facebook OAuth Login/Register
  facebookAuth: async (req, res) => {
    try {
      const { accessToken, userID } = req.body;

      if (!accessToken || !userID) {
        return res.status(400).json({
          success: false,
          message: 'Facebook access token and user ID are required'
        });
      }

      // Verify Facebook token
      const fbResponse = await fetch(
        `https://graph.facebook.com/v18.0/me?fields=id,name,email,first_name,last_name,picture&access_token=${accessToken}`
      );

      if (!fbResponse.ok) {
        throw new Error('Failed to verify Facebook token');
      }

      const fbData = await fbResponse.json();

      // Verify the user ID matches
      if (fbData.id !== userID) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Facebook credentials'
        });
      }

      const { email, name, first_name, last_name, picture, id: facebookId } = fbData;

      // Facebook might not provide email
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email permission is required for registration'
        });
      }

      // Check if user exists
      let user = await User.findOne({
        where: { email }
      });

      if (user) {
        // Update existing user with Facebook info if not already linked
        if (user.provider === 'local') {
          user.provider = 'facebook';
          user.provider_id = facebookId;
          if (picture?.data?.url && !user.profile_image) {
            user.profile_image = picture.data.url;
          }
          await user.save();
        }
      } else {
        // Create new user
        user = await User.create({
          name: name || `${first_name} ${last_name}`.trim(),
          email,
          first_name: first_name || '',
          last_name: last_name || '',
          provider: 'facebook',
          provider_id: facebookId,
          profile_image: picture?.data?.url || null,
          role: 'customer',
          password: null // OAuth users don't need password
        });
      }

      // Generate token
      const token = generateToken(user);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
          profile_image: user.profile_image,
          provider: user.provider
        }
      });
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      res.status(500).json({
        success: false,
        message: 'Facebook authentication failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = oauthController;