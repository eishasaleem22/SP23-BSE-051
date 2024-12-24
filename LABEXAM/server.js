// const express = require("express");
// const mongoose = require("mongoose");
// let server = express();
// var expressLayouts = require("express-ejs-layouts");
// server.use(express.static("public"));
// server.set("view engine", "ejs");

// let Product = require("./models/product.model");
// let User = require("./models/user.model");
// let cookieParser = require("cookie-parser");
// server.use(cookieParser());

// server.use(expressLayouts);
// server.use(express.json());
// server.use(express.urlencoded());

// let session = require("express-session");
// server.use(session({ secret: "my session secret", saveUninitialized: true }));

// let siteMiddleware = require("./middleware/site.middleware");
// let authMiddleware = require("./middleware/auth.middleware");
// let adminMiddleware = require("./middleware/admin.middleware");
// server.use(siteMiddleware);
// const cartController = require("./routes/cart.controller");

// server.post("/submit-order", authMiddleware, cartController.submitOrder);
// server.get("/admin/orders", adminMiddleware, cartController.getAdminOrders);

// server.get("/logout", async (req, res) => {
//   req.session.user = null;
//   return res.redirect("/");
// });

// server.get("/auth/login", async (req, res) => {
//   return res.render("auth/login");
// });

// server.post("/auth/login", async (req, res) => {
//   let data = req.body;
//   let user = await User.findOne({ email: data.email });

//   if (!user) return res.redirect("/auth/login");
//   const isValid = await user.comparePassword(data.password);

//   if (!isValid) return res.redirect("/auth/login");

//   req.session.user = user;
//   return res.redirect("/");
// });

// server.get("/auth/signup", async (req, res) => {
//   return res.render("auth/signup");
// });

// server.post("/auth/signup", async (req, res) => {
//   let data = req.body;
//   let user = await User.findOne({ email: data.email });

//   if (user) return res.redirect("/auth/signup");

//   user = new User(data);
//   await user.save();

//   return res.redirect("/auth/login");
// });

// let adminProductsRouter = require("./routes/products.controller");
// server.use(adminProductsRouter);
// let adminCreateRouter = require("./routes/create.controller");
// server.use(adminCreateRouter);
// let adminCategoryRouter = require("./routes/category.controller");
// server.use(adminCategoryRouter);

// server.get("/", (req, res) => {
//   res.send(res.render("index"));
// });

// let connectionString =
//   "mongodb+srv://kanz:kanz123@sp23-bse-082.varls.mongodb.net/";
// mongoose
//   .connect(connectionString, { useNewUrlParser: true })
//   .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
//   .catch((error) => console.log(error.message));

// server.listen(3000, () => {
//   console.log("Server started at http://localhost:3000");
// });



const express = require("express");
const mongoose = require("mongoose");
let server = express();
var expressLayouts = require("express-ejs-layouts");
server.use(express.static("public"));
server.set("view engine", "ejs");

let Product = require("./models/product.model");
let User = require("./models/user.model");
let cookieParser = require("cookie-parser");
server.use(cookieParser());

server.use(expressLayouts);
server.use(express.json());
server.use(express.urlencoded());

let session = require("express-session");
server.use(session({ secret: "my session secret", saveUninitialized: true }));

let siteMiddleware = require("./middleware/site.middleware");
let authMiddleware = require("./middleware/auth.middleware");
let adminMiddleware = require("./middleware/admin.middleware");
server.use(siteMiddleware);
const cartController = require("./routes/cart.controller");

server.post("/submit-order", authMiddleware, cartController.submitOrder);
server.get("/admin/orders", adminMiddleware, cartController.getAdminOrders);

server.get("/logout", async (req, res) => {
  req.session.user = null;
  return res.redirect("/");
});

server.get("/auth/login", async (req, res) => {
  return res.render("auth/login");
});

server.post("/auth/login", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });

  if (!user) return res.redirect("/auth/login");
  const isValid = await user.comparePassword(data.password);

  if (!isValid) return res.redirect("/auth/login");

  req.session.user = user;
  return res.redirect("/");
});

server.get("/auth/signup", async (req, res) => {
  return res.render("auth/signup");
});

server.post("/auth/signup", async (req, res) => {
  let data = req.body;
  let user = await User.findOne({ email: data.email });

  if (user) return res.redirect("/auth/signup");

  user = new User(data);
  await user.save();

  return res.redirect("/auth/login");
});

// Admin Routes
let adminProductsRouter = require("./routes/products.controller");
server.use(adminProductsRouter);
let adminCreateRouter = require("./routes/create.controller");
server.use(adminCreateRouter);
let adminCategoryRouter = require("./routes/category.controller");
server.use(adminCategoryRouter);






server.get("/", (req, res) => {
  res.send(res.render("index"));
});

// hjhsd




//jkjdak

let connectionString =
  "mongodb+srv://kanz:kanz123@sp23-bse-082.varls.mongodb.net/";
mongoose
  .connect(connectionString, { useNewUrlParser: true })
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));

  const wishRoutes = require("./routes/wishlist");
server.use("/wishlist",authMiddleware, wishRoutes);

server.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
