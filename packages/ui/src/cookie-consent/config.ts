import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import type { PluginOptions } from 'vue-gtag';
import Clarity from '@microsoft/clarity';
import { bootstrap, optIn, optOut, setOptions } from 'vue-gtag';

export function gTagConfig(): PluginOptions {
  return {
    appName: import.meta.env.VITE_APP_NAME,
    config: {
      id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    },
  };
}

export function toggleClarity(enabled: boolean) {
  if (!enabled) {
    return;
  }

  Clarity.init(import.meta.env.VITE_MS_CLARITY_PROJECT_ID);
  Clarity.consent(true);
}

async function toggleGA(enabled: boolean) {
  if (!enabled) {
    optOut();
    return;
  }

  optIn();
  setOptions(gTagConfig());
  await bootstrap();
}

export function cookieConsentConfig(translations: CookieConsentConfig['language']['translations'] = {}): CookieConsentConfig {
  return ({
    cookie: {
      name: 'it24_cc_consent',
      expiresAfterDays: 365,
    },
    mode: 'opt-out',
    categories: {
      necessary: {
        enabled: true,
        readOnly: true,
      },
      analytics: {
        enabled: true,
      },
    },
    language: {
      default: 'en',
      translations,
    },
    onChange: ({ cookie }) => {
      toggleGA(cookie.categories.includes('analytics'));
      toggleClarity(cookie.categories.includes('analytics'));
    },
    onFirstConsent: ({ cookie }) => {
      toggleGA(cookie.categories.includes('analytics'));
      toggleClarity(cookie.categories.includes('analytics'));
    },
  });
}
