import httpsServer from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: `./config.env` });

const PORT = process.env.PORT || 3001;
mongoose
  .set('autoIndex', false)
  .connect(process.env.MONG_URL)
  .then(async () => {
    httpsServer.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} DNC`));
