import type { Chapter } from '../types';

export const chapter02: Chapter = {
  "id": "chapter-02",
  "number": 2,
  "romanNumeral": "II",
  "title": "Information Security Terminology",
  "subtitle": "Assets, Authentication, Authorization, Cryptography, and Malicious Software",
  "category": "Fundamentals",
  "readTime": "6 min read",
  "summary": "Deconstructs foundational information security terms including assets, identity verification versus permission granting, cryptographic conversions, and malicious code classifications.",
  "introParagraphs": [
    "A precise vocabulary is the most essential tool for any security analyst or engineer. In practical engineering, confusion between authorization and authentication or plaintext and ciphertext can lead to catastrophic system vulnerabilities.",
    "This chapter standardizes the core terms used across all subsequent chapters."
  ],
  "topics": [
    {
      "id": "topic-2-1",
      "number": "2.1",
      "title": "Asset",
      "content": [
        "An asset is anything valuable belonging to an individual or organization that requires protection from compromise, loss, or unauthorized access.",
        "Assets can be intangible (intellectual property, source code, user credentials) or physical (servers, laptops, network routers)."
      ],
      "definitions": [
        {
          "term": "Asset",
          "definition": "Anything valuable that needs protection within an organizational boundary.",
          "keyTakeaway": "Asset \u2192 Something valuable that needs protection."
        }
      ],
      "examples": [
        {
          "title": "Classification of Enterprise Assets",
          "scenario": "Modern technology organizations inventory and protect diverse asset categories:",
          "breakdown": [
            {
              "label": "Data",
              "detail": "Customer PII, credit card numbers, trade secrets, financial spreadsheets."
            },
            {
              "label": "Computers & Servers",
              "detail": "Database clusters, web servers, employee workstations, CI/CD runners."
            },
            {
              "label": "Networks",
              "detail": "Internal VPN gateways, Wi-Fi access points, core switches, perimeter routers."
            },
            {
              "label": "Applications",
              "detail": "Customer-facing web portals, microservices, mobile applications."
            }
          ]
        }
      ],
      "keyPoints": [
        "Security investments are determined by the monetary and reputational value of the asset.",
        "Asset discovery and inventorying is the mandatory first phase of security risk assessment."
      ]
    },
    {
      "id": "topic-2-2",
      "number": "2.2",
      "title": "Authentication (AuthN)",
      "content": [
        "Authentication is the technical process of verifying who a user or system entity claims to be before granting session access.",
        "It answers the primary question: 'Who are you?' using one or more verification factors."
      ],
      "definitions": [
        {
          "term": "Authentication",
          "definition": "The process of validating the identity of a user, device, or system entity before granting access.",
          "keyTakeaway": "Authentication \u2192 Who are you?"
        }
      ],
      "examples": [
        {
          "title": "Multi-Factor User Login",
          "scenario": "A user logs into an enterprise dashboard using credentials:",
          "breakdown": [
            {
              "label": "Username & Password",
              "detail": "Something you know (Knowledge Factor)."
            },
            {
              "label": "Hardware Key / Authenticator TOTP",
              "detail": "Something you have (Possession Factor)."
            },
            {
              "label": "Fingerprint / Face ID",
              "detail": "Something you are (Inherence Factor)."
            }
          ],
          "outcome": "Successful identity verification proves the claimant matches the recorded account owner."
        }
      ],
      "keyPoints": [
        "Authentication does not grant permissions; it only verifies identity.",
        "Standard single-factor password authentication is increasingly supplemented with MFA."
      ]
    },
    {
      "id": "topic-2-3",
      "number": "2.3",
      "title": "Authorization (AuthZ)",
      "content": [
        "Authorization determines what an authenticated user, process, or role is permitted to do within the system.",
        "It establishes access boundaries and enforces privilege levels."
      ],
      "definitions": [
        {
          "term": "Authorization",
          "definition": "The mechanism by which a system grants or revokes specific privileges and access rights to a verified identity.",
          "keyTakeaway": "Authorization \u2192 What are you allowed to do?"
        }
      ],
      "examples": [
        {
          "title": "Role-Based Access Control (RBAC)",
          "scenario": "Different permissions assigned to different roles in an organization:",
          "breakdown": [
            {
              "label": "Standard Employee",
              "detail": "Authorized only to read project documentation and edit personal timesheets."
            },
            {
              "label": "Department Manager",
              "detail": "Authorized to read, approve timesheets, and view team salary bands."
            },
            {
              "label": "System Administrator",
              "detail": "Authorized to read, modify, delete files, and reconfigure system permissions."
            }
          ]
        }
      ],
      "tables": [
        {
          "title": "Authentication vs Authorization Comparison",
          "columns": [
            {
              "key": "dimension",
              "header": "Dimension"
            },
            {
              "key": "authn",
              "header": "Authentication (AuthN)"
            },
            {
              "key": "authz",
              "header": "Authorization (AuthZ)"
            }
          ],
          "rows": [
            {
              "dimension": "Core Question",
              "authn": "Who are you?",
              "authz": "What can you do?"
            },
            {
              "dimension": "Execution Order",
              "authn": "Always runs first",
              "authz": "Runs after authentication succeeds"
            },
            {
              "dimension": "Verification Data",
              "authn": "Passwords, biometrics, tokens",
              "authz": "Access policies, roles, ACLs"
            },
            {
              "dimension": "Example Vulnerability",
              "authn": "Credential stuffing, weak passwords",
              "authz": "Broken object-level authorization (IDOR)"
            }
          ]
        }
      ],
      "keyPoints": [
        "Always execute Authentication before Authorization.",
        "Principle of Least Privilege: users should only hold the minimum permissions required for their task."
      ]
    },
    {
      "id": "topic-2-4",
      "number": "2.4",
      "title": "Encryption & Decryption",
      "content": [
        "Encryption converts readable data (plaintext) into an unintelligible, scrambled form (ciphertext) using a cryptographic mathematical algorithm and secret key.",
        "Only parties possessing the correct cryptographic key can reverse the transformation back to readable plaintext through decryption."
      ],
      "definitions": [
        {
          "term": "Encryption",
          "definition": "The cryptographic transformation of intelligible plaintext into ciphertext to conceal its meaning from unauthorized observers.",
          "keyTakeaway": "Encryption \u2192 Protects data by converting it into an unreadable form."
        },
        {
          "term": "Decryption",
          "definition": "The reverse cryptographic process of restoring encrypted ciphertext back into intelligible plaintext using a valid decryption key.",
          "keyTakeaway": "Decryption converts ciphertext back to readable data."
        }
      ],
      "diagrams": [
        {
          "title": "Cryptographic Transformation Pipeline",
          "caption": "How plaintext is concealed via encryption and subsequently restored via decryption.",
          "orientation": "horizontal",
          "steps": [
            {
              "label": "Plaintext",
              "sublabel": "Readable Source Data"
            },
            {
              "label": "Encryption Engine",
              "sublabel": "Cryptographic Key + Algorithm",
              "highlight": true
            },
            {
              "label": "Ciphertext",
              "sublabel": "Scrambled Unreadable Data"
            },
            {
              "label": "Decryption Engine",
              "sublabel": "Valid Key Verification",
              "highlight": true
            },
            {
              "label": "Restored Plaintext",
              "sublabel": "Authorized Cleartext"
            }
          ]
        }
      ],
      "keyPoints": [
        "Protects data at rest (hard drives, databases) and data in transit (TLS, VPNs).",
        "Strong cryptographic algorithms include AES-256 for symmetric data and RSA / ECC for asymmetric key exchange."
      ]
    },
    {
      "id": "topic-2-5",
      "number": "2.5",
      "title": "Malware (Malicious Software)",
      "content": [
        "Malware is a broad portmanteau for 'Malicious Software'.",
        "It encompasses any software code intentionally designed to cause damage to computer hardware, disrupt system operations, steal confidential data, or perform unauthorized activities on behalf of an attacker."
      ],
      "definitions": [
        {
          "term": "Malware",
          "definition": "Any malicious program or code designed to harm, disrupt, exploit, or secretly infiltrate computer systems and networks.",
          "keyTakeaway": "Malware \u2192 Software designed to cause harm or perform unauthorized actions."
        }
      ],
      "examples": [
        {
          "title": "Common Malware Families",
          "scenario": "Major categories of malicious payloads seen in the wild:",
          "breakdown": [
            {
              "label": "Viruses",
              "detail": "Infect host files and propagate upon host execution."
            },
            {
              "label": "Worms",
              "detail": "Autonomous network replicators requiring no human interaction."
            },
            {
              "label": "Trojans",
              "detail": "Pretend to be useful software while hiding a malicious backdoor."
            },
            {
              "label": "Ransomware",
              "detail": "Encrypts user files and extorts cryptocurrency payments."
            },
            {
              "label": "Spyware",
              "detail": "Covertly monitors keystrokes and transmits user activity to C2 servers."
            }
          ]
        }
      ],
      "keyPoints": [
        "Malware can enter systems via email phishing attachments, unpatched vulnerabilities, or malicious downloads.",
        "Modern defense involves multi-engine endpoint detection, sandboxing, and behavioral heuristics."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "Asset",
      "summary": "Something valuable that requires organizational protection."
    },
    {
      "topic": "Authentication",
      "summary": "Verifies the identity of a user or system entity (Who are you?)."
    },
    {
      "topic": "Authorization",
      "summary": "Determines what permissions an authenticated identity holds (What can you do?)."
    },
    {
      "topic": "Encryption",
      "summary": "Converts readable plaintext into unreadable ciphertext."
    },
    {
      "topic": "Malware",
      "summary": "Malicious software engineered to damage, disrupt, or exploit systems."
    }
  ],
  "rememberPoints": [
    "Authentication \u2192 Who are you?",
    "Authorization \u2192 What can you do?",
    "Plaintext + Key + Algorithm = Ciphertext"
  ],
  "examQuestions": [
    {
      "question": "Compare Authentication and Authorization with practical enterprise examples.",
      "answerGuidance": "Authentication answers 'Who are you?' (e.g. employee entering badge or password); Authorization answers 'What can you do?' (e.g. employee can read standard files, whereas admin can read and edit configuration files)."
    },
    {
      "question": "Explain the technical process of Encryption and Decryption using a diagrammatic flow.",
      "answerGuidance": "Define Plaintext (readable) converted into Ciphertext (unreadable) using a mathematical algorithm and cryptographic key. Mention symmetric vs asymmetric key usage and the decryption restoration step."
    }
  ],
  "attackVisualizations": [
      {
          "id": "attack-2-1",
          "title": "Insecure Direct Object Reference (IDOR) & Privilege Escalation",
          "attackName": "Broken Object Level Authorization (BOLA / IDOR)",
          "overview": "An attacker manipulates an unvalidated client-side identifier in an API request to view or modify sensitive records belonging to other users or administrators.",
          "targetVulnerability": "Server retrieves records directly by database primary key ID without verifying ownership or session authorization.",
          "stages": [
              {
                  "step": 1,
                  "title": "Authenticated Reconnaissance",
                  "actor": "Legitimate User / Attacker",
                  "action": "Inspects network traffic during normal profile retrieval",
                  "technicalDetail": "Attacker logs in as user #1042 and observes the profile API endpoint: GET /api/v1/users/1042/profile.",
                  "color": "blue"
              },
              {
                  "step": 2,
                  "title": "Identifier Parameter Tampering",
                  "actor": "Attacker",
                  "action": "Modifies primary key identifier in HTTP request header",
                  "technicalDetail": "Attacker modifies request to target user ID #1001 (system administrator) or iterates through IDs 1000-1100.",
                  "color": "orange",
                  "payload": "GET /api/v1/users/1001/profile HTTP/1.1\nHost: portal.target.com\nAuthorization: Bearer <token_for_user_1042>"
              },
              {
                  "step": 3,
                  "title": "Missing Authorization Validation",
                  "actor": "API Backend Controller",
                  "action": "Queries database with raw URL parameter",
                  "technicalDetail": "Controller executes User.findById(req.params.id) without verifying if req.user.id === req.params.id or checking role permissions.",
                  "color": "gray"
              },
              {
                  "step": 4,
                  "title": "Sensitive Record Disclosure",
                  "actor": "Database Engine",
                  "action": "Returns full admin profile data across security boundary",
                  "technicalDetail": "Database returns record including admin email, hashed master password, API keys, and corporate banking details.",
                  "color": "red"
              },
              {
                  "step": 5,
                  "title": "Vertical Privilege Escalation",
                  "actor": "Attacker",
                  "action": "Uses exposed administrative keys to modify system roles",
                  "technicalDetail": "Attacker uses exposed internal API key to grant administrative privileges to their own original account (#1042).",
                  "color": "red"
              },
              {
                  "step": 6,
                  "title": "Object-Level Access Control",
                  "actor": "Defensive Architecture",
                  "action": "Enforces tenant-scoped queries and ABAC policies",
                  "technicalDetail": "Queries are scoped strictly to the authenticated session context (User.findOne({ id: req.params.id, tenantId: req.user.tenantId })), rejecting foreign requests with 403 Forbidden.",
                  "color": "green"
              }
          ],
          "mitigation": {
              "title": "Broken Object Authorization Defenses",
              "rules": [
                  "Enforce contextual Object-Level Authorization on every state-changing and read operation.",
                  "Scope database queries to the authenticated user ID extracted from session/JWT.",
                  "Use unguessable UUIDv4 or encrypted indirect reference maps instead of sequential integers.",
                  "Implement automated unit and integration tests asserting 403 Forbidden for cross-tenant access."
              ]
          }
      }
  ],
  "beforeAfterComparisons": [
      {
          "title": "API Authorization: Unchecked Primary Key Query vs. Scoped Tenant-Level Access",
          "vulnerable": {
              "label": "Vulnerable: Direct Database Lookup by Route Parameter",
              "codeOrConfig": "// INSECURE: Anyone with a valid token can read any document\napp.get('/api/documents/:docId', authMiddleware, async (req, res) => {\n  const doc = await Document.findById(req.params.docId);\n  if (!doc) return res.status(404).json({ error: 'Not found' });\n  return res.json(doc); // IDOR vulnerability!\n});",
              "explanation": "The endpoint checks that the user is authenticated, but fails to check whether the authenticated user owns or has read rights to docId."
          },
          "secure": {
              "label": "Secure: Scoped Query & Explicit Authorization Guard",
              "codeOrConfig": "// SECURE: Scoped lookup ensuring record belongs to user/organization\napp.get('/api/documents/:docId', authMiddleware, async (req, res) => {\n  const doc = await Document.findOne({\n    _id: req.params.docId,\n    organizationId: req.user.organizationId\n  });\n  if (!doc || (!doc.allowedUsers.includes(req.user.id) && req.user.role !== 'admin')) {\n    return res.status(403).json({ error: 'Access denied: insufficient permissions' });\n  }\n  return res.json(doc);\n});",
              "explanation": "Combines multi-tenant tenant isolation with role-based checks, rejecting any cross-user parameter tampering attempts."
          },
          "keyTakeaway": "Authentication proves WHO you are; Authorization governs WHAT you can access. Never rely solely on authentication checks."
      }
  ],
  "handsOnPracticals": [
      {
          "id": "practical-2-1",
          "title": "Cryptographic Verification of System Binary Integrity via SHA-256",
          "learningObjective": "Use SHA-256 cryptographic hashes to verify software integrity and detect unauthorized binary modification or zero-day backdoors.",
          "requiredTools": [
              "sha256sum",
              "openssl",
              "echo",
              "cat"
          ],
          "environmentSetup": "Linux/macOS or Windows PowerShell with sha256sum or CertUtil.",
          "steps": [
              {
                  "stepNumber": 1,
                  "instruction": "Create a simulated application script and generate its baseline cryptographic signature.",
                  "command": "echo 'print(\"Production App v1.0\")' > app.py && sha256sum app.py > app.py.sha256",
                  "commandExplanation": "Calculates the 256-bit hash of app.py and writes it to an integrity reference file.",
                  "expectedOutput": "app.py.sha256 created containing hash and filename."
              },
              {
                  "stepNumber": 2,
                  "instruction": "Verify that the intact application passes the cryptographic integrity check.",
                  "command": "sha256sum -c app.py.sha256",
                  "commandExplanation": "Verifies that the current hash of app.py matches the stored baseline.",
                  "expectedOutput": "app.py: OK"
              },
              {
                  "stepNumber": 3,
                  "instruction": "Simulate an attacker injecting a single backdoor line and verify integrity failure.",
                  "command": "echo '# Backdoor payload' >> app.py && sha256sum -c app.py.sha256",
                  "commandExplanation": "Modifying even a single whitespace or comment byte completely scrambles the SHA-256 digest (avalanche effect).",
                  "expectedOutput": "app.py: FAILED\nsha256sum: WARNING: 1 computed checksum did NOT match"
              }
          ],
          "whatHappened": "The cryptographic avalanche effect altered the entire 64-character hex digest when a single line was added, immediately triggering an integrity failure alert.",
          "securityLessons": [
              "Cryptographic hashing guarantees data integrity and detects tampering even if timestamps or file sizes are spoofed.",
              "Production CI/CD pipelines use cryptographic signing (cosign/GPG) to verify code before deployment.",
              "File Integrity Monitoring (FIM) tools like OSSEC/Tripwire rely on this exact mechanism."
          ],
          "prevention": [
              "Maintain out-of-band signed checksum lists for all system binaries.",
              "Deploy File Integrity Monitoring across production webroots.",
              "Enforce strict read-only root filesystems on containerized microservices."
          ]
      }
  ]
};
