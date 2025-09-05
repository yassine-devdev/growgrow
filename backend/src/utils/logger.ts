interface LogData {
  timestamp: string;
  level: "INFO" | "ERROR";
  message: string;
  meta?: Record<string, unknown>;
}

const safeSerialize = (obj: unknown): string => {
  try {
    return JSON.stringify(obj);
  } catch (_e) {
    const seen = new WeakSet<object>();
    return JSON.stringify(obj, function (_key, val) {
      if (val && typeof val === "object") {
        if (seen.has(val as object)) return "[Circular]";
        seen.add(val as object);
      }
      if (typeof val === "bigint") return (val as bigint).toString();
      return val;
    });
  }
};

const log = (
  level: "INFO" | "ERROR",
  message: string,
  meta: Record<string, unknown> = {}
) => {
  const logObject: LogData = {
    timestamp: new Date().toISOString(),
    level,
    message,
    meta,
  };
  const output = safeSerialize(logObject);
  if (level === "ERROR") {
    // In production you'd forward this to a log service
    console.error(output);
  } else {
    console.log(output);
  }
};

const logger = {
  info: (message: string, meta: Record<string, unknown> = {}) => {
    log("INFO", message, meta);
  },
  error: (message: string, meta: Record<string, unknown> = {}) => {
    log("ERROR", message, meta);
  },
};

export default logger;
