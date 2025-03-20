from typing import Callable
import logging
from fastapi import Request, Response
from fastapi.routing import APIRoute
import json

logger = logging.getLogger(__name__)

class LoggedRoute(APIRoute):
    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def route_handler(request: Request) -> Response:
            # Request logging
            body = await request.body()
            try:
                body_str = body.decode()
            except UnicodeDecodeError:
                body_str = "<binary>"

            logger.info(
                f"Request: {request.method} {request.url}\n"
                f"Headers: {dict(request.headers)}\n"
                f"Body: {body_str}"
            )

            response = await original_route_handler(request)

            # Response logging
            try:
                body = json.loads(response.body.decode())
            except:
                body = "<non-JSON response>"

            logger.info(
                f"Response: {response.status_code}\n"
                f"Headers: {dict(response.headers)}\n"
                f"Body: {body}"
            )

            return response

        return route_handler