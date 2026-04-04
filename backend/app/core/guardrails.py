"""Input guardrails — regex-based jailbreak and injection detection."""

from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass
class ValidationResult:
    is_valid: bool
    reason: str | None = None


class GuardRails:
    JAILBREAK_PATTERNS = [
        r"ignore\s+(all\s+)?(previous|prior|above|earlier)",
        r"disregard\s+(all\s+|the\s+)?(previous|prior|above|earlier)",
        r"pretend\s+(you\s+are|to\s+be)",
        r"act\s+as\s+",
        r"you\s+are\s+now\s+",
        r"\bdan\b",
        r"developer\s+mode",
        r"bypass\s+(your|the)\s+(rules|instructions|restrictions|guidelines)",
    ]

    PROMPT_INJECTION_PATTERNS = [
        r"<\|system\|>",
        r"<\|user\|>",
        r"<\|assistant\|>",
        r"\[INST\]",
        r"\[/INST\]",
        r"###\s*(instruction|system|user)",
    ]

    def validate_input(self, text: str) -> ValidationResult:
        if not text or len(text.strip()) == 0:
            return ValidationResult(False, "Empty input")
        if self.detect_jailbreak(text):
            return ValidationResult(False, "Potentially harmful request detected")
        if self.detect_prompt_injection(text):
            return ValidationResult(False, "Invalid input format")
        return ValidationResult(True)

    def detect_jailbreak(self, text: str) -> bool:
        text_lower = text.lower()
        return any(re.search(p, text_lower) for p in self.JAILBREAK_PATTERNS)

    def detect_prompt_injection(self, text: str) -> bool:
        return any(
            re.search(p, text, re.IGNORECASE) for p in self.PROMPT_INJECTION_PATTERNS
        )
