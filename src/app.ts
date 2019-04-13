import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';

import { Index } from '../src/routes';
import { OrderRoute } from '../src/routes/order';
import * as errorHandler from '../src/utils/errorHandler';
import { APIRoute } from './routes/api';
import { UserRoute } from './routes/user';

class App {
  public app: express.Application;
  public indexRoutes: Index = new Index();
  public userRoutes: UserRoute = new UserRoute();
  public apiRoutes: APIRoute = new APIRoute();
  public orderRoutes: OrderRoute = new OrderRoute();
  public mongoUrl: string = 'mongodb://localhost/order-api';

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());

    this.indexRoutes.routes(this.app);
    this.userRoutes.routes(this.app);
    this.apiRoutes.routes(this.app);
    this.orderRoutes.routes(this.app);
    this.mongoSetup();

    this.app.use(errorHandler.logging);
    this.app.use(errorHandler.clientErrorHandler);
    this.app.use(errorHandler.errorHandler);
  }
  private mongoSetup(): void {
    mongoose
      .connect(this.mongoUrl, { useNewUrlParser: true, useCreateIndex: true })
      .then(() => console.log('connected to mongodDB'));
  }
}

export default new App().app;
