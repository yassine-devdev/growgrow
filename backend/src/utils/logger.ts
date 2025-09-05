interface LogData {
  timestamp: string;
  level: "INFO" | "ERROR";
  message: string;
  [key: string]: any;
}

const log = (
  level: "INFO" | "ERROR",
  message: string,
  meta: Record<string, any> = {}
) => {
  const logObject: LogData = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  const output = JSON.stringify(logObject);
  if (level === "ERROR") {
    console.error(output);
  } else {
    console.log(output);
  }
};

const logger = {
  info: (message: string, meta?: object) => {
    log("INFO", message, meta);
  },
  error: (message: string, meta?: object) => {
    log("ERROR", message, meta);
  },
};

export default logger;
