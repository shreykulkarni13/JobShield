"""Explainable rule-based recruitment risk signals for the prototype."""

import re
from urllib.parse import urlparse


RULES = [
    ("payment", "Upfront payment", "Legitimate employers do not charge candidates to apply, interview, or receive an offer.", 34,
     r"\b(application|registration|processing|training|equipment|background check|security)\s+(fee|charge|payment)\b|\b(pay|wire|send|transfer)\s+(us\s+)?(a\s+)?(fee|money|deposit)\b|\b(crypto|bitcoin|gift card)\s+(payment|transfer)\b"),
    ("sensitive_data", "Sensitive information requested early", "Do not share bank details, identity documents, or tax numbers before independently verifying an employer and receiving a formal offer.", 30,
     r"\b(bank account|routing number|social security number|social security|passport number|national id|tax id|credit card)\b"),
    ("unrealistic_pay", "Unusually high pay promise", "Very high pay for little experience or unusually little work can be used to make an offer feel irresistible.", 19,
     r"\b(earn|make|salary|pay|income)\s+(up to\s+)?\$\s?\d{3,}(?:,\d{3})?\s*(per|/)?\s*(hour|hr)\b|\b\$\s?\d{4,}\s*(per|/)\s*(day|week)\b|\b(no experience|no experience needed).{0,50}\$\s?\d{2,}\s*(per|/)\s*(hour|hr)\b"),
    ("urgency", "Pressure to act immediately", "Scammers often use deadlines or threats to prevent candidates from checking the details.", 14,
     r"\b(within (the )?next hour|act now|immediate(ly)?|limited slots|today only|urgent(ly)?|don't miss out|do not miss out|respond immediately)\b"),
    ("off_platform", "Conversation moved to an informal channel", "Verify the recruiter through the company’s official careers site before continuing on a messaging app.", 14,
     r"\b(telegram|whatsapp|signal|text me|message me on|dm me|direct message)\b"),
    ("personal_email", "Personal email used for recruiting", "Check that the sender’s email domain matches the company’s official website.", 14,
     r"\b[a-z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|protonmail)\.(com|net|org)\b"),
    ("check_deposit", "Check deposit or money transfer mentioned", "Never deposit a check and send part of the funds elsewhere; the check may later be reversed.", 38,
     r"\b(deposit|cash|mobile deposit).{0,45}\b(check|cheque)\b|\b(check|cheque).{0,45}\b(send|forward|transfer|return)\b"),
    ("vague_company", "Company identity is unclear", "Look up the company independently and contact it using details published on its official website.", 12,
     r"\b(our (trusted )?company|confidential employer|undisclosed client|company name (will|shall) be (provided|revealed) later)\b"),
]

URL_RE = re.compile(r"(?:https?://|www\.)\S+", re.I)


def analyze_text(text: str) -> dict:
    normalized = re.sub(r"\s+", " ", text).strip()
    findings = []
    seen = set()
    for key, title, explanation, weight, pattern in RULES:
        if re.search(pattern, normalized, re.I | re.S):
            findings.append({"id": key, "title": title, "detail": explanation, "severity": "high" if weight >= 30 else "medium"})
            seen.add(key)

    urls = URL_RE.findall(normalized)
    suspicious_tlds = (".top", ".xyz", ".click", ".work", ".tk", ".buzz")
    for raw_url in urls:
        candidate = raw_url.rstrip(".,);]")
        host = urlparse(candidate if "://" in candidate else f"https://{candidate}").hostname or ""
        if host.lower().endswith(suspicious_tlds) and "suspicious_link" not in seen:
            findings.append({"id": "suspicious_link", "title": "Link uses a higher-risk domain ending", "detail": "Avoid entering personal details through a link in a message. Open the company’s official website yourself and find the role there.", "severity": "medium"})
            seen.add("suspicious_link")
            break

    if not re.search(r"\b(job title|position|role|responsibilit|experience|qualification|requirements)\b", normalized, re.I) and len(normalized) < 500:
        findings.append({"id": "limited_context", "title": "Little verifiable role information", "detail": "The message contains few details about the role. Ask for a formal job description and verify the opening on the company’s careers page.", "severity": "low"})

    score = min(99, sum(next(rule[3] for rule in RULES if rule[0] == item["id"]) if item["id"] in {r[0] for r in RULES} else 11 for item in findings))
    if score >= 60:
        category = "high_risk"
    elif score >= 25:
        category = "suspicious"
    else:
        category = "low_risk"

    tips = ["Verify the opening on the company’s official careers page.", "Contact the employer using a phone number or email from its official website."]
    if "payment" in seen or "check_deposit" in seen:
        tips.insert(0, "Do not pay, deposit a check, or transfer money as part of a hiring process.")
    if "sensitive_data" in seen:
        tips.insert(0, "Do not send identity or banking details until you have independently verified the employer and offer.")

    return {
        "score": score,
        "category": category,
        "label": {"high_risk": "High risk", "suspicious": "Suspicious", "low_risk": "Lower risk"}[category],
        "summary": {"high_risk": "Several strong warning signs are present. Pause and verify before responding.", "suspicious": "Some details deserve a closer look before you proceed.", "low_risk": "Few common warning signs were found. This does not confirm that the opportunity is legitimate."}[category],
        "indicators": findings,
        "guidance": tips,
        "signals_checked": ["Payment requests", "Sensitive data", "Compensation claims", "Urgency and pressure", "Contact channels", "Links and company details"],
        "model_note": "Prototype assessment based on transparent text rules. It is not a trained or validated classifier and cannot verify an employer’s identity.",
    }
