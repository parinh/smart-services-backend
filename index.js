const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").createServer(app);
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require('path');
const { jwtRouter } = require('./src/routes/jwt.route');
var serveIndex = require('serve-index')

//path imports
const { expressjwt } = require("express-jwt")
const usersRouter = require("./src/routes/users.route");
const salesOrderRouter = require("./src/routes/salesOrder.route");
const addressOptionRouter = require("./src/routes/addressOption.route");
const jobTypeOptionsRouter = require("./src/routes/jobTypeOptions.route")
const customerRouter = require("./src/routes/customer.route");
const mappingArea = require("./src/routes/mappingArea.route")
const branchesRouter = require("./src/routes/branches.route")
const truckOrdersRouter = require("./src/routes/truckOrders.route")
const memberOptionsRouter = require("./src/routes/memberOptions.route")
const checkListsRouter = require("./src/routes/checkLists.route")
const ordersCostRouter = require("./src/routes/ordersCost.route")
const fuelPercent = require("./src/routes/fuelPercent.route")

const tokenRouter = require("./src/routes/jwt.route")

const jwt_secret = 'sMartSERviCe-MVRBS'

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//asdasdasdas
app.use(expressjwt({ secret: jwt_secret, algorithms: ['HS256'] })
    .unless( //* This allows access to /token/sign without token authentication
        {
            path: [
                '/token/sign',
                '/token/verify',
                '/token/decode',
                '/users/auth',
                '/sales-order/get',
                '/sales-order/test',
                '/sales-order/search',   
                '/address/options/get',
                '/address/options/province/detail/get/:province',
                '/branches/test',
                /\/public/i,
                                                    
               
            ]
        }
    ));
 // '/users/gen/password',

//paths
app.use("/users", usersRouter.router);
app.use("/sales-order",salesOrderRouter.router);
app.use("/address/options",addressOptionRouter.router);
app.use("/customer",customerRouter.router);
app.use("/mapping-area",mappingArea.router);
app.use("/job-type-options",jobTypeOptionsRouter.router);
app.use("/branches", branchesRouter.router)
app.use("/truck-orders", truckOrdersRouter.router)
app.use("/member-options", memberOptionsRouter.router)
app.use("/check-lists", checkListsRouter.router)
app.use("/orders-cost", ordersCostRouter.router)
app.use("/fuel-percent", fuelPercent.router)

app.use("/token", jwtRouter);
app.use("/public",express.static("public"))
app.use("/public",serveIndex("public"))

app.get("/", (req, res) => {
  res.send("Welcome to Smart Services API");
});



const port = process.env.PORT || 7070;

http.listen(port, () => {
  
  console.log(`listening to port ${port}`);
});

