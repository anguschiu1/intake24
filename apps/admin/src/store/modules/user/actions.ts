import { ActionTree } from 'vuex';
import { RootState, UserState } from '@intake24/admin/types';
import http from '@intake24/admin/services/http.service';

const actions: ActionTree<UserState, RootState> = {
  async request({ commit }) {
    return new Promise((resolve, reject) => {
      commit('request');
      commit('loading/add', 'user', { root: true });

      http
        .get('admin/user')
        .then((res) => {
          commit('success', res.data);
          resolve(res);
        })
        .catch((err) => {
          commit('error');
          reject(err);
        })
        .finally(() => commit('loading/remove', 'user', { root: true }));
    });
  },
};

export default actions;
