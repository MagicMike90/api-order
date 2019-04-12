import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';

import { Index } from '../src/routes';
import { OrderRoute } from '../src/routes/order';
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
  }

  private async mongoSetup(): Promise<void> {
    try {
      await mongoose.connect(
        this.mongoUrl,
        { useNewUrlParser: true }
      );

      console.log(`connected to ${this.mongoUrl}`);
    } catch (err) {
      console.log(`cannot connect to mongo`);
    }
  }
}

export default new App().app;
