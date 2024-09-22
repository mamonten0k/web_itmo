import {Router} from 'express';

import {apiRouter} from './api_router.js';
import {indexRouter} from './index_router.js';


export const rootRouter = Router();

rootRouter.use('/api', apiRouter);
rootRouter.use('/', indexRouter);
