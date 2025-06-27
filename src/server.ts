import app from "./app";
import logger from "./utils/logger";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});