import {Router} from 'express';

import {indexController} from '../controllers/index_controller.js';


export const indexRouter = Router();

indexRouter.get('*', indexController);
