const express = require("express");
const winston = require("winston");
require("winston-daily-rotate-file");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) =>
      `[${info.timestamp} ${info.timestamp}] : ${info.level} - ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.DailyRotateFile({
    filename: "logs/error.log",
    datePattern: "DD-MM-YYYY",
    level: "error",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "3d",
  }),
  new winston.transports.DailyRotateFile({
    filename: "logs/request.log",
    datePattern: "DD-MM-YYYY",
    level: "http",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "2d",
  }),
];

// transport.on("rotate", function (oldFilename, newFilename) {
//   // do something fun
// });

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports = Logger;
