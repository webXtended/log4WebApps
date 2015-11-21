/*!
 * Log4WebApps v1.0
 *
 * Copyright 2015, Himanshu Tanwar
 * Released under the MIT license
 * https://github.com/webXtended/log4WebApps
 * Date: 2015-11-21
 */

(function () {
    "use strict";
    var log4WebApp = {}, logLevels = {}, logs = {}, logFunctions;
    defineLogLevels();
    window.log4WebApp = log4WebApp;

    function Log4WebApp(logName, options) {
        var logs = [], oldLogLevel, currentLogLevel, logStyle;

        logName = logName || "WebAppLog_" + new Date().getTime();
        currentLogLevel = options.level && options.level > 0 && options.level < 6 ? options.level : 1;

        /**
         * Saves the log object in memory and the localStorage if available
         * @param obj the log container which will be saved
         */
        function saveLog(obj) {
            logs.push(obj);
        }

        /**
         * This method return the JSON array stored in the localStorage
         * @returns {*} : Returns a string containing the JSON array of logs
         */
        function getStoredLog() {
            var savedLog;
            if (window.localStorage && window.localStorage.getItem) {
                savedLog = window.localStorage.getItem(logName);
            } else {
                savedLog = JSON.stringify(logs);
            }
            return savedLog ? savedLog : "[]";
        }

        /**
         * This method takes a log object and returns a hyphen(-) separated string of its properties
         * @param obj : The log object
         * @returns {string} : The string containing the date, type, and message properties of the log
         */
        function getLogEntryString(obj) {
            var log = [];
            log.push(obj.date.toLocaleString());
            log.push(logLevels.name[obj.type]);
            log.push(obj.msg);
            return log.join(" - ");
        }

        /**
         * This method takes a log object and prints it in the browser's console.
         * Style is added according to the log type
         * @param obj : the log object to be printed.
         */
        function printLogObj(obj) {
            var css = [];
            switch (obj.type) {
                case logLevels.ERROR:
                    css.push("color:#E02200");
                    break;

                case logLevels.WARNING:
                    css.push("color:#EAC806");
                    break;

                case logLevels.INFO:
                    css.push("color:#159F33");
                    break;

                case logLevels.DEBUG:
                    css.push("color:#15489F");
                    break;
                case logLevels.TRACE:
                    css.push("color:#620DC2");
                    break;

                default :
                    css.push("color:#00000");
                    break;
            }
            css.push("font-size:15px");
            css.push("background-color:#000");
            css.push("padding:5px");
            window.console.log("%c" + getLogEntryString(obj), css.join(";"));
        }

        /**
         * This method adds new log to the storage.
         * @param msg : the message to be written in the log
         * @param type : the type of log.
         */
        function addLog(msg, type) {
            var logContainer = getLogContainer();
            logContainer.msg = msg;
            logContainer.type = type;
            saveLog(logContainer);
        }

        /**
         * This message is used to adding an error log. The log will onl be added if the level is grated than 0
         * @param msg : the message to be written in the log.
         */
        this.addErrorLog = function (msg) {
            if (currentLogLevel >= logLevels.ERROR) {
                addLog(msg, logLevels.ERROR);
            }
        };

        /**
         * This message is used to adding a warning log. The log will onl be added if the level is grated than 1
         * @param msg : the message to be written in the log.
         */
        this.addWarningLog = function (msg) {
            if (currentLogLevel >= logLevels.WARNING) {
                addLog(msg, logLevels.WARNING);
            }
        };

        /**
         * This message is used to adding an info log. The log will onl be added if the level is grated than 2
         * @param msg : the message to be written in the log.
         */
        this.addInfoLog = function (msg) {
            if (currentLogLevel >= logLevels.INFO) {
                addLog(msg, logLevels.INFO);
            }
        };

        /**
         * This message is used to adding a debug log. The log will onl be added if the level is grated than 3
         * @param msg : the message to be written in the log.
         */
        this.addDebugLog = function (msg) {
            if (currentLogLevel >= logLevels.DEBUG) {
                addLog(msg, logLevels.DEBUG);
            }
        };

        this.addTraceLog = function (msg) {
            if (currentLogLevel >= logLevels.TRACE) {
                addLog(msg, logLevels.TRACE);
            }
        };

        this.printLogs = function () {
            var i;
            window.console.log("%cPrinting logs for - " + logName, "font-size:20px");
            for (i = 0; i < logs.length; i++) {
                printLogObj(logs[i]);
            }
        };

        this.getLogsAsString = function () {
            var i, logArr = [];
            for (i = 0; i < logs.length; i++) {
                logArr.push(getLogEntryString(logs[i]));
            }
            return logArr.join("\n");
        };

        this.clearLogs = function () {
            logs = [];
            if (window.localStorage && window.localStorage.removeItem) {
                window.localStorage.removeItem(logName);
            }
        };

        this.setLogLevel = function (logLevel) {
            if (logLevel > 0 && logLevel < 6) {
                oldLogLevel = currentLogLevel;
                currentLogLevel = logLevel;
                return true;
            } else {
                return false;
            }
        };

        this.stopLogging = function () {
            if (oldLogLevel === 0) {
                return;
            }
            oldLogLevel = currentLogLevel;
            currentLogLevel = 0;
        };

        this.startLogging = function (logLevel) {
            if (logLevel && logLevel > 0 && logLevel < 6) {
                currentLogLevel = logLevel;
            } else {
                currentLogLevel = oldLogLevel;
            }
        };

        this.saveToLocalStorage = function () {
            if (window.localStorage && window.localStorage.setItem) {
                window.localStorage.setItem(logName, JSON.stringify(logs));
                return true;
            } else {
                return false;
            }
        };
    }


    /**
     * Initialises a web logger instance.
     * @param logName the name of the logger instance
     * @param options initialization values for the logger
     * @returns {*} a new logger instance
     */
    function initWebLogger(logName, options) {
        if (logs[logName]) {
            if (options.override && options.override === true) {
                getLogger(logName).clearLogs();
                removeLogger(logName);
                return createLogger();
            } else {
                throw Error("A logger by this name already exists");
            }
        } else {
            return createLogger();
        }

        function createLogger() {
            logs[logName] = new Log4WebApp(logName, options);
            return logs[logName];
        }
    }

    /**
     * Remove a logger instance
     * @param logName of the logger to be removed
     */
    function removeLogger(logName) {
        if (logs[logName]) {
            logs[logName] = undefined;
        }
    }

    function getLogger(logName) {
        return logs[logName];
    }

    /**
     * Create an empty object for storing a new log
     * @returns {{}} the created object with current date and time
     */
    function getLogContainer() {
        var logContainer = {};
        logContainer.date = new Date();
        return logContainer;
    }

    /**
     * Set the constants for log levels
     */
    function defineLogLevels() {
        logLevels = {};
        logLevels.ERROR = 1;
        logLevels.WARNING = 2;
        logLevels.INFO = 3;
        logLevels.DEBUG = 4;
        logLevels.TRACE = 5;

        logLevels.name = {};
        logLevels.name[logLevels.ERROR] = "ERROR";
        logLevels.name[logLevels.WARNING] = "WARNING";
        logLevels.name[logLevels.INFO] = "INFO";
        logLevels.name[logLevels.DEBUG] = "DEBUG";
        logLevels.name[logLevels.TRACE] = "TRACE";
    }

    log4WebApp.createLogger = function (logName, options) {
        return initWebLogger(logName, options ? options : {});
    };

    log4WebApp.getLogger = function (logName) {
        return getLogger(logName);
    };

    log4WebApp.removeLogger = function (logName) {
        return removeLogger(logName);
    };

})();
