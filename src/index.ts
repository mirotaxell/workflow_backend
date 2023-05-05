import app from './app';
import mongoConnect from './utils/databaseConnection';

const port = process.env.PORT || 8080;
(async () => {
  try {
    await mongoConnect();
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  } catch (error) {
    console.log('Server error', (error as Error).message);
  }
})();
