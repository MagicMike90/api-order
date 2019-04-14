import * as fs from 'fs';
import * as https from 'https';

import app from './app';

const PORT = process.env.PORT || 8080;
if (process.env.NODE_ENV !== 'prod') {
  const httpsOptions = {
    key: fs.readFileSync('./config/key.pem'),
    cert: fs.readFileSync('./config/cert.pem'),
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Server is running in https://localhost:${PORT}`);
  });
} else {
  app.listen(PORT);
}
