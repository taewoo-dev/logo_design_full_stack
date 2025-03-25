from enum import Enum

class PortfolioCategory(str, Enum):
    LOGO = "LOGO"
    BRANDING = "BRANDING"
    PACKAGING = "PACKAGING"
    ILLUSTRATION = "ILLUSTRATION"
    OTHER = "OTHER"


class PortfolioVisibility(str, Enum):
    PUBLIC = "PUBLIC"
    PRIVATE = "PRIVATE" 