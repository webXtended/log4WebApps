# log4WebApps
This project is built for creating a on browser logging mechanism.

### Getting Started
---
###### 1. Create a logger instance
#
```javascript
log4WebApp.createLogger("LOG_NAME",{options})
```    
  * LOG_NAME : any string for gving your log a name
  * {options} : javascript options for the following
    * level - any number from 1 to 5 to provide the log level
     * override - true/false, to override any existing logger with same name,
    
Example : 
```javascript
 var logger = log4WebApp.createLogger("testLogger",{level :4,override :false;});
```
#
###### 2. Adding logs

Five kind of logs can be added corresponding to each log level, namely
* error 
* warning
* info
* debug
* trace

to add a log use the add method suffixed with log type and log at the end

example : 
#
```javascript
logger.addErrorLog("LOG MESSAGE HERE");
logger.addWarningLog("LOG MESSAGE HERE");
logger.addInfoLog("LOG MESSAGE HERE");
logger.addDebugLog("LOG MESSAGE HERE");
logger.addTraceLog("LOG MESSAGE HERE");
```
#
###### 3. Viewing logs

to view logs on the console use the following method
```javascript  
  logger.printLogs();
```
to get the logs as a string use the following method
  logger.getLogsAsString();

###### 4. Removing logs

To clear out logs from a logger instance use the following method
```javascript
  logger.clearLogs();
```
To remove the logger instance use the following method
```javascript
log4WebApp.removeLogger("LOG_NAME");
```
