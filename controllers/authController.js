const bcrypt = require('bcryptjs');
const User = require('./../models/User');

exports.getLogin = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/dashboard');
  }
  res.render('login');
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username: username }).then((user) => {
    if (!user) return res.redirect('/');
    bcrypt.compare(password, user.password).then((doMatch) => {
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          res.redirect('/dashboard');
        });
      }
      return res.redirect('/');
    });
  });
};

exports.postCreateAccount = (req, res) => {
  const username = 'admin';
  const password = 'admin';
  const firstName = 'Marck Henroe';
  const lastName = 'Bautista';
  const userLevel = 'admin';

  bcrypt
    .hash(password, 8)
    .then((hashPassword) => {
      const user = new User({
        username,
        password: hashPassword,
        firstName,
        lastName,
        userLevel,
      });
      return user.save();
    })
    .then((result) => {
      console.log('Account Created!');
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};
