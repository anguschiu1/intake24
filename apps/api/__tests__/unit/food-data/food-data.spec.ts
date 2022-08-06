// This has to be done first because the database config is pulled indirectly by services, doing
// it during initDatabases is too late and moving helpers/databases import higher interferes with
// ESLint import ordering rules
import '../../bootstrap';

import getKcalTests from './get-kcal';
import helpersTests from './helpers';
import portionSizeMethodsServiceTests from './portion-size-methods-service';

describe('Food data service', () => {
  helpersTests();
  getKcalTests();
  portionSizeMethodsServiceTests();
});
