import app from "./app";
import { initDB } from "./config/db";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await initDB();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();
