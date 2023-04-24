const logger =require("pino");
const dayjs =require("dayjs");


const log = logger({
  base: undefined,
  timestamp: () => `,"time":"${dayjs().format()}"`,
});
module.exports = log;