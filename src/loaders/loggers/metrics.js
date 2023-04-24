const express  = require("express");
const client =require("prom-client");

const log =require("./logger");
const config = require('../../../config')

const app = express();

const restResponseTimeHistogram = new client.Histogram({
  name: "REST_ENDPOINT_RESPONSE_TIME_DURATION_seconds",
  help: "REST_API_response_time_measured_in_seconds",
  labelNames: ["method", "route", "status_code"],
});

const databaseResponseTimeHistogram = new client.Histogram({
  name: "DB_RESPONSE_TIME_DURATION_in_seconds",
  help: "Database_response_time_measured_in_seconds",
  labelNames: ["operation", "success"],
});


const startMetricsServer = function() {
  const collectDefaultMetrics = client.collectDefaultMetrics;

  collectDefaultMetrics();

  app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);

    return res.send(await client.register.metrics());
  });

  app.listen(config.metrics_port, () => {
    log.info(`Metrics server started at http://localhost:${config.metrics_port}`);
  });
}

module.exports = {restResponseTimeHistogram, databaseResponseTimeHistogram, startMetricsServer}