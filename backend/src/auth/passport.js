import passport from "passport";
import { Strategy as OAuth2Strategy } from "passport-oauth2";

// À adapter selon le fournisseur OAuth (Google, GitHub, etc.)
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || "";
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || "";
const OAUTH_CALLBACK_URL = process.env.OAUTH_CALLBACK_URL || "http://localhost:4000/api/auth/callback";

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://provider.com/oauth2/authorize", // À personnaliser
      tokenURL: "https://provider.com/oauth2/token", // À personnaliser
      clientID: OAUTH_CLIENT_ID,
      clientSecret: OAUTH_CLIENT_SECRET,
      callbackURL: OAUTH_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
      // Ici, on peut chercher/créer l'utilisateur jury dans la base
      // Pour l'instant, on renvoie juste le token
      return cb(null, { accessToken, profile });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
