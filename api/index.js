import app from "./app.js";
import config from "./config/config.js";
import connectDB from "./config/db.js";

const port = config.app.port;

app.listen(port, () => {
  console.log(`app is running at http://localhost:${port}`);
  connectDB();
});
