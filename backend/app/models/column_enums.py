from enum import Enum


class ColumnStatus(str, Enum):
    DRAFT = "DRAFT"  # 초안
    PUBLISHED = "PUBLISHED"  # 발행
    ARCHIVED = "ARCHIVED"  # 보관 , 비활성화
