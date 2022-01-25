import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import Storage from 'vue-ls';
import Toasted from 'vue-toasted';
import loading from './mixins/loading';
import platform from './mixins/platform';

Vue.use(VueCompositionAPI);

const options = { namespace: process.env.VUE_APP_PREFIX };
Vue.use(Storage, options);
Vue.ls.setOptions(options);

Vue.use(Toasted, {
  duration: 10000,
  keepOnHover: true,
  iconPack: 'fontawesome',
  position: 'bottom-center',
});

Vue.mixin(loading);
Vue.mixin(platform);
