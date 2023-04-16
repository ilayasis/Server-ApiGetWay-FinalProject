const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

const { createProxyMiddleware } = require("http-proxy-middleware");

const httpRoutes = [
  {
    url: "/login",
    proxy: {
      target: "http://127.0.0.1:5000",
      changeOrigin: true,
      pathRewrite: {
        [`^/api`]: "",
      },
    },
  },
  {
    url: "/userdata",
    proxy: {
      target: "http://127.0.0.1:5000",
      changeOrigin: true,
      pathRewrite: {
        [`^/api`]: "",
      },
    },
  },
  {
    url: "/adduser",
    proxy: {
      target: "http://127.0.0.1:5000",
      changeOrigin: true,
      pathRewrite: {
        [`^/api`]: "",
      },
    },
  },
];

const webSocketRoutes = [
  {
    url: "/get_files",
    proxy: {
      target: "http://127.0.0.1:8000",
      changeOrigin: true, // if i understood correctly: http://localhost:3007 -> http://localhost3005
      ws: true, // support WebSocket
    },
  },
  {
    proxy: {
      target: "http://127.0.0.1:8000",
      changeOrigin: true, // if i understood correctly: http://localhost:3007 -> http://localhost3005
      ws: true, // support WebSocket
      onProxyReq: (proxyReq, req, res) => {
        console.log("http request");
        console.log("query: ", req.query);
      },
    },
  },
  {
    proxy: {
      url: "/load_video",
      target: "http://127.0.0.1:8000",
      changeOrigin: true, // if i understood correctly: http://localhost:3007 -> http://localhost3005
      ws: true, // support WebSocket
      onProxyReq: (proxyReq, req, res) => {
        const filename = req.query.filename;
        proxyReq.path = `/load_video?filename=${filename}`;
      },
    },
  },
];

httpRoutes.forEach((route) => {
  app.use("/api", createProxyMiddleware(route.proxy)); // proxy - send the message foreward
});

webSocketRoutes.forEach((route) => {
  app.use(createProxyMiddleware("/", route.proxy)); // proxy - send the message foreward
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Proxy: something went wrong" });
});

app.listen(3005);
