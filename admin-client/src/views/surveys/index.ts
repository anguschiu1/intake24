import { Views } from '@/types/vue-router';
import detail from './Detail.vue';
import form from './Form.vue';
import list from './List.vue';
import mgmt from './Mgmt.vue';
import respondents from './Respondents.vue';

export default { detail, create: form, edit: form, list, mgmt, respondents } as Views;
