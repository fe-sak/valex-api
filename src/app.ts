import express, { json } from 'express';
import 'dotenv/config';
import cors from 'cors';
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandlerMiddleware.js';

const app = express();

app.use(cors());
app.use(json());

app.use(router);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}...`);
});
