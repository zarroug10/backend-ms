const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
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

  const TeamDispatchServiceProxy = createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
  });

  const MessageServiceProxy = createProxyMiddleware({
    target: "http://localhost:3004",
    changeOrigin: true,
  });

app.use("/auth", usermangementServiceProxy);
app.use("", incidentReportingServiceProxy);
app.use("", FeedbackServiceProxy);
app.use("/auth", TeamDispatchServiceProxy);
app.use("/messages", MessageServiceProxy);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
