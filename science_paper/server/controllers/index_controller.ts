import {Request, Response} from 'express';


export const indexController = (_req: Request, res: Response): void => {
    res.render('index', {data: null, url: null});
};
