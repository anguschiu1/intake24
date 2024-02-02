import type { PassportStatic } from 'passport';
import type { StrategyOptions } from 'passport-jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Op } from 'sequelize';

import type { TokenPayload } from '@intake24/common/security';
import type { FrontEnd } from '@intake24/common/types';
import security from '@intake24/api/config/security';
import { User } from '@intake24/db';

const { issuer, secret } = security.jwt;

export const opts: Record<FrontEnd, StrategyOptions> = {
  admin: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    issuer,
    audience: 'access',
  },
  survey: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    issuer,
    audience: 'access',
  },
};

export const buildJwtStrategy = (frontEnd: FrontEnd): Strategy =>
  new Strategy(opts[frontEnd], async (payload, done) => {
    const { userId, jti, aud } = payload as TokenPayload;

    try {
      if (!Array.isArray(aud) || !aud.includes('personal')) {
        done(null, payload ?? false);
        return;
      }

      const user = await User.findOne({
        attributes: ['id'],
        where: { id: userId, disabledAt: null, verifiedAt: { [Op.ne]: null } },
        include: [
          {
            association: 'personalAccessTokens',
            attributes: ['token'],
            where: { token: jti, revoked: false, expiresAt: { [Op.gt]: new Date() } },
          },
        ],
      });

      done(null, user ? payload : false);
    } catch (err) {
      done(err, false);
    }
  });

export default (passport: PassportStatic): void => {
  passport.use('survey', buildJwtStrategy('survey'));
  passport.use('admin', buildJwtStrategy('admin'));
};
