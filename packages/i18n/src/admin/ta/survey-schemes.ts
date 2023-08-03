import type { LocaleMessageObject } from 'vue-i18n';

import securables from './securables';

const surveySchemes: LocaleMessageObject = {
  _: 'Survey scheme',
  title: 'Survey schemes',
  all: 'All schemes',
  read: 'Survey scheme detail',
  create: 'Add survey scheme',
  edit: 'Edit survey scheme',
  delete: 'Delete survey scheme',
  load: 'Load from scheme',
  none: 'No survey scheme found',

  copy: {
    _: 'Copy',
    title: 'Copy survey scheme',
    name: 'New survey scheme name',
  },

  types: {
    _: 'Type',
    default: 'Default',
  },

  meals: {
    _: 'Meal',
    title: 'Default meals',
    create: 'New meal',
    edit: 'Edit meal',
    remove: 'Remove meal',
    name: 'Meal name',
    reset: {
      _: 'Reset meals',
      text: 'Reset meals to default list',
    },
    validation: {
      required: 'Meal name must be filled in.',
      unique: 'Meal name already exists in current list.',
    },
  },

  actions: {
    _: 'Action',
    title: 'Actions',
    add: 'New action',
    remove: 'Remove action',
    enable: 'Enable custom prompt actions',
    both: 'Display both layout actions in mobile UI',
    color: 'Color',
    icon: 'Icon',
    label: 'Label',
    text: 'Text',
    layouts: {
      _: 'Layout',
      title: 'Layouts',
      desktop: 'Desktop',
      mobile: 'Mobile',
    },
    types: {
      _: 'Action type',
      title: 'Action types',
      next: 'Next',
      'no-more-information': 'No More Information',
      review: 'Review',
      addFood: 'Add food',
      addMeal: 'Add meal',
      deleteFood: 'Delete food',
      deleteMeal: 'Delete meal',
      editFood: 'Edit food',
      editMeal: 'Edit meal',
      mealTime: 'Meal time',
      selectFood: 'Select food',
      selectMeal: 'Select meal',
    },
    variants: {
      _: 'Action variant',
      title: 'Action variants',
      elevated: 'Elevated',
      outlined: 'Outlined',
      text: 'Text',
    },
  },

  conditions: {
    _: 'Condition',
    title: 'Conditions',
    add: 'New condition',
    remove: 'Remove condition',
    sections: {
      _: 'Section',
      title: 'Sections',
      food: 'Food',
      meal: 'Meal',
      survey: 'Survey',
    },
    types: {
      _: 'Condition type',
      title: 'Condition types',
      promptAnswer: 'Prompt answer',
      recallNumber: 'Recall number',
      drinks: 'Drinks',
      energy: 'Energy',
      foodCategory: 'Food category',
    },
    exTypes: {
      promptAnswer: 'Prompt answer {section}: {promptId}',
      recallNumber: 'Recall number',
      drinks: 'Drinks ({section})',
      energy: 'Energy ({section})',
      foodCategory: 'Food category',
    },
    ops: {
      _: 'Operation',
      eq: 'equal',
      ne: 'not equal',
      in: 'is in',
      notIn: 'is not in',
      gte: 'greater than or equal to',
      gt: 'greater than',
      lte: 'less than or equal to',
      lt: 'less than',
    },
    value: 'Condition value',
    promptId: 'Prompt ID',
    showIf: 'Show prompt if: ',
  },
  'data-export': {
    _: 'Data export',
    tab: 'Data export',
    title: 'Data export fields',
    current: 'Current export fields',
    available: 'Available export fields',
    edit: 'Edit fields',
    fields: {
      _: 'Edit field label',
      id: 'Field ID',
      label: 'Field label',
    },
    sections: {
      _: 'Data export sections',
      user: 'User record fields',
      userCustom: 'User custom fields',
      survey: 'Survey record fields',
      submission: 'Submission fields',
      submissionCustom: 'Submission custom fields',
      meal: 'Meal record fields',
      mealCustom: 'Meal custom fields',
      food: 'Food record fields',
      foodCustom: 'Food custom fields',
      foodFields: 'Food composition fields',
      foodNutrients: 'Food nutrient fields',
      portionSizes: 'Portion size fields',
    },
  },
  overrides: {
    _: 'Scheme overrides',
    meals: {
      title: 'Scheme meals overrides',
      subtitle:
        'Override scheme meal list. If left empty, scheme list is used. If any item added, whole list is used.',
    },
    prompts: {
      title: 'Scheme prompts overrides',
      subtitle: 'Override specific scheme prompt. Changes will get merged by Prompts ID.',
    },
  },
  prompts: {
    _: 'Scheme prompt',
    tab: 'Prompts',
    title: 'Scheme prompts',
    create: 'New prompt',
    edit: 'Edit prompt',
    move: 'Move prompt',
    remove: 'Remove prompt',
    section: 'Prompts section',
    preMeals: {
      title: 'Pre-recall prompts',
      subtitle:
        'General prompt asked before the dietary recall, including personal prompts and the initial instructions.',
    },
    postMeals: {
      title: 'Post-recall prompts',
      subtitle: 'General prompts asked after the dietary recall.',
    },
    submission: {
      title: 'Submission prompts',
      subtitle: 'Final prompts asked before the submission.',
    },
    preFoods: {
      title: 'Pre-foods meal prompts',
      subtitle: 'prompts asked about meals before foods are entered, such as the meal time.',
    },
    foods: {
      title: 'Food prompts',
      subtitle:
        'prompts asked about foods, including food database search and portion size estimation.',
    },
    postFoods: {
      title: 'Post-foods meal prompts',
      subtitle:
        'Prompts asked about meals after the portion size estimation is complete for all foods in the meal.',
    },
    internal: {
      _: 'Internal identifiers',
      id: {
        _: 'Prompt ID',
        hint: 'Internal unique identifier, used e.g. in data-exports as header',
      },
      name: {
        _: 'Prompt Name',
        hint: 'Internal descriptive name for better orientation ',
      },
    },
    type: 'Prompt type',
    component: 'Prompt component',
    name: {
      _: 'Prompt Name',
      hint: 'Short prompt name (e.g. for breadcrumbs)',
      required: 'Prompt name is required.',
    },
    text: {
      _: 'Prompt text',
      hint: 'Main prompt text',
      required: 'Prompt text is required.',
    },
    description: {
      _: 'Prompt description',
      hint: 'Additional prompt information',
      required: 'Prompt description is required.',
    },
    custom: {
      _: 'Custom',
      noPrompts: 'No custom prompts available for this section',
    },
    standard: {
      _: 'Standard',
      noPrompts: 'No standard prompts available for this section',
    },
    'portion-size': {
      _: 'Portion size',
      noPrompts: 'No portion size prompts available for this section',
    },
    badges: 'Show quantity badges',
    imageMap: {
      _: 'Image map settings',
      labels: 'Show labels',
      pinchZoom: `Show PinchZoom for mobile UI`,
    },
    label: 'Options list label',
    leftovers: 'Allow leftovers',
    other: 'Allow custom other option',
    orientation: {
      _: 'Orientation',
      column: 'Column',
      row: 'Row',
    },
    slider: {
      _: 'Slider settings',
      initial: 'Initial value',
      min: 'Minimum value',
      max: 'Maximum value',
      step: 'Step increment',
    },
    timePicker: {
      allowedMinutes: {
        _: 'Allowed minutes',
        item: 'Every {item} minutes',
      },
      format: {
        _: 'Time format',
        ampm: 'AM/PM',
        '24hr': '24-hour',
      },
    },
    validation: {
      required: 'Prompt is required to be filled in',
      message: 'Error message to be displayed',
    },
    templates: {
      _: 'Prompt Template',
      title: 'Prompt Templates',
      add: 'Load from template',
      alreadyExists: `Prompt with ID '{promptId}' already exists in scheme`,
      none: 'No prompt template found',
      saveAs: {
        _: 'Save as template',
        title: 'Save prompt as template',
      },
    },

    // Standard
    'associated-foods-prompt': {
      title: 'Associated foods',
      subtitle: 'Suggest foods typically consumed together',
    },
    'edit-meal-prompt': {
      title: 'Food list',
      subtitle: 'List or edit foods in this meal as free text descriptions',
      separateDrinks: 'Separate drinks list',
    },
    'final-prompt': {
      title: 'Final',
      subtitle: 'Final page after submission',
    },
    'food-search-prompt': {
      title: 'Food database search',
      subtitle: 'Choose a food from the database that best matches the description',
      allowBrowsing: 'Allow respondents to search for foods by freely browsing food categories',
      dualLanguage: 'Display alternative food names in another language',
    },
    'meal-add-prompt': {
      title: 'Add meal',
      subtitle: 'Add a new meal to the meal list',
      custom: 'Allow custom meal names',
    },
    'meal-duration-prompt': {
      title: 'Meal duration',
      subtitle: 'Ask about meal duration',
      initial: 'Initial meal duration',
      min: 'Minimum meal duration',
      max: 'Maximum meal duration',
      step: 'Meal duration step',
    },
    'meal-gap-prompt': {
      title: 'Meal time gap',
      subtitle: 'Check time gap between meals',
      gap: 'Time gap between meals (minutes)',
      startTime: 'Day start time',
      endTime: 'Day end time',
    },
    'meal-time-prompt': {
      title: 'Meal time',
      subtitle: 'Confirm the time of the meal or remove the meal',
    },
    'ready-meal-prompt': {
      title: 'Ready meal',
      subtitle: 'Ask about ready meals',
    },
    'redirect-prompt': {
      title: 'Redirect',
      subtitle: 'Final page for user redirect to external site',
      url: {
        _: 'Base URL',
        title: 'URL Options',
        subtitle: `Use '{identifier}' to indicate the place where user identifier should be to inserted.`,
        hint: 'https://example.com/?arg={identifier}',
      },
      identifier: {
        _: 'User identifier to embed into the URL',
        subtitle: 'Specify which identifier to embed into the redirect URL',
        hint: `Custom value will be looked up in 'user custom fields'`,
        options: {
          userId: 'User ID',
          username: 'Username',
          urlAuthToken: 'Authentication token',
        },
      },
      timer: {
        _: 'Number of seconds for redirect',
        title: 'Timer options',
      },
    },
    'review-confirm-prompt': {
      title: 'Review and Confirm',
      subtitle: 'Review and Confirm completion and progress of the recall',
    },
    'same-as-before-prompt': {
      title: 'Same as before',
      subtitle: 'Ask if food was same as before',
    },
    'split-food-prompt': {
      title: 'Split food',
      subtitle: 'Ask for split food description',
    },
    'submit-prompt': {
      title: 'Submit',
      subtitle: 'Confirm completion and submit recall',
    },
    // Custom
    'info-prompt': {
      title: 'Information',
      subtitle: 'Show a message or instructions and ask for confirmation',
    },
    'no-more-information-prompt': {
      title: 'No More Information',
      subtitle: 'Show a message that no more information needed for the current selection',
    },
    'date-picker-prompt': {
      title: 'Date',
      subtitle: 'Ask to choose a date',
      futureDates: 'Allow future dates',
    },
    'time-picker-prompt': {
      title: 'Time',
      subtitle: 'Ask to choose a time of day',
    },
    'checkbox-list-prompt': {
      title: 'Multiple choice',
      subtitle: 'Ask to choose any number of items from a list',
    },
    'radio-list-prompt': {
      title: 'Single choice',
      subtitle: 'Ask to choose one item from a list',
    },
    'textarea-prompt': {
      title: 'Free text',
      subtitle: 'Ask to enter a free text answer or description',
    },
    'yes-no-prompt': {
      title: 'Yes / No choice',
      subtitle: 'Ask to choose yes or no',
    },
    // Portion sizes
    'as-served-prompt': {
      title: 'As served portion size',
      subtitle: 'Use the "as served" method to estimate the portion size',
      linkedQuantityCategories: 'Linked quantity categories',
    },
    'cereal-prompt': {
      title: 'Cereal',
      subtitle: 'Use the "cereal" method to estimate the portion size',
    },
    'direct-weight-prompt': {
      title: 'Direct weight',
      subtitle: 'Direct weight',
    },
    'drink-scale-prompt': {
      title: 'Drink Scale',
      subtitle: 'Use the "drink scale" method to estimate the amount of liquid consumed',
      multiple: 'Allow specifying multiple items',
    },
    'guide-image-prompt': {
      title: 'Guide image',
      subtitle: 'Use the "guide image" method to estimate the portion size',
    },
    'milk-in-a-hot-drink-prompt': {
      title: 'Milk in a hot drink',
      subtitle: 'Use the "milk in a hot drink" method to estimate the amount of milk',
    },
    'milk-on-cereal-prompt': {
      title: 'Milk on cereal',
      subtitle: 'Use the "milk on cereal" method to estimate the portion size',
    },
    'missing-food-prompt': {
      title: 'Missing food',
      subtitle: 'Collecting information about missing food',
    },
    'pizza-prompt': {
      title: 'Pizza',
      subtitle: 'Use the "pizza" method to estimate the portion size',
    },
    'parent-food-portion-prompt': {
      title: 'Portion of parent food',
      subtitle: 'Use the "portion of parent food" method to estimate the portion size',
      portions: 'Category portions list',
    },
    'portion-size-option-prompt': {
      title: 'Portion size estimation method',
      subtitle:
        'Choose which portion size method to use in case more than one is available for the food',
    },
    'standard-portion-prompt': {
      title: 'Standard portion',
      subtitle: 'Use the "standard portion" method to estimate the portion size',
    },
  },

  securables,
};

export default surveySchemes;
