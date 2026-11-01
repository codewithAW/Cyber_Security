import type { Chapter } from '../types';

export const chapter08: Chapter = {
  "id": "chapter-08",
  "number": 8,
  "romanNumeral": "VIII",
  "title": "Planning and Security Policy",
  "subtitle": "Governance Frameworks, Security Policies, and Quantitative Risk Modeling",
  "category": "Governance & Management",
  "readTime": "6 min read",
  "summary": "Explores administrative security planning, organizational security policies, and the fundamental risk equation linking threats, vulnerabilities, and controls.",
  "introParagraphs": [
    "Security Planning is the process of deciding how an organization will protect its systems, networks, and information.",
    "Technology tools such as firewalls and encryption are ineffective without structured management planning and formalized security policies that govern organizational behavior and incident response."
  ],
  "topics": [
    {
      "id": "topic-8-1",
      "number": "8.1",
      "title": "Introduction to Security Planning",
      "content": [
        "Security Planning is the process of deciding how an organization will protect its systems, networks, and information.",
        "Security Planning \u2192 Decides how to protect an organization.",
        "It systematically identifies assets, assesses threat likelihood, evaluates vulnerabilities, and determines the most cost-effective defensive controls."
      ],
      "definitions": [
        {
          "term": "Security Planning",
          "definition": "The systematic organizational process of identifying critical assets, assessing threats, evaluating risks, and deploying protective controls.",
          "keyTakeaway": "Security Planning \u2192 Decides how to protect an organization."
        }
      ],
      "examples": [
        {
          "title": "Four Elements of Security Planning",
          "scenario": "The foundational components analyzed during planning:",
          "breakdown": [
            {
              "label": "Assets",
              "detail": "Cataloging hardware, customer data, intellectual property, and critical services."
            },
            {
              "label": "Threats",
              "detail": "Identifying adversarial actors, natural disasters, hardware failures, and human error."
            },
            {
              "label": "Risks",
              "detail": "Calculating the probability and financial/operational impact of potential failures."
            },
            {
              "label": "Security Controls",
              "detail": "Selecting administrative policies, physical barriers, and technical safeguards."
            }
          ]
        }
      ]
    },
    {
      "id": "topic-8-2",
      "number": "8.2",
      "title": "Security Policy",
      "content": [
        "A Security Policy is a formalized set of rules that defines how an organization protects, manages, and uses its information systems.",
        "It establishes behavioral standards for employees and technical baselines for engineers.",
        "Security Policy \u2192 Defines security rules for an organization."
      ],
      "definitions": [
        {
          "term": "Security Policy",
          "definition": "A formal document outlining rules, responsibilities, and practices that guide how an organization protects its physical and digital assets.",
          "keyTakeaway": "Security Policy \u2192 Defines security rules for an organization."
        }
      ],
      "examples": [
        {
          "title": "Standard Enterprise Security Policy Directives",
          "scenario": "Core policies implemented across organizations:",
          "breakdown": [
            {
              "label": "Strong Passwords",
              "detail": "Mandating minimum 14 characters, complexity requirements, and rotation rules."
            },
            {
              "label": "Multi-Factor Authentication (MFA)",
              "detail": "Requiring MFA on all corporate email, VPN, and cloud console logins."
            },
            {
              "label": "Regular Backups",
              "detail": "Enforcing the 3-2-1 backup rule (3 copies, 2 media types, 1 offsite/cloud immutable)."
            },
            {
              "label": "Least Privilege Access",
              "detail": "Granting staff access strictly based on verified business need and job role."
            }
          ]
        }
      ]
    },
    {
      "id": "topic-8-3",
      "number": "8.3",
      "title": "Risk Modeling & Controls",
      "content": [
        "Risk is the possibility of loss, damage, or compromise caused by a threat exploiting a vulnerability in a system.",
        "Without a vulnerability, a threat cannot penetrate; without a threat, a vulnerability causes no active harm. Their intersection defines risk."
      ],
      "definitions": [
        {
          "term": "Risk",
          "definition": "The probability and magnitude of potential loss or harm resulting from an identified threat exploiting an existing vulnerability.",
          "keyTakeaway": "Threat + Vulnerability = Risk."
        }
      ],
      "diagrams": [
        {
          "title": "The Risk Realization Flow",
          "caption": "How threats exploit vulnerabilities to manifest tangible damage.",
          "orientation": "vertical",
          "steps": [
            {
              "label": "Threat + Vulnerability",
              "sublabel": "External Danger meets Internal Weakness"
            },
            {
              "label": "Risk Materialization",
              "sublabel": "Probable occurrence of security incident",
              "highlight": true
            },
            {
              "label": "Possible Damage / Loss",
              "sublabel": "Data breach, financial loss, downtime, legal penalties"
            }
          ]
        }
      ],
      "tables": [
        {
          "title": "The Five Core Pillars of Security Management",
          "columns": [
            {
              "key": "pillar",
              "header": "Pillar"
            },
            {
              "key": "role",
              "header": "Operational Role"
            },
            {
              "key": "example",
              "header": "Practical Example"
            }
          ],
          "rows": [
            {
              "pillar": "Asset",
              "role": "What we protect",
              "example": "Customer database, proprietary AI models"
            },
            {
              "pillar": "Threat",
              "role": "What can cause harm",
              "example": "Ransomware syndicates, disgruntled insiders"
            },
            {
              "pillar": "Vulnerability",
              "role": "Weakness in system",
              "example": "Unpatched Apache server, default credentials"
            },
            {
              "pillar": "Risk",
              "role": "Possible loss / probability",
              "example": "$2M fine from regulatory non-compliance"
            },
            {
              "pillar": "Control",
              "role": "Protection mechanism",
              "example": "Next-Gen Firewall, MFA, automated patch pipeline"
            }
          ]
        }
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "Security Planning",
      "summary": "Plans and coordinates how an organization protects systems and information."
    },
    {
      "topic": "Security Policy",
      "summary": "Defines binding organizational security rules and user standards."
    },
    {
      "topic": "Risk",
      "summary": "The possibility of loss or damage caused by threats exploiting vulnerabilities."
    }
  ],
  "rememberPoints": [
    "Asset \u2192 What we protect",
    "Threat \u2192 What can cause harm",
    "Vulnerability \u2192 Weakness",
    "Risk \u2192 Possible loss",
    "Control \u2192 Protection"
  ],
  "examQuestions": [
    {
      "question": "Define Risk using its mathematical relationship with Threat, Vulnerability, and Impact.",
      "answerGuidance": "Risk = Threat Likelihood \u00d7 Vulnerability Severity \u00d7 Asset Impact. Explain that controls act as dampeners to reduce vulnerability or impact."
    },
    {
      "question": "Differentiate between the roles of Security Planning and Security Policy in corporate governance.",
      "answerGuidance": "Planning is the proactive strategic process of assessing needs and allocating resources; Policy is the formal regulatory document codifying binding rules, expectations, and disciplinary consequences."
    }
  ],
  "technicalVisual": {
      "type": "phishing-flow",
      "title": "Phishing Attack Lifecycle & Defensive Gates",
      "caption": "How modern targeted phishing campaigns harvest credentials and the layered technical defenses (DMARC, FIDO2 WebAuthn, and email filtering) that neutralize them."
  },
  "attackVisualizations": [
      {
          "id": "attack-8-1",
          "title": "Targeted Spear-Phishing & Reverse-Proxy MFA Bypass",
          "attackName": "Modern Spear-Phishing with Reverse-Proxy (Evilginx) Credential Harvesting",
          "overview": "Adversaries deploy a reverse-proxy phishing server on a typosquatted domain to harvest passwords and capture session cookies in real time, bypassing legacy SMS-based MFA.",
          "targetVulnerability": "Reliance on phishable second factors (SMS/Email OTP) and absence of domain-bound FIDO2/WebAuthn credentials.",
          "stages": [
              {
                  "step": 1,
                  "title": "Open Source Intelligence (OSINT)",
                  "actor": "Threat Actor",
                  "action": "Harvesters employee directory and email formats via LinkedIn",
                  "technicalDetail": "Attacker maps corporate organizational hierarchy, identifies finance personnel, and registers typosquatted lookalike domain: cornpany.com (rn instead of m).",
                  "color": "orange"
              },
              {
                  "step": 2,
                  "title": "Deceptive Email Delivery",
                  "actor": "Threat Actor Mailer",
                  "action": "Sends high-urgency payroll notice from spoofed lookalike domain",
                  "technicalDetail": "Email subject: 'Urgent: Direct Deposit Discrepancy \u2014 Review Immediately'. Bypasses basic spam filters if corporate DMARC policy is set to p=none.",
                  "color": "red",
                  "payload": "From: HR Payroll <payroll@cornpany.com>\nSubject: Action Required: Overdue Direct Deposit Verification\nLink: https://login.cornpany.com/auth/verify"
              },
              {
                  "step": 3,
                  "title": "Victim Navigates to Reverse-Proxy",
                  "actor": "Employee",
                  "action": "Clicks link expecting standard Microsoft 365 / Okta SSO portal",
                  "technicalDetail": "Victim arrives on a reverse proxy (e.g. Evilginx) that proxies live pages from the legitimate identity provider while intercepting packets.",
                  "color": "blue"
              },
              {
                  "step": 4,
                  "title": "Credential & OTP Relay",
                  "actor": "Reverse-Proxy Server",
                  "action": "Relays username, password, and SMS OTP to real portal in real-time",
                  "technicalDetail": "Victim inputs their password and SMS code. The reverse proxy forwards them to the real IdP, which accepts the credentials and issues session cookies.",
                  "color": "red"
              },
              {
                  "step": 5,
                  "title": "Session Cookie Interception & Account Hijack",
                  "actor": "Threat Actor",
                  "action": "Extracts authenticated session cookie and imports into browser",
                  "technicalDetail": "The proxy captures the Set-Cookie response header containing session tokens (e.g., ESTSAUTH), allowing the attacker to bypass MFA entirely.",
                  "color": "red"
              },
              {
                  "step": 6,
                  "title": "FIDO2 / WebAuthn Cryptographic Defense",
                  "actor": "Hardware Security Key (FIDO2)",
                  "action": "Binds cryptographic assertion strictly to the browser URL domain",
                  "technicalDetail": "FIDO2/WebAuthn uses public-key cryptography bound to origin (origin binding). Because the browser is on cornpany.com, the authenticator never releases credentials valid for company.com.",
                  "color": "green"
              }
          ],
          "mitigation": {
              "title": "Modern Phishing Mitigation Architecture",
              "rules": [
                  "Deploy FIDO2 / WebAuthn hardware security keys (YubiKeys / passkeys) which are mathematically resistant to reverse-proxy phishing.",
                  "Publish strict email authentication DNS records: SPF, DKIM, and DMARC with p=reject.",
                  "Enforce Conditional Access policies restricting logins to compliant, corporate-managed devices.",
                  "Conduct continuous security awareness training with real-time feedback."
              ]
          }
      }
  ],
  "beforeAfterComparisons": [
      {
          "title": "Authentication Policy: Legacy Complexity Expiration vs. NIST SP 800-63B Passphrases",
          "vulnerable": {
              "label": "Vulnerable: Legacy 90-Day Forced Password Expiration",
              "codeOrConfig": "# LEGACY INSECURE POLICY (pre-NIST 800-63B):\n- Minimum 8 characters with 1 symbol, 1 uppercase, 1 number.\n- Forced password reset every 90 days.\n- Prohibit reuse of last 5 passwords.\n\n# Real-world employee behavior under this policy:\nQ1: Password1!\nQ2: Password2!\nQ3: Password3! (predictable incremental transformations)",
              "explanation": "Frequent forced password rotation forces users to pick predictable patterns, making dictionary cracking and password spraying extremely easy."
          },
          "secure": {
              "label": "Secure: NIST SP 800-63B Modern Passphrase & FIDO2 Policy",
              "codeOrConfig": "# SECURE MODERN NIST GUIDELINES:\n- Minimum 15+ characters (encourage memorable passphrases: 'correct horse battery staple').\n- No arbitrary periodic expiration (reset only upon evidence of compromise).\n- Check against list of 1+ billion known breached passwords (HaveIBeenPwned API).\n- Mandate phishing-resistant Multi-Factor Authentication (FIDO2 / WebAuthn).",
              "explanation": "High length provides exponential entropy (2^80+ combinations). Eliminating arbitrary resets prevents predictable password degradation."
          },
          "keyTakeaway": "Length beats complexity. Memorable passphrases combined with phishing-resistant hardware MFA defeat both dictionary attacks and reverse-proxy phishing."
      }
  ],
  "handsOnPracticals": [
      {
          "id": "practical-8-1",
          "title": "Auditing Domain Anti-Spoofing Records (SPF, DKIM, DMARC) via DNS",
          "learningObjective": "Inspect public DNS TXT records for SPF, DKIM, and DMARC policies to determine whether a domain is protected against email address forgery.",
          "requiredTools": [
              "dig",
              "nslookup",
              "host"
          ],
          "environmentSetup": "Local terminal with dig or nslookup utility.",
          "steps": [
              {
                  "stepNumber": 1,
                  "instruction": "Query the Sender Policy Framework (SPF) TXT record for a domain.",
                  "command": "dig +short TXT google.com | grep \"v=spf1\"",
                  "commandExplanation": "Retrieves the authorized IP addresses and mail transfer agents allowed to send emails on behalf of the domain.",
                  "expectedOutput": "\"v=spf1 include:_spf.google.com ~all\""
              },
              {
                  "stepNumber": 2,
                  "instruction": "Query the DMARC enforcement policy record at _dmarc.<domain>.",
                  "command": "dig +short TXT _dmarc.google.com",
                  "commandExplanation": "Inspects the DMARC record to see if unauthenticated emails are rejected (p=reject) or quarantined (p=quarantine).",
                  "expectedOutput": "\"v=DMARC1; p=reject; rua=mailto:mailauth-reports@google.com\""
              },
              {
                  "stepNumber": 3,
                  "instruction": "Verify the meaning of the DMARC policy parameter.",
                  "command": "python3 -c \"dmarc = 'v=DMARC1; p=reject; rua=mailto:rep@org.com'; print('Policy:', 'STRICT REJECT (Spoofed emails dropped)' if 'p=reject' in dmarc else 'PERMISSIVE')\"",
                  "commandExplanation": "Analyzes the policy tag: p=reject instructs receiving mail servers to automatically drop spoofed emails.",
                  "expectedOutput": "Policy: STRICT REJECT (Spoofed emails dropped)"
              }
          ],
          "whatHappened": "The DNS queries verified that receiving mail servers inspect SPF and DKIM signatures. Because DMARC is set to p=reject, any attacker attempting to forge the sender domain will have their email dropped by the recipient server.",
          "securityLessons": [
              "SPF defines WHO can send from your domain (IP addresses).",
              "DKIM verifies WHAT was sent (cryptographic signature of body and headers).",
              "DMARC instructs receivers WHAT TO DO when SPF or DKIM fails (none, quarantine, or reject)."
          ],
          "prevention": [
              "Deploy DMARC policy with p=reject on all corporate domains.",
              "Set up SPF and DMARC records on defensive park domains so they cannot be spoofed.",
              "Monitor DMARC aggregate XML reports (rua) for unauthorized sending attempts."
          ]
      }
  ]
};
