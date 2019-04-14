import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as expressWinston from 'express-winston';
import * as methodOverride from 'method-override';
import * as mongoose from 'mongoose';
import * as winston from 'winston';

import { Index } from '../src/routes';
import * as errorHandler from '../src/utils/errorHandler';
import { APIRoute } from './routes/api';
import { OrderRoute } from './routes/order';
import { UserRoute } from './routes/user';
import { OrderAPILogger } from './utils/logger';

class App {
  public app: express.Application;
  public indexRoutes: Index = new Index();
  public userRoutes: UserRoute = new UserRoute();
  public apiRoutes: APIRoute = new APIRoute();
  public orderRoutes: OrderRoute = new OrderRoute();

  public mongoUrl: string;
  public mongoUser: string;
  public mongoPass: string;

  constructor() {
    const path = `${__dirname}/../.env.${process.env.NODE_ENV}`;
    dotenv.config({ path: path });
    this.mongoUrl = `mongodb://${process.env.MONGODB_URL_PORT}/${
      process.env.MONGODB_DATABASE
    }`;
    this.mongoUser = `${process.env.MONGODB_USER}`;
    this.mongoPass = `${process.env.MONGODB_PASS}`;

    this.app = express();
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    this.app.use(bodyParser.json());
    this.app.use(methodOverride());

    this.indexRoutes.routes(this.app);
    this.userRoutes.routes(this.app);
    this.apiRoutes.routes(this.app);
    this.orderRoutes.routes(this.app);
    this.mongoSetup();

    // add a default error logger on the app level.
    this.app.use(
      expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
      })
    );

    this.app.use(errorHandler.logging);
    this.app.use(errorHandler.clientErrorHandler);
    this.app.use(errorHandler.errorHandler);
    this.app.use(errorHandler.notFound);
  }

  private mongoSetup(): void {
    let options: mongoose.ConnectionOptions;

    if (process.env.NODE_ENV !== 'prod') {
      options = {
        useNewUrlParser: true,
        useCreateIndex: true,
      };
    } else {
      options = {
        user: this.mongoUser,
        pass: this.mongoPass,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        autoIndex: false, // Don't build indexes
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        reconnectInterval: 500, // Reconnect every 500ms
        poolSize: 10, // Maintain up to 10 socket connections
        // If not connected, return errors immediately rather than waiting for reconnect
        bufferMaxEntries: 0,
        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      };
    }
    mongoose.connect(this.mongoUrl, options).then(
      () => {
        OrderAPILogger.logger.info(`Connected to MongoDB ${this.mongoUrl}`);
      },
      err => {
        OrderAPILogger.logger.error(
          `Failed to connect to ${this.mongoUrl}: ${err}`
        );
      }
    );
  }
}

export default new App().app;
