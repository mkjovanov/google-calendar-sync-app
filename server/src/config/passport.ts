import passport from "passport";
import {
    Strategy as GoogleStrategy,
    StrategyOptions,
    VerifyCallback,
} from "passport-google-oauth20";
import { prisma } from "../prisma";
import { User } from "@prisma/client";

interface GoogleAuthParams {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
  expires_in: number;
}

interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: Array<{ value: string; verified?: boolean }>;
  photos?: Array<{ value: string }>;
}

type GoogleVerifyFn = (
  accessToken: string,
  refreshToken: string,
  params: GoogleAuthParams,
  profile: GoogleProfile,
  done: VerifyCallback
) => void | Promise<void>;

export default function setupPassport() {
  const options: StrategyOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  };

  const verify: GoogleVerifyFn = async (
    accessToken,
    refreshToken,
    params,
    profile,
    done
  ) => {
    try {
      const tokenExpiresAt = params.expires_in
        ? new Date(Date.now() + params.expires_in * 1000)
        : null;

      const baseData = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value ?? "",
        picture: profile.photos?.[0]?.value,
        accessToken,
        refreshToken,
        tokenExpiresAt,
      };

      const existing = await prisma.user.findUnique({
        where: { googleId: profile.id },
      });

      const user: User = existing
        ? await prisma.user.update({
            where: { googleId: profile.id },
            data: baseData,
          })
        : await prisma.user.create({ data: baseData });

      done(null, user);
    } catch (err) {
      done(err as Error);
    }
  };

  return passport.use(new GoogleStrategy(options, verify));
}
