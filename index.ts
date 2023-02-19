import express, { Express } from 'express';
import dotenv from 'dotenv';
import router from './src/routes';
import cors from 'cors';
import morgan from 'morgan';
import * as path from 'path';
import errorMiddleWare from './src/middleware/errorMiddleWare';
import fileUpload from 'express-fileupload';

dotenv.config();

const port = process.env.PORT || 9000;
const app: Express = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.resolve(__dirname, 'src/static')));
app.use(fileUpload({}));
app.use(express.json());
app.use('/api', router);

app.use(errorMiddleWare);

app.listen(9000, () => {
  console.log(`Starting Server on Port ${port}`);
});
