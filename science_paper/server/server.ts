import express from 'express';
import {engine as handlebars} from 'express-handlebars';

import {rootRouter} from './routers/root_router';


const main = async () => {
    const server = express();
    const port = 3000;

    server.engine('html', handlebars({defaultLayout: false, extname: 'html'}));

    server.set('view engine', 'html');
    server.set('views', `dist/views`);

    server.use(express.static('dist'));

    server.use(rootRouter);

    server.listen(port, () => {
        console.log(`Server is running on: http://localhost:${port}`);
    });
}

main();
