require('dotenv').config();
require('express-async-errors');

import express from 'express';
import path from 'path';
const app = express();

// //custom middleware
import notFoundMiddleware from './middleware/not-found';
import errorHandlerMiddleware from './middleware/error-handler';

//router
import authRouter from './routers/authRoutes';
import userRouter from './routers/userRoutes';
import productRouter from './routers/productRoutes';

// //db
import connectDB from './db/connect';

// //packages
import rateLimiter from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
// //cors
const cors = require('cors');
const corsOptions = {
  origin: true,
  credentials: true,
};
const mongoSanitize = require('express-mongo-sanitize');

// //middleware
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors(corsOptions));
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(express.static('./public'));
app.use(express.static(path.join(__dirname, '/client/build')));

//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);

//not found
app.use(notFoundMiddleware);
//error handler
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.DB_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
