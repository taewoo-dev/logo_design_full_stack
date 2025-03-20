import logging.config
from typing import Any

from app.core.configs import settings

LOG_CONFIG: dict[str, Any] = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "normal": {
            "format": "%(asctime)s %(levelname)s [%(name)s:%(funcName)s] %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "file": {
            "level": "INFO",
            "class": "logging.handlers.TimedRotatingFileHandler",
            "when": "midnight",
            "interval": 1,
            "filename": str(settings.LOG_PATH),
            "formatter": "normal",
            "encoding": "utf-8",
        },
        "console": {
            "level": "DEBUG" if settings.ENV == "local" else "INFO",
            "class": "logging.StreamHandler",
            "formatter": "normal",
        },
    },
    "loggers": {
        "": {  # Root logger
            "handlers": ["console", "file"],
            "level": "DEBUG" if settings.ENV == "local" else "INFO",
            "propagate": False,
        },
        "app": {  # Application logger
            "handlers": ["console", "file"],
            "level": "DEBUG" if settings.ENV == "local" else "INFO",
            "propagate": False,
        },
        "sqlalchemy.engine": {  # SQL logger
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": False,
        },
    },
}


def initialize_log() -> None:
    logging.config.dictConfig(LOG_CONFIG)
