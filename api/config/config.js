import dotenv from "dotenv";

dotenv.config();

const dev = {
  app: {
    port: process.env.PORT || 3001,
  },
  db: {
    url: process.env.MONGO || "mongodb://localhost:27017",
  },
};

export default dev;
