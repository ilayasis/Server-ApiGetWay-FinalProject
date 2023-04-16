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

// const express = require("express");
// const { createProxyMiddleware } = require("http-proxy-middleware");
// const cors = require("cors");

// const app = express();
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// const options = {
//   target: "http://127.0.0.1:5000", // target host
//   changeOrigin: true, // needed for virtual hosted sites
//   pathRewrite: {
//     [`^/api`]: "",
//   },
// };

// const exampleProxy = createProxyMiddleware(options);

// // mount `exampleProxy` in web server
// app.use("/api", exampleProxy);
// app.listen(3005);

// const wsProxy = createProxyMiddleware({
//   target: "ws://localhost:8000/ws/stream/",
//   // pathRewrite: {
//   //   "^/investigation": "", // rewrite path.
//   // },
//   changeOrigin: true, // for vhosted sites, changes host header to match to target's host
//   ws: true, // enable websocket proxy
//   logger: console,
// });
// // {
//   proxy: {
//     target: "ws://localhost:8000/ws/stream/",
//     changeOrigin: true,
//     ws: true, // support WebSocket / Socket.io
//     onProxyReq: (proxyReq, req, res) => {
//       console.log("http request");
//       console.log("query: ", req.query);
//     },
//     onProxyReqWs: (proxyReq, req, socket, options, head) => {
//       console.log("websocket request");

//       // get the queries from the request url:
//     },
//   },
// },

// function start() {
//   app.use(cors());

//   app.get("/api", (request, response) => {
//     response.send(" -- Gateway server is working -- ");
//   });

//   // http proxy:
//   httpRoutes.forEach((route) => {
//     app.use(route.url, createProxyMiddleware(route.proxy)); // proxy - send the message foreward
//   });

//   // socket.io proxy:
//   // webSocketRoutes.forEach((route) => {
//   //   app.use(createProxyMiddleware("/socket.io", route.proxy)); // proxy - send the message foreward
//   // });

//   app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ message: "Proxy: something went wrong" });
//   });

//   app.listen(PORT, () => {
//     console.log(`listening in ${PORT}...`);
//   });
// }
