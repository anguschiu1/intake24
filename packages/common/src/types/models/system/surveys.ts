import type { SchemeOverrides } from '../../../schemes';
import { Optional } from '../model';

export const surveyStates = {
  NOT_STARTED: 0,
  ACTIVE: 1,
  SUSPENDED: 2,
} as const;

export type SurveyState = typeof surveyStates[keyof typeof surveyStates];

export const searchSortingAlgorithms = ['paRules', 'popularity', 'globalPop', 'fixed'] as const;

export type SearchSortingAlgorithm = typeof searchSortingAlgorithms[number];

export type SurveyAttributes = {
  id: string;
  name: string;
  state: SurveyState;
  startDate: Date;
  endDate: Date;
  surveySchemeId: string;
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
  feedbackSchemeId: string | null;
  submissionNotificationUrl: string | null;
  storeUserSessionOnServer: boolean;
  numberOfSubmissionsForFeedback: number;
  finalPageHtml: string | null;
  maximumDailySubmissions: number;
  maximumTotalSubmissions: number | null;
  minimumSubmissionInterval: number;
  searchSortingAlgorithm: SearchSortingAlgorithm;
  searchMatchScoreWeight: number;
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
  | 'feedbackSchemeId'
  | 'submissionNotificationUrl'
  | 'numberOfSubmissionsForFeedback'
  | 'finalPageHtml'
  | 'maximumDailySubmissions'
  | 'maximumTotalSubmissions'
  | 'minimumSubmissionInterval'
  | 'searchSortingAlgorithm'
  | 'searchMatchScoreWeight'
>;

// TODO: to review
export type Deprecated = 'surveyMonkeyUrl' | 'originatingUrl' | 'description' | 'finalPageHtml';

export type SurveyAttributesKeys = keyof Omit<SurveyAttributes, Deprecated>;

export const updateSurveyFields = [
  'name',
  'state',
  'startDate',
  'endDate',
  'surveySchemeId',
  'localeId',
  'allowGenUsers',
  'genUserKey',
  'authUrlDomainOverride',
  'authUrlTokenCharset',
  'authUrlTokenLength',
  'suspensionReason',
  'supportEmail',
  'description',
  'feedbackSchemeId',
  'submissionNotificationUrl',
  'storeUserSessionOnServer',
  'numberOfSubmissionsForFeedback',
  'maximumDailySubmissions',
  'maximumTotalSubmissions',
  'minimumSubmissionInterval',
  'searchSortingAlgorithm',
  'searchMatchScoreWeight',
  'overrides',
] as const;

export type UpdateSurveyFields = typeof updateSurveyFields[number];

export const createSurveyFields = ['id', ...updateSurveyFields] as const;

export type CreateSurveyFields = typeof updateSurveyFields[number];

export const staffUpdateSurveyFields = [
  'name',
  'state',
  'startDate',
  'endDate',
  'surveySchemeId',
  'localeId',
  'supportEmail',
  'suspensionReason',
] as const;

export type StaffUpdateSurveyFields = typeof staffUpdateSurveyFields[number];

export const overridesFields = ['overrides'] as const;

export type OverridesFields = typeof overridesFields[number];
