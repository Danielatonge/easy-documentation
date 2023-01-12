const Strategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport');
const User = require('./models/User');

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const verify = async (accessToken, refreshToken, profile, verified) => {
  let email;
  let avatarUrl;
  if (profile.emails) {
    email = profile.emails[0].value;
  }
  if (profile.photos && profile.photos.length > 0) {
    avatarUrl = profile.photos[0].value.replace('sz=50', 'sz=128');
  }

  try {
    const user = await User.signInOrSignUp({
      googleId: profile.id,
      email,
      googleToken: { accessToken, refreshToken },
      displayName: profile.displayName,
      avatarUrl,
    });
    verified(null, user);
  } catch (error) {
    verified(error);
    console.log(error);
  }
};

const setupGoogle = ({ ROOT_URL, server }) => {
  passport.use(
    new Strategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${ROOT_URL}/oauth2callback`,
      },
      verify,
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, User.publicFields(), (err, user) => {
      done(err, user);
    });
  });

  server.use(passport.initialize());
  server.use(passport.session());

  server.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }),
  );
  server.get(
    '/oauth2callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (_, res) => {
      res.redirect('/admin');
    },
  );
  server.get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) next(err);
      res.redirect('/login');
    });
  });
};

module.exports = setupGoogle;
