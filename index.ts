import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './src/routes';
import cors from 'cors';
import path from 'path';
import errorMiddleWare from './src/middleware/errorMiddleWare';

dotenv.config();

const port = process.env.PORT || 9000;
const app: Express = express();

app.use(cors());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(express.json());
app.use('/api', router);

app.use(errorMiddleWare);

app.listen(9000, () => {
  console.log(`Starting Server on Port ${port}`);
});
