import { Survey } from '@/db/models/system';

export default (survey: Survey) => {
  return {
    ...survey.get(),
    startDate: survey.startDate.toISOString().split('T')[0],
    endDate: survey.endDate.toISOString().split('T')[0],
  };
};
