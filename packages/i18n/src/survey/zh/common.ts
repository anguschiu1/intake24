import type { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24',
  home: '主页',
  dashboard: '仪表板',
  welcome: {
    _: '欢迎来到Intake24',
    subtitle: 'Intake24 是一个基于通过多次 24 小时召回的开源自完成计算机化饮食回忆系统。',
  },
  login: {
    _: '登录',
    subtitle: '使用您的用户名和密码登录',
    back: '返回登录',

    err: {
      invalidCredentials: '提供的用户名和密码凭据无效。',
      invalidToken: '提供的访问令牌无效。',
      invalidSurvey: '此调查（{surveyId}）看起来不是有效的调查登录 URL。',
      checkCredentials: '请检查您提供的登录凭据。',
    },
  },
  logout: {
    _: '登出',
    text: '登出应用程序',
  },

  username: '用户名',
  name: '名字',
  email: '电子邮件',
  emailConfirm: '确认电子邮件',
  password: '密码',
  phone: '电话',
  continue: '继续',

  help: {
    _: '帮助',
    title: '请求帮助',
    sent: '您的帮助请求已发送。',
  },

  app: {
    _: '应用程序',
    info: '应用程序信息',
    build: '构建',
  },

  clipboard: {
    _: '复制到剪贴板',
    copied: '数据已复制到剪贴板',
  },

  sw: {
    check: '内容更新可用',
    update: '更新',
  },

  action: {
    cancel: '取消',
    close: '关闭',
    continue: '继续',
    confirm: {
      _: '确认',
      title: '是否要继续吗?',
      delete: `是否要删除 {name}？`,
    },
    ok: 'OK',
    reload: '重新加载',
    remove: '删除',
    reset: '重置',
    start: '开始',
    submit: '提交',
    yes: '是',
    no: '否',
  },

  not: {
    provided: '未提供',
    selected: '未选择',
  },

  errors: {
    expansionIncomplete: '完成标有 ! 部分',
  },
};

export default common;
