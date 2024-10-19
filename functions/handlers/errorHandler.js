
const errorHandler = () => {
    process.on('unhandledRejection', (reason, p) => {
        console.log(' [AntiCrash] :: Unhandled Rejection/Catch');
        console.log(reason)

    });

    process.on('uncaughtException', (err, origin) => {
        console.log(' [AntiCrash] :: Uncaught Exception/Catch'.bgYellow);
        console.log(err)
    });

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log(' [AntiCrash] :: Uncaught Exception/Catch (MONITOR)'.bgYellow);
        console.log(err)
    });
    process.on("multipleResolves", (type, promise, reason) => {
      //  console.log(" [AntiCrash] :: Debug Out put Data".bgGreen);
      //  console.log(type, promise, reason);

    });
};

module.exports = errorHandler;