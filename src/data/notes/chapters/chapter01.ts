import type { Chapter } from '../types';

export const chapter01: Chapter = {
  "id": "chapter-01",
  "number": 1,
  "romanNumeral": "I",
  "title": "Basic Cyber Security Concepts",
  "subtitle": "Core Foundations, CIA Triad, and the Threat-Vulnerability-Attack Paradigm",
  "category": "Fundamentals",
  "readTime": "5 min read",
  "summary": "Introduces fundamental cyber security definitions, the foundational CIA Triad, and the causal link between threats, vulnerabilities, and attacks.",
  "introParagraphs": [
    "Cyber security forms the bedrock of modern computing infrastructure. In an era where digital systems govern finance, governance, healthcare, and daily communication, defending information and infrastructure from malicious actors is a vital technical discipline.",
    "This introductory chapter establishes the essential vocabulary and core security model that underpins every advanced security domain."
  ],
  "topics": [
    {
      "id": "topic-1-1",
      "number": "1.1",
      "title": "Introduction to Cyber Security",
      "content": [
        "Cyber Security is the practice of protecting computers, networks, systems, and data from unauthorized access, attacks, damage, or theft.",
        "At its core, cyber security seeks to preserve operational capability, prevent digital sabotage, and safeguard user privacy across interconnected platforms."
      ],
      "definitions": [
        {
          "term": "Cyber Security",
          "definition": "The practice of protecting computers, networks, systems, and data from unauthorized access, attacks, damage, or theft.",
          "keyTakeaway": "Cyber Security \u2192 Protects computers, networks, and data."
        }
      ],
      "examples": [
        {
          "title": "Enterprise Defense Stack",
          "scenario": "A modern company establishes multi-layered security controls to protect its internal infrastructure and customer records.",
          "breakdown": [
            {
              "label": "Passwords & MFA",
              "detail": "Ensures only validated employees gain access to administrative dashboards."
            },
            {
              "label": "Firewalls",
              "detail": "Inspects and filters incoming and outgoing network traffic based on strict security rules."
            },
            {
              "label": "Antivirus & EDR",
              "detail": "Scans endpoints in real time for malicious signatures and suspicious behavioral patterns."
            },
            {
              "label": "Data Encryption",
              "detail": "Renders stored customer records unreadable even if physical hard drives are compromised."
            }
          ],
          "outcome": "Multi-layered defense (Defense in Depth) substantially mitigates the risk of a catastrophic breach."
        }
      ],
      "keyPoints": [
        "Protects digital systems across hardware, software, and communication media.",
        "Combines administrative policies, technological controls, and user awareness."
      ]
    },
    {
      "id": "topic-1-2",
      "number": "1.2",
      "title": "Information Security & The CIA Triad",
      "content": [
        "Information Security means protecting information from unauthorized access, modification, disclosure, or destruction.",
        "Whether stored digitally, transmitted across fiber cables, or documented on paper, information integrity and protection is governed by three primary pillars known collectively as the CIA Triad: Confidentiality, Integrity, and Availability."
      ],
      "definitions": [
        {
          "term": "Information Security",
          "definition": "The practice of protecting information and information systems from unauthorized access, modification, disclosure, disruption, or destruction.",
          "keyTakeaway": "Governed by the three pillars of the CIA Triad."
        },
        {
          "term": "Confidentiality",
          "definition": "Ensures that only authorized people, entities, or processes can access sensitive information.",
          "keyTakeaway": "Confidentiality \u2192 Only authorized people can access information."
        },
        {
          "term": "Integrity",
          "definition": "Ensures that information remains accurate, authentic, and unchanged from unauthorized modification or tampering.",
          "keyTakeaway": "Integrity \u2192 Information remains correct and unchanged."
        },
        {
          "term": "Availability",
          "definition": "Ensures that systems, networks, and data are accessible and operational whenever needed by authorized users.",
          "keyTakeaway": "Availability \u2192 Information is available when needed."
        }
      ],
      "diagrams": [
        {
          "title": "The CIA Triad Information Model",
          "caption": "The three essential security goals required to achieve robust information protection.",
          "orientation": "horizontal",
          "steps": [
            {
              "label": "Confidentiality",
              "sublabel": "Privacy & Access Control",
              "highlight": true
            },
            {
              "label": "Integrity",
              "sublabel": "Data Accuracy & Non-tampering",
              "highlight": true
            },
            {
              "label": "Availability",
              "sublabel": "Uptime & Continuous Access",
              "highlight": true
            }
          ]
        }
      ],
      "examples": [
        {
          "title": "Online Bank Account Security",
          "scenario": "How the CIA Triad protects a personal bank account:",
          "breakdown": [
            {
              "label": "Confidentiality",
              "detail": "Only you (the account holder) and authorized banking staff can view your account balances and transaction history."
            },
            {
              "label": "Integrity",
              "detail": "Your account balance cannot be illegally modified, forged, or altered while in transit or resting in the database."
            },
            {
              "label": "Availability",
              "detail": "You can reliably log into the mobile banking portal, verify funds, and execute transactions 24/7 without denial of service."
            }
          ],
          "outcome": "Failure of any single pillar compromises the entire trustworthy relationship."
        }
      ],
      "keyPoints": [
        "CIA \u2192 Confidentiality, Integrity, Availability.",
        "Security trade-offs: extreme confidentiality measures should not unnecessarily impair availability for legitimate users."
      ]
    },
    {
      "id": "topic-1-3",
      "number": "1.3",
      "title": "Threat, Vulnerability and Attack",
      "content": [
        "Security professionals analyze risks by dissecting three interconnected concepts: threats, vulnerabilities, and attacks. Understanding their exact relationship allows defensive teams to deploy precise countermeasures."
      ],
      "definitions": [
        {
          "term": "Threat",
          "definition": "A possible danger, agent, or event that could exploit a vulnerability to cause harm or loss to an asset.",
          "keyTakeaway": "Threat: A possible danger to a system."
        },
        {
          "term": "Vulnerability",
          "definition": "A flaw, flaw in design, or weakness in system procedures, internal controls, or implementation that can be exploited.",
          "keyTakeaway": "Vulnerability: A weakness in a system."
        },
        {
          "term": "Attack",
          "definition": "An intentional, deliberate attempt by a malicious entity to exploit a system vulnerability to compromise confidentiality, integrity, or availability.",
          "keyTakeaway": "Attack: An attempt to use a vulnerability to cause harm."
        }
      ],
      "diagrams": [
        {
          "title": "Threat Exploitation Progression Flow",
          "caption": "How a vulnerability transforms into an unauthorized breach through an active attack.",
          "orientation": "vertical",
          "steps": [
            {
              "label": "Weak Password",
              "sublabel": "Vulnerability (System Weakness)",
              "highlight": false
            },
            {
              "label": "Attacker Tries to Guess It",
              "sublabel": "Attack (Active Exploitation)",
              "highlight": true
            },
            {
              "label": "Unauthorized Access",
              "sublabel": "Result (Security Compromise)",
              "highlight": false
            }
          ]
        }
      ],
      "examples": [
        {
          "title": "Weak Password Exploitation Lifecycle",
          "scenario": "An employee configures 'password123' on an internet-facing remote desktop portal.",
          "breakdown": [
            {
              "label": "Vulnerability",
              "detail": "The trivial password lacks entropy and has no rate-limiting lockout."
            },
            {
              "label": "Threat",
              "detail": "Automated brute-force bots and credential-stuffing threat actors scanning public IP blocks."
            },
            {
              "label": "Attack",
              "detail": "The attacker executes a dictionary brute-force script against the login interface."
            },
            {
              "label": "Result",
              "detail": "Attacker achieves root/admin privileges, creating an unauthorized network foothold."
            }
          ]
        }
      ],
      "keyPoints": [
        "A vulnerability without a threat carries minimal immediate risk; a threat without a vulnerability cannot penetrate.",
        "Defenders primarily control vulnerabilities because external threats cannot be eliminated."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "Cyber Security",
      "summary": "Protects computers, networks, systems, and data from unauthorized harm or theft."
    },
    {
      "topic": "Confidentiality",
      "summary": "Protects information from unauthorized access and snooping."
    },
    {
      "topic": "Integrity",
      "summary": "Keeps information correct, unaltered, and trustworthy."
    },
    {
      "topic": "Availability",
      "summary": "Ensures systems and data remain operational and accessible when needed."
    },
    {
      "topic": "Threat",
      "summary": "Any possible danger or circumstance that could inflict damage."
    },
    {
      "topic": "Vulnerability",
      "summary": "A flaw or weakness in security procedures, design, or implementation."
    },
    {
      "topic": "Attack",
      "summary": "An deliberate attempt to exploit a vulnerability to cause harm."
    }
  ],
  "rememberPoints": [
    "CIA \u2192 Confidentiality + Integrity + Availability",
    "Vulnerability + Threat + Exploitation = Breach"
  ],
  "examQuestions": [
    {
      "question": "Differentiate between Cyber Security and Information Security with real-world examples.",
      "answerGuidance": "Cyber security focuses specifically on protecting digital assets, networks, and computer systems. Information security is broader, covering the protection of all information assets regardless of form (digital, physical documents, spoken communication) under the CIA Triad."
    },
    {
      "question": "Explain the CIA Triad and evaluate how each component applies to an online banking application.",
      "answerGuidance": "Define Confidentiality (only account holder views balance), Integrity (balance cannot be tampered with in transit or storage), and Availability (banking servers remain accessible 24/7 without outages). Mention trade-offs and mechanisms like encryption, hashing, and load balancing."
    },
    {
      "question": "Illustrate the relationship between Threat, Vulnerability, and Attack using the weak password lifecycle.",
      "answerGuidance": "Walk through: Weak Password represents the internal Vulnerability; the external cybercriminal or automated bot is the Threat; the automated dictionary guessing is the Attack; unauthorized account takeover is the Result."
    }
  ],
  "technicalVisual": {
      "type": "cia-triad",
      "title": "The CIA Triad Architecture",
      "caption": "The foundational balancing act of information security: Confidentiality, Integrity, and Availability."
  },
  "attackVisualizations": [
      {
          "id": "attack-1-1",
          "title": "Credential Stuffing & Brute-Force Lifecycle",
          "attackName": "Automated Credential Stuffing & High-Rate Dictionary Attack",
          "overview": "Adversaries leverage massive breached credential dumps and automated bots to fire thousands of password attempts against an authentication endpoint lacking rate limits.",
          "targetVulnerability": "Absence of IP/account rate limiting, lack of CAPTCHA protection, and single-factor password authentication.",
          "stages": [
              {
                  "step": 1,
                  "title": "Breached Database Ingestion",
                  "actor": "Threat Actor",
                  "action": "Loads credential combo-list into automated cracking tool",
                  "technicalDetail": "Attacker compiles 500,000 email:password pairs obtained from dark web leaks into a multi-threaded HTTP spraying tool (e.g., Hydra or custom Python script).",
                  "color": "red",
                  "payload": "POST /api/v1/auth/login HTTP/1.1\nHost: api.target.com\nContent-Type: application/json\n\n{\"email\":\"victim@domain.com\",\"password\":\"Summer2025!\"}"
              },
              {
                  "step": 2,
                  "title": "High-Frequency Automated Spraying",
                  "actor": "Bot Network",
                  "action": "Dispatches 250 requests/sec through residential proxy rotation",
                  "technicalDetail": "Proxies rotate source IP addresses to evade basic perimeter firewalls that only monitor single-IP request frequencies.",
                  "color": "orange"
              },
              {
                  "step": 3,
                  "title": "Target Server Resource Exhaustion",
                  "actor": "Target Server",
                  "action": "Authenticates requests sequentially with expensive hashing",
                  "technicalDetail": "The web server computes CPU-intensive bcrypt operations for every single guess without throttling, pushing CPU utilization to 100%.",
                  "color": "gray"
              },
              {
                  "step": 4,
                  "title": "Password Collision & Token Grant",
                  "actor": "Authentication Service",
                  "action": "Identifies valid credential match and grants session",
                  "technicalDetail": "A reused password matches the stored bcrypt hash. The server signs and returns an unrestricted JWT bearer session token without prompting for 2FA.",
                  "color": "red"
              },
              {
                  "step": 5,
                  "title": "Account Takeover & Data Exfiltration",
                  "actor": "Threat Actor",
                  "action": "Accesses profile and initiates unauthorized payouts",
                  "technicalDetail": "Attacker invokes protected endpoints using the hijacked JWT, modifies notification email addresses, and exports private customer records.",
                  "color": "red"
              },
              {
                  "step": 6,
                  "title": "Hardened Defensive Mitigation",
                  "actor": "Security Architecture",
                  "action": "Enforces rate limiting, progressive delays, and mandatory MFA",
                  "technicalDetail": "Token-bucket rate limiters drop requests exceeding 5 attempts/min per IP and user account. Multi-factor authentication halts unverified token issuance.",
                  "color": "green"
              }
          ],
          "mitigation": {
              "title": "Defense-in-Depth Authentication Controls",
              "rules": [
                  "Enforce IP and account-level sliding window rate limiting (max 5 failed attempts per 15 minutes).",
                  "Implement mandatory Multi-Factor Authentication (TOTP RFC 6238 or FIDO2/WebAuthn).",
                  "Deploy cloud WAF CAPTCHA challenges after 3 consecutive failed login attempts.",
                  "Screen incoming passwords against the HaveIBeenPwned breached password database."
              ]
          }
      }
  ],
  "beforeAfterComparisons": [
      {
          "title": "Authentication Verification: Insecure Plain Compare vs. Hardened Bcrypt & Rate Limiting",
          "vulnerable": {
              "label": "Vulnerable: Cleartext Storage & Unthrottled Comparison",
              "codeOrConfig": "// INSECURE: vulnerable to timing attacks, SQL leakage, and brute force\napp.post('/api/login', async (req, res) => {\n  const user = await db.query('SELECT * FROM users WHERE email = ?', [req.body.email]);\n  if (user && user.password === req.body.password) {\n    return res.json({ token: generateToken(user) });\n  }\n  return res.status(401).send('Invalid credentials');\n});",
              "explanation": "Passwords stored in plain text. Direct string equality operator (===) leaks length and character matches via timing side-channels. Absence of rate limiting permits 10,000+ guesses/second."
          },
          "secure": {
              "label": "Secure: Argon2id/Bcrypt with Sliding-Window Rate Limiting",
              "codeOrConfig": "// SECURE: memory-hard salted hashing + Redis sliding rate limiter\napp.post('/api/login', loginRateLimiter, async (req, res) => {\n  const user = await db.query('SELECT id, password_hash, mfa_secret FROM users WHERE email = ?', [req.body.email]);\n  if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {\n    return res.status(401).json({ error: 'Invalid email or password' });\n  }\n  if (user.mfa_secret) {\n    return res.status(200).json({ mfaRequired: true, sessionToken: createTempToken(user.id) });\n  }\n  return res.json({ token: createSecureJWT(user.id) });\n});",
              "explanation": "Bcrypt utilizes computational work factors and unique 128-bit salts, rendering precomputed rainbow tables completely ineffective. Redis sliding-window middleware throttles attacks."
          },
          "keyTakeaway": "Never store plaintext credentials, never perform raw equality checks, and always throttle authentication endpoints with distributed rate limiting."
      }
  ],
  "handsOnPracticals": [
      {
          "id": "practical-1-1",
          "title": "Auditing Password Hashing Entropy & Bcrypt Salt Generation",
          "learningObjective": "Demonstrate how cryptographic salts protect passwords against rainbow table lookups and benchmark work-factor computational resistance against GPU cracking.",
          "requiredTools": [
              "python3",
              "bcrypt",
              "hashlib",
              "curl"
          ],
          "environmentSetup": "Local terminal with Python 3.8+ and standard command-line tools.",
          "steps": [
              {
                  "stepNumber": 1,
                  "instruction": "Compute and compare a fast MD5 hash with an adaptive Bcrypt hash for password 'P@ss123'.",
                  "command": "python3 -c \"import hashlib, bcrypt; print('MD5:', hashlib.md5(b'P@ss123').hexdigest()); print('Bcrypt:', bcrypt.hashpw(b'P@ss123', bcrypt.gensalt(12)).decode())\"",
                  "commandExplanation": "Generates both a legacy MD5 hash and a modern Bcrypt hash with work factor 12 (2^12 rounds).",
                  "expectedOutput": "MD5: 585a97576f3f0196885dfb564551c96d\nBcrypt: $2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
              },
              {
                  "stepNumber": 2,
                  "instruction": "Re-run the Bcrypt hashing command on the exact same password to verify unique salt generation.",
                  "command": "python3 -c \"import bcrypt; print('Second Bcrypt:', bcrypt.hashpw(b'P@ss123', bcrypt.gensalt(12)).decode())\"",
                  "commandExplanation": "Notice the resulting hash string is completely different because gensalt() generates a new 128-bit cryptographically secure pseudorandom salt.",
                  "expectedOutput": "Second Bcrypt: $2b$12$eX9M8wQ4pG2...vL0o3U7cK9yT2rE4w"
              },
              {
                  "stepNumber": 3,
                  "instruction": "Test constant-time verification to prevent timing attack side-channels.",
                  "command": "python3 -c \"import bcrypt; h = b'$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; print('Check P@ss123:', bcrypt.checkpw(b'P@ss123', h)); print('Check wrong:', bcrypt.checkpw(b'wrong', h))\"",
                  "commandExplanation": "The checkpw() function extracts the embedded salt and rounds from the hash string and executes a constant-time memory comparison.",
                  "expectedOutput": "Check P@ss123: True\nCheck wrong: False"
              }
          ],
          "whatHappened": "MD5 produced a deterministic 32-character string in 0.000005 seconds, which can be cracked in seconds via precomputed rainbow tables. Bcrypt generated a randomized salt and required ~250 milliseconds of deliberate CPU compute.",
          "securityLessons": [
              "Cryptographic salts prevent identical passwords from having identical hash representations in a database.",
              "Adaptive work factors (cost parameters) allow security architects to increase hashing difficulty as computer hardware gets faster.",
              "Constant-time comparison algorithms prevent timing side-channel attacks."
          ],
          "prevention": [
              "Use Bcrypt (cost 12+), Argon2id, or PBKDF2.",
              "Enforce minimum 12-character passphrases over arbitrary complexity rules.",
              "Combine hashing with out-of-band Multi-Factor Authentication."
          ]
      }
  ]
};
