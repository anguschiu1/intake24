import type { SchemeOverrides } from '../../../schemes';
import { Optional } from '../model';

export enum SurveyState {
  NOT_STARTED = 0,
  ACTIVE = 1,
  SUSPENDED = 2,
}

export type SurveyAttributes = {
  id: string;
  name: string;
  state: SurveyState;
  startDate: Date;
  endDate: Date;
  schemeId: string;
  localeId: string;
  allowGenUsers: boolean;
  genUserKey: string | null;
  authUrlDomainOverride: string | null;
  authUrlTokenCharset: string | null;
  authUrlTokenLength: number | null;
  suspensionReason: string | null;
  surveyMonkeyUrl: string | null;
  supportEmail: string;
  originatingUrl: string | null;
  description: string | null;
  feedbackEnabled: boolean;
  feedbackStyle: string;
  submissionNotificationUrl: string | null;
  storeUserSessionOnServer: boolean;
  numberOfSubmissionsForFeedback: number;
  finalPageHtml: string | null;
  maximumDailySubmissions: number;
  maximumTotalSubmissions: number | null;
  minimumSubmissionInterval: number;
  overrides: SchemeOverrides;
};

export type SurveyCreationAttributes = Optional<
  SurveyAttributes,
  | 'genUserKey'
  | 'authUrlDomainOverride'
  | 'authUrlTokenCharset'
  | 'authUrlTokenLength'
  | 'suspensionReason'
  | 'surveyMonkeyUrl'
  | 'originatingUrl'
  | 'description'
  | 'feedbackEnabled'
  | 'feedbackStyle'
  | 'submissionNotificationUrl'
  | 'numberOfSubmissionsForFeedback'
  | 'finalPageHtml'
  | 'maximumDailySubmissions'
  | 'maximumTotalSubmissions'
  | 'minimumSubmissionInterval'
>;
