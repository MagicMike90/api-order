import * as fs from 'fs';
import * as https from 'https';

import app from './app';

const httpsOptions = {
  key: fs.readFileSync('./config/key.pem'),
  cert: fs.readFileSync('./config/cert.pem'),
};
const PORT = process.env.PORT || 8080;

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server is running in https://localhost:${PORT}`);
});
