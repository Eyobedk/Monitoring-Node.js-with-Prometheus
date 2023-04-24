//database instance
const db = require('./database')
//server instance
const server = require('./server');
//Metrics Server
const {startMetricsServer} =require('./loggers/metrics');

module.exports = ()=>{
    //Sync Database
    db.sequelize.sync().then(() => {
        console.log("Synced db.");
     }).catch((err) => {
         console.log("Failed to sync db: " + err.message);
      });

    //Start Server
    server();

    //Start Metrics Server
    startMetricsServer();
}
