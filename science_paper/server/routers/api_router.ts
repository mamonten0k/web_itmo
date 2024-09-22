import bodyParser from 'body-parser';
import {Router} from 'express';

import {webVitalsController} from '../controllers/web_vitals_controller';


export const apiRouter = Router();

apiRouter.use(bodyParser.json());

apiRouter.post('/web-vitals', webVitalsController);
