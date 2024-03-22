const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const YAML = require('yamljs');
const PORT = process.env.PORT || 5000;
app.use(cors());


const usermangementServiceProxy = createProxyMiddleware({
  target: "http://localhost:3000",
  changeOrigin: true,
});
const incidentReportingServiceProxy = createProxyMiddleware({
  target: "http://localhost:3001",
  changeOrigin: true,
});
const FeedbackServiceProxy = createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
  });

app.use("/auth", usermangementServiceProxy);
app.use("", incidentReportingServiceProxy);
app.use("", FeedbackServiceProxy);


app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
