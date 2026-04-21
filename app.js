import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { connectDatabase } from "./src/config/database.js";
import { homeRouter } from "./src/routes/homeRoutes.js";
import { authRouter } from "./src/routes/authRoutes.js";
import { orderRouter } from "./src/routes/orderRoutes.js";

loadEnvFile();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.pageTitle = "VeloCity Store";
  next();
});

app.use("/", homeRouter);
app.use("/register", authRouter);
app.use("/orders", orderRouter);

app.use((error, req, res, next) => {
  const products = [];

  res.status(500).render("index", {
    errors: [error.message || "Сталася непередбачена помилка."],
    successMessage: null,
    orderMessage: null,
    formData: {},
    orderFormData: {},
    products,
    registrations: [],
    orders: []
  });
});

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Bicycle store started on http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });

function loadEnvFile() {
  const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const fileContent = fs.readFileSync(envPath, "utf-8");
  const lines = fileContent.split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^"(.*)"$/, "$1");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}
