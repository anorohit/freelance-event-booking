import type { SessionOptions } from 'iron-session';
export type SessionUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
};

declare module 'iron-session' {
  interface IronSessionData {
    user?: SessionUser;
  }
}

export const ironSessionOptions: SessionOptions = {
  cookieName: 'eventhub_session',
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}; 