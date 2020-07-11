const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { body, validationResult } = require('express-validator');

const User = require('../../models/User');

// @rout     Get api/auth
// @desc     Test rout
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('server errror');
  }
});

// @rout     post api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    body('email', 'لطفا آدرس ایمیل خود را به طور صحیح وارد کنید!').isEmail(),
    body('password', 'لطفا رمز عبور خود را وارد کنید!').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //see if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: 'این حساب کاربری یا رمز عبوراشتباه است.' }],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: 'این حساب کاربری یا رمز عبوراشتباه است.' }],
        });
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('مشکلی در سرور رخ داده لطفا مجددا امتحان نمایید.');
    }
  }
);

module.exports = router;
