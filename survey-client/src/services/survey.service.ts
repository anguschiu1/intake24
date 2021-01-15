import { Dictionary, Scheme } from '@common/types';
import http from './http.service';

export interface GenerateUserResponse {
  userName: string;
  password: string;
}

export interface SurveyParametersResponse {
  description: string | null;
  finalPageHtml: string | null;
  id: string;
  localeId: string;
  numberOfSurveysForFeedback: number;
  schemeId: string;
  scheme: Scheme;
  state: string;
  storeUserSessionOnServer: boolean;
  suspensionReason: string | null;
  uxEventsSettings: Dictionary;
}

export interface SurveyPublicParametersResponse {
  localeId: string;
  originatingURL: string | null;
  respondentLanguageId: string;
  supportEmail: string;
}

export interface SurveyUserInfoResponse {
  id: number;
  name: string | null;
  recallNumber: number;
  redirectToFeedback: boolean;
}

export default {
  generateUser: async (surveyId: string): Promise<GenerateUserResponse> => {
    const {
      data: { userName, password },
    } = await http.post<GenerateUserResponse>(`surveys/${surveyId}/generate-user`);

    return { userName, password };
  },

  surveyInfo: async (surveyId: string): Promise<SurveyParametersResponse> => {
    const { data } = await http.get<SurveyParametersResponse>(`surveys/${surveyId}/parameters`);

    return data;
  },

  surveyPublicInfo: async (surveyId: string): Promise<SurveyPublicParametersResponse> => {
    const { data } = await http.get<SurveyPublicParametersResponse>(`surveys/${surveyId}`);

    return data;
  },

  userInfo: async (surveyId: string): Promise<SurveyUserInfoResponse> => {
    const { data } = await http.get<SurveyUserInfoResponse>(`surveys/${surveyId}/user-info`);

    return data;
  },
};
