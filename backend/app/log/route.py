import logging
from typing import Any, Callable, TypeVar

from fastapi import Request, Response
from fastapi.routing import APIRoute

logger = logging.getLogger(__name__)

T = TypeVar("T")


class LoggedRoute(APIRoute):
    def get_route_handler(self) -> Callable[[Request], Any]:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            # Log request
            body = await request.body()
            if body:
                body_str = body.decode() if isinstance(body, bytes) else str(body)
                logger.info(f"Request body: {body_str}")
            else:
                logger.info("No request body")

            # Execute handler
            response: Response = await original_route_handler(request)

            # Log response
            logger.info(f"Response status: {response.status_code}")
            return response

        return custom_route_handler
