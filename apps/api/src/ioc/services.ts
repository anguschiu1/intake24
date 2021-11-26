import { asClass, asFunction, asValue, AwilixContainer } from 'awilix';
import {
  adminSurveyService,
  authenticationService,
  aclService,
  jwtService,
  jwtRotationService,
  signInService,
  dataExportFields,
  dataExportMapper,
  dataExportService,
  Cache,
  Filesystem,
  logger,
  Mailer,
  Pusher,
  Scheduler,
  Session,
  asServedService,
  guideImageService,
  imageMapService,
  processedImageService,
  sourceImageService,
  nutrientTableService,
  foodDataService,
  portionSizeService,
  surveyService,
  userService,
} from '@api/services';

import { JobsQueueHandler, TasksQueueHandler } from '@api/services/queues';

export default (container: AwilixContainer): void => {
  container.register({
    adminSurveyService: asFunction(adminSurveyService),
    authenticationService: asFunction(authenticationService),
    aclService: asFunction(aclService).scoped(),
    jwtService: asFunction(jwtService),
    jwtRotationService: asFunction(jwtRotationService),
    signInService: asFunction(signInService),

    asServedService: asFunction(asServedService),
    guideImageService: asFunction(guideImageService),
    imageMapService: asFunction(imageMapService),
    processedImageService: asFunction(processedImageService),
    sourceImageService: asFunction(sourceImageService),

    foodDataService: asFunction(foodDataService),
    nutrientTableService: asFunction(nutrientTableService),
    portionSizeService: asFunction(portionSizeService),
    surveyService: asFunction(surveyService),
    userService: asFunction(userService),

    dataExportFields: asFunction(dataExportFields),
    dataExportMapper: asFunction(dataExportMapper),
    dataExportService: asFunction(dataExportService),

    cache: asClass(Cache).singleton(),
    filesystem: asClass(Filesystem).singleton(),
    logger: asValue(logger),
    mailer: asClass(Mailer).singleton(),
    pusher: asClass(Pusher).singleton(),
    scheduler: asClass(Scheduler).singleton(),
    session: asClass(Session).singleton(),

    jobsQueueHandler: asClass(JobsQueueHandler).singleton(),
    tasksQueueHandler: asClass(TasksQueueHandler).singleton(),
  });
};
