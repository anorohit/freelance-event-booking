import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '@/models/User'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string

export function setupGoogleStrategy() {
  if ((passport as any)._strategies && (passport as any)._strategies['google']) return // Prevent re-registering in dev

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find or create user
          let user = await User.findOne({ email: profile.emails?.[0].value })
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails?.[0].value,
              password: '', // Not used for Google users
              role: 'user',
            })
          }
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.serializeUser((user: any, done : any) => done(null, user._id))
  passport.deserializeUser(async (id: any, done: any) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
} 