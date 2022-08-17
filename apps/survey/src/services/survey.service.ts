import type { SurveyState } from '@intake24/common/types';
import type {
  GenerateUserResponse,
  PublicSurveyEntry,
  SurveyEntryResponse,
  SurveyFollowUpResponse,
  SurveyUserInfoResponse,
  SurveyUserSessionResponse,
} from '@intake24/common/types/http';

import http from './http.service';

export type GenerateUserPayload = {
  captcha: string | null;
};

export default {
  generateUser: async (
    surveyId: string,
    payload: GenerateUserPayload
  ): Promise<GenerateUserResponse> => {
    const {
      data: { username, password },
    } = await http.post<GenerateUserResponse>(`surveys/${surveyId}/generate-user`, payload);

    return { username, password };
  },

  surveyPublicList: async (): Promise<PublicSurveyEntry[]> => {
    const { data } = await http.get<PublicSurveyEntry[]>(`surveys`);

    return data;
  },

  surveyPublicInfo: async (surveyId: string): Promise<PublicSurveyEntry> => {
    const { data } = await http.get<PublicSurveyEntry>(`surveys/${surveyId}`);

    return data;
  },

  surveyInfo: async (surveyId: string): Promise<SurveyEntryResponse> => {
    const { data } = await http.get<SurveyEntryResponse>(`surveys/${surveyId}/parameters`);

    return data;
  },

  userInfo: async (surveyId: string): Promise<SurveyUserInfoResponse> => {
    const tzOffset = new Date().getTimezoneOffset();

    const { data } = await http.get<SurveyUserInfoResponse>(`surveys/${surveyId}/user-info`, {
      params: { tzOffset },
    });

    return data;
  },

  getUserSession: async (surveyId: string): Promise<SurveyUserSessionResponse> => {
    const { data } = await http.get<SurveyUserSessionResponse>(`surveys/${surveyId}/session`);

    return data;
  },

  setUserSession: async (
    surveyId: string,
    sessionData: SurveyState
  ): Promise<SurveyUserSessionResponse> => {
    const { data } = await http.post<SurveyUserSessionResponse>(`surveys/${surveyId}/session`, {
      sessionData,
    });

    return data;
  },

  submit: async (surveyId: string, submission: SurveyState): Promise<SurveyFollowUpResponse> => {
    const tzOffset = new Date().getTimezoneOffset();

    const { data } = await http.post<SurveyFollowUpResponse>(
      `surveys/${surveyId}/submission`,
      { submission },
      { params: { tzOffset } }
    );

    return data;
  },
};
