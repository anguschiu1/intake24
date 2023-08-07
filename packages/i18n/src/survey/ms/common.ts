import type { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24',
  home: 'Utama',
  dashboard: 'Halaman utama',
  welcome: {
    _: 'Selamat datang ke Intake24',
    subtitle:
      'Intake24 ialah sistem berkomputer sumber terbuka ingatan semula diet, yang dilengkapi oleh pengguna berdasarkan rekod ingatan semula multiple-pass 24 jam..',
  },
  login: {
    _: 'Daftar masuk',
    subtitle: 'Daftar masuk dengan nama pengguna & kata laluan anda',
    back: 'Kembali ke log masuk',

    err: {
      invalidCredentials: 'Nama pengguna & kata laluan yang diberikan adalah tidak sah.',
      invalidToken: 'Token akses yang diberikan adalah tidak sah.',
      invalidSurvey:
        'Survei ini ({surveyId}) tidak kelihatan seperti URL log masuk survei yang sah.',
      checkCredentials: 'Semak kelayakan log masuk anda seperti yang disediakan.',
    },
  },
  logout: {
    _: 'Log keluar',
    text: 'Log keluar daripada aplikasi',
  },

  username: 'Nama pengguna',
  name: 'Nama',
  email: 'Emel',
  emailConfirm: 'Sahkan emel',
  password: 'Kata laluan',
  phone: 'Telefon',
  message: 'Message',
  continue: 'Teruskan',

  help: {
    _: 'Bantuan',
    title: 'Mohon bantuan',
    sent: 'Permohonan bantuan anda telah dihantar.',
  },

  app: {
    _: 'Aplikasi',
    info: 'Maklumat aplikasi',
    build: 'Bina',
  },

  clipboard: {
    _: 'Salin ke clipboard',
    copied: 'Data disalin ke clipboard',
  },

  sw: {
    check: 'Kandungan yang dikemas kini telah tersedia',
    update: 'Kemas kini',
  },

  action: {
    cancel: 'Batal',
    close: 'Tutup',
    continue: 'Teruskan',
    confirm: {
      _: 'Sahkan',
      title: 'Adakah anda mahu teruskan?',
      delete: `Adakah anda mahu padam {name}?`,
    },
    ok: 'OK',
    reload: 'Muat semula',
    remove: 'Hapus',
    reset: 'Set semula',
    start: 'Mula',
    submit: 'Hantar',
    yes: 'Ya',
    no: 'Tidak',
  },

  not: {
    provided: 'Tidak disediakan',
    selected: 'Tidak dipilih',
  },

  errors: {
    expansionIncomplete: 'Lengkapkan semua bahagian yang ditanda dengan !',
  },
};

export default common;
