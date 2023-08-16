import type { LocaleMessageObject } from 'vue-i18n';

const common: LocaleMessageObject = {
  _: 'Intake24',
  home: 'முகப்பு',
  dashboard: 'முகப்பலகம்',
  welcome: {
    _: 'Intake24க்கு வரவேற்கிறோம்',
    subtitle:
      'Intake2 என்பது மல்டிபிள் பாஸ் 24 மணி நேர நினைவுட்டு  அடிப்படையிலான ஒரு திறந்த மூல சுய-நிறைவு செய்யப்பட்ட கணினிமயமாக்கப்பட்ட உணவுமுறை திரும்ப மென்பொருள் அமைப்பாகும்.',
  },
  login: {
    _: 'உள்நுழைக',
    subtitle: 'உங்கள் பயனர்பெயர் மற்றும் கடவுச்சொல்லுடன் உள்நுழையவும்',
    back: 'உள்நுழைவுக்குத் திரும்பு',

    err: {
      invalidCredentials: 'தவறான பயனர்பெயர் மற்றும் கடவுச்சொல் சான்றுகள் வழங்கப்பட்டுள்ளன.',
      invalidToken: 'தவறான அணுகல் டோக்கன் வழங்கப்பட்டது.',
      invalidSurvey:
        'இந்த கருத்துக்கணிப்பு ({surveyId}) சரியான கணக்கெடுப்பு உள்நுழைவு URL போல் இல்லை.',
      checkCredentials: 'நீங்கள் வழங்கிய உள்நுழைவுச் சான்றுகளைச் சரிபார்க்கவும்.',
    },
  },
  logout: {
    _: 'வெளியேறு',
    text: 'பயன்பாட்டில் இருந்து வெளியேறவும்',
  },

  username: 'பயனர் பெயர்',
  name: 'பெயர்',
  email: 'மின்னஞ்சல்',
  emailConfirm: 'மின்னஞ்சலை உறுதிப்படுத்தவும்',
  password: 'கடவுச்சொல்',
  phone: 'தொலைபேசி',
  message: 'Message',
  continue: 'தொடரவும்',

  help: {
    _: 'உதவி',
    title: 'உதவி கேட்கவும்',
    text: 'Please complete the form below and one of our support staff will get in touch as soon as they can.',
    sent: 'உங்கள் உதவிக் கோரிக்கை அனுப்பப்பட்டது.',
  },

  app: {
    _: 'செயலி',
    info: 'செயலி தகவல்',
    build: 'உருவாக்கு',
  },

  clipboard: {
    _: 'கிளிப்போர்டுக்கு நகலெடுக்கவும்',
    copied: 'கிளிப்போர்டுக்கு தரவு நகலெடுக்கப்பட்டது',
  },

  sw: {
    check: 'உள்ளடக்க புதுப்பிப்பு இருக்கிறது.',
    update: 'புதுப்பிக்கவும்',
  },

  action: {
    cancel: 'ரத்து செய்',
    close: 'மூடு',
    continue: 'தொடரவும்',
    confirm: {
      _: 'உறுதிப்படுத்தவும்',
      title: 'தொடர வேண்டுமா?',
      delete: `{name}ஐ நீக்க வேண்டுமா?`,
    },
    ok: 'சரி',
    reload: 'ஏற்றவும்',
    remove: 'அகற்று',
    reset: 'மீட்டமை',
    start: 'தொடங்கு',
    submit: 'சமர்ப்பிக்கவும்',
    yes: 'ஆம்',
    no: 'இல்லை',
  },

  not: {
    provided: 'வழங்கப்படவில்லை',
    selected: 'தேர்ந்தெடுக்கப்படவில்லை',
  },

  errors: {
    expansionIncomplete: 'குறிக்கப்பட்ட அனைத்து பிரிவுகளையும் முடிக்கவும் !',
  },
};

export default common;
