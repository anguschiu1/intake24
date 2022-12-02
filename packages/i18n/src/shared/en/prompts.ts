import type { LocaleMessageObject } from 'vue-i18n';

const prompts: LocaleMessageObject = {
  checkbox: {
    label: 'Select any of the options',
    other: 'Please specify',
    validation: {
      required: 'At least one of the options requires to be selected.',
    },
  },
  datepicker: {
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  radio: {
    label: 'Select one of the options',
    other: 'Please specify',
    validation: {
      required: 'One of the options requires to be selected.',
    },
  },
  textarea: {
    label: 'Please enter your answer in textarea',
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  timepicker: {
    validation: {
      required: 'This field is required to be filled in.',
    },
  },
  mealTime: {
    text: 'Did you have {meal}? If so, when was this?',
    // description: 'Placeholder',
    yes: 'Around that time',
    no: 'I did not have {meal}',
    validation: {
      required: 'Please select time you had the meal.',
    },
  },
  portionOption: {
    validation: {
      required: 'Please select how the portion will be measured.',
    },
  },
  addMeal: {
    _: 'Add meal',
    text: 'Please enter the name of this meal',
    description:
      'You can either type your own name, or select one from the list below if it is appropriate.',
    label: 'Select predefined or enter meal name',
    yes: 'Add this meal',
    no: 'Cancel',
    hint: 'Hit enter when finished typing',
    noMeal: 'No Meals remaining, please add at least one',
  },
  editMeal: {
    text: 'Please list everything you had for your {meal}, one item per line.',
    description: `For example:<p><ul><li>banana</li><li>crisps</li><li>rice</li><li>tea</li></ul></p>
      <p>You can press Enter on your keyboard or the "add a food/drink" button to go to the next line as you type.</p>
      <p><strong>Do not</strong> enter how much you had, just the food names.`,
    food: 'Your food and drinks',
    drinks: 'Drinks',
    addFood: 'Add',
    addDrink: 'Add a drink',
    delete: {
      _: 'Delete {item}',
      confirm: 'Do you want to delete {item}?',
    },
    deleteFoodFromMeal: 'Delete {food}',
    editMeal: 'Edit {meal}',
    editTime: 'Change Time',
  },
  associatedFoods: {
    text: 'Did you have any of these with your {food}?',
    description: 'These foods are often consumed together.',
    yes: 'Yes, I had some',
    no: 'No, I did not',
    alreadyEntered: 'Yes, already entered',
    select: {
      different: 'Select a different food',
      item: 'Please select an item from this category',
    },
  },
  foodSearch: {
    text: 'Below is the list of foods from our database that look like "{food}".',
    description: 'Please choose the item you had, or the closest match.',
    empty: 'There is nothing in our database that matches "{searchTerm}".',
    reword: 'Please try re-wording your description.',
  },
  linkedQuantity: {
    all: 'On all of them',
  },
  noMoreInfo: {
    meal: {
      text: 'No more information needed',
      description: `<p>We have all the information that we need regarding your <strong>{item}</strong> at this time.</p>
        <p>To continue with the survey, click the "Continue" button below and we will automatically select the next food or meal that we still need some information about.</p>
        <p>Alternatively, click on a meal or food on the left if you would like to focus on a particular item.</p>`,
    },
    food: {
      text: 'No more information needed',
      description: `<p>We have all the information that we need about your <strong>{item}</strong> at this time.</p>
        <p>To continue with the survey, click "Continue" below and we will automatically select the next food or meal that we still need information about.</p>
        <p>Alternatively, click on a meal or food on the left if you would like to focus on a particular item.</p>`,
    },
  },
  readyMeal: {
    text: 'Was this a ready-made meal or food?',
    description:
      'Tick the box if any of these were a ready-made meal or food (e.g. ready to cook / eat / pre-packed).',
  },
  splitFood: {
    text: 'It looks like you entered more than one food item on the line.',
    searchTerm: 'Search term: {food}',
    split: 'Are these separate foods?',
    singleSuggestion:
      'Please click on "keep as single food" if you meant a single food such as chicken and vegetable soup.',
    singleSuggestionEx:
      'Please click on "keep as single food" if you meant a single food such as {food}.',
    separateSuggestion: 'Please click on "separate foods" for items such as fish and chips.',
    separateSuggestionEx: 'Please click on "separate foods" for items such as {food}.',
    separate: 'Separate foods',
    single: 'Keep as single food',
  },
};

export default prompts;
