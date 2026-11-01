import type { Chapter } from '../types';

export const chapter10: Chapter = {
  "id": "chapter-10",
  "number": 10,
  "romanNumeral": "X",
  "title": "Transport Layer Security",
  "subtitle": "Cryptographic Channel Protection, TLS Handshakes, and HTTPS",
  "category": "Network & Cloud Security",
  "readTime": "6 min read",
  "summary": "Explains Transport Layer Security (TLS), detailing how the cryptographic handshake establishes encrypted HTTPS channels providing confidentiality, integrity, and server authentication.",
  "introParagraphs": [
    "Transport Layer Security (TLS) is a security protocol used to protect communication over a network.",
    "When users send sensitive banking passwords or personal health data across the internet, public Wi-Fi routers and intermediate ISPs could inspect or modify every byte. TLS prevents eavesdropping and tampering by creating an authenticated, encrypted tunnel."
  ],
  "topics": [
    {
      "id": "topic-10-1",
      "number": "10.1",
      "title": "Introduction to TLS",
      "content": [
        "Transport Layer Security (TLS) is a cryptographic protocol designed to provide secure communication over computer networks.",
        "It operates above the transport layer (TCP) and directly underneath application protocols like HTTP, SMTP, and IMAP.",
        "TLS provides three vital guarantees: Confidentiality, Integrity, and Authentication."
      ],
      "definitions": [
        {
          "term": "Transport Layer Security (TLS)",
          "definition": "A cryptographic protocol that provides end-to-end communication security over networks, superseding the legacy SSL protocol.",
          "keyTakeaway": "TLS \u2192 Protects data during network communication."
        }
      ],
      "examples": [
        {
          "title": "The Three Guarantees of TLS",
          "scenario": "How TLS satisfies the CIA Triad for network traffic:",
          "breakdown": [
            {
              "label": "Confidentiality",
              "detail": "Symmetric encryption (AES-GCM / ChaCha20) scrambles transmitted data from eavesdroppers."
            },
            {
              "label": "Integrity",
              "detail": "Message Authentication Codes (HMAC) ensure data cannot be modified in transit undetected."
            },
            {
              "label": "Authentication",
              "detail": "X.509 digital certificates verify the server's real identity to prevent impersonation."
            }
          ]
        }
      ]
    },
    {
      "id": "topic-10-2",
      "number": "10.2",
      "title": "HTTPS (HTTP over TLS)",
      "content": [
        "HTTPS uses standard HTTP over an encrypted TLS connection.",
        "When you visit https://example.com, the browser and server establish a TLS session before any HTTP request headers or body text are exchanged."
      ],
      "diagrams": [
        {
          "title": "HTTPS Protocol Encapsulation Flow",
          "caption": "How standard HTTP traffic is protected by wrapping it inside TLS.",
          "orientation": "horizontal",
          "steps": [
            {
              "label": "HTTP Data",
              "sublabel": "Standard cleartext request"
            },
            {
              "label": "TLS Layer",
              "sublabel": "Cryptographic encryption & MAC",
              "highlight": true
            },
            {
              "label": "HTTPS Stream",
              "sublabel": "Encrypted payload over port 443"
            }
          ]
        }
      ],
      "keyPoints": [
        "Default TCP port for HTTP is 80 (unencrypted); default TCP port for HTTPS is 443 (encrypted).",
        "Modern browsers display a lock icon or mark non-HTTPS sites as 'Not Secure'."
      ]
    },
    {
      "id": "topic-10-3",
      "number": "10.3",
      "title": "Basic TLS Handshake Process",
      "content": [
        "Before application data can travel securely, the client and server must complete the TLS Handshake to negotiate cipher suites, authenticate the server certificate, and derive shared session keys."
      ],
      "diagrams": [
        {
          "title": "TLS Handshake Communication Flow",
          "caption": "The sequence of cryptographic exchanges during handshake negotiation.",
          "orientation": "vertical",
          "steps": [
            {
              "label": "Client Hello",
              "sublabel": "Client sends supported TLS versions and cipher suites"
            },
            {
              "label": "Server Hello & Certificate",
              "sublabel": "Server presents digital certificate and chosen cipher suite"
            },
            {
              "label": "Server Authentication",
              "sublabel": "Client verifies certificate with trusted Certificate Authority (CA)",
              "highlight": true
            },
            {
              "label": "Key Exchange & Session Key Derivation",
              "sublabel": "Both parties independently compute shared symmetric keys"
            },
            {
              "label": "Encrypted Communication",
              "sublabel": "High-speed symmetric encryption begins for all subsequent data"
            }
          ]
        }
      ],
      "keyPoints": [
        "Asymmetric cryptography (RSA/ECC) is used during the handshake to exchange keys safely.",
        "Symmetric cryptography (AES) is used for actual data transmission due to superior CPU speed."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "TLS",
      "summary": "Cryptographic protocol protecting network communication."
    },
    {
      "topic": "HTTPS",
      "summary": "Standard HTTP secured inside a TLS encrypted channel on port 443."
    },
    {
      "topic": "Guarantees",
      "summary": "Confidentiality (encryption), Integrity (MAC checks), and Authentication (certificates)."
    },
    {
      "topic": "Handshake",
      "summary": "Negotiates cipher suites, validates certificates, and derives shared session keys."
    }
  ],
  "rememberPoints": [
    "HTTP + TLS = HTTPS",
    "TLS Handshake: Asymmetric Key Exchange \u2192 Symmetric Data Encryption"
  ],
  "examQuestions": [
    {
      "question": "Detail the sequence of messages exchanged during a TLS Handshake and explain the transition from asymmetric to symmetric encryption.",
      "answerGuidance": "Step through Client Hello, Server Hello + Certificate, CA validation, Diffie-Hellman / ECDHE key exchange, and generation of symmetric session keys. Explain that asymmetric encryption is computationally slow so it is only used to exchange secrets, while symmetric AES handles bulk payload encryption."
    },
    {
      "question": "Explain why X.509 digital certificates are critical for preventing Man-in-the-Middle (MitM) attacks in HTTPS.",
      "answerGuidance": "Certificates signed by trusted public Root CAs prove that the public key belongs to the legitimate domain owner, preventing an intermediate attacker from presenting a forged public key to intercept traffic."
    }
  ],
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
          "requiredTools": [
              "openssl",
              "curl"
          ],
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
};
