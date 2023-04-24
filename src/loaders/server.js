//Modules
const responseTime =require("response-time");
const express = require("express");
const app = express();

//Locals
const config = require("../../config")
const { restResponseTimeHistogram } =require("./loggers/metrics");

module.exports = ()=>{
    // parse requests of content-type - application/json
  app.use(express.json());

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));

  app.use(
    responseTime((req, res, time) => {
        restResponseTimeHistogram.observe(
          {
            method: req.method,
            route: req.url,
            status_code: res.statusCode,
          },
          time * 1000
        );
    })
  );

  // // drop the table if it already exists
  // db.sequelize.sync({ force: true }).then(() => {
  //   console.log("Drop and re-sync db.");
  // });

  // simple route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to monitoring and logging demo application." });
  });

  //Inject express instance to routes
  require("../routes/turorial.routes")(app);

  // set port, listen for requests
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}.`);
  });

}