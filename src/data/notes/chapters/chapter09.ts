import type { Chapter } from '../types';

export const chapter09: Chapter = {
  "id": "chapter-09",
  "number": 9,
  "romanNumeral": "IX",
  "title": "Network Protocols and Service Models",
  "subtitle": "Communication Standards, Protocol Suites, and Cloud Delivery Models",
  "category": "Network & Cloud Security",
  "readTime": "5 min read",
  "summary": "Covers essential network protocols that govern digital communication alongside modern cloud delivery service models (IaaS, PaaS, SaaS).",
  "introParagraphs": [
    "A network protocol is a set of rules used by devices to communicate with each other.",
    "Modern computing relies on standardized communication rules and cloud delivery abstractions. Understanding these protocols and service models allows security engineers to analyze packet traffic and secure cloud boundaries."
  ],
  "topics": [
    {
      "id": "topic-9-1",
      "number": "9.1",
      "title": "Network Protocols",
      "content": [
        "A network protocol is a formal set of rules and conventions used by digital devices to format, transmit, and receive data over networks.",
        "Protocol \u2192 Rules for communication.",
        "Different protocols operate at distinct layers of the networking stack to accomplish routing, reliable delivery, and application functions."
      ],
      "definitions": [
        {
          "term": "Network Protocol",
          "definition": "An established set of rules that determine how data is transmitted between different devices on the same or interconnected networks.",
          "keyTakeaway": "Protocol \u2192 Rules for communication."
        }
      ],
      "examples": [
        {
          "title": "Primary Internet Protocols & Security Implications",
          "scenario": "Core communication protocols encountered in network defense:",
          "breakdown": [
            {
              "label": "HTTP / HTTPS",
              "detail": "Hypertext Transfer Protocol; HTTPS adds TLS encryption for secure web browsing."
            },
            {
              "label": "DNS",
              "detail": "Domain Name System; resolves human domain names to IP addresses (secured via DNSSEC)."
            },
            {
              "label": "FTP",
              "detail": "File Transfer Protocol; legacy unencrypted protocol (superseded by SFTP)."
            },
            {
              "label": "TCP / IP",
              "detail": "Transmission Control Protocol (reliable byte streams) and Internet Protocol (packet addressing)."
            }
          ]
        }
      ]
    },
    {
      "id": "topic-9-2",
      "number": "9.2",
      "title": "Cloud Service Models",
      "content": [
        "A service model describes how computing resources and network services are provided, delivered, and consumed over the internet.",
        "In cloud computing, the three fundamental service models establish the division of management between the cloud vendor and the customer."
      ],
      "definitions": [
        {
          "term": "IaaS (Infrastructure as a Service)",
          "definition": "Provides fundamental computing, networking, and storage resources on demand (e.g. AWS EC2, Azure VMs).",
          "keyTakeaway": "IaaS \u2192 Virtual Machines & Bare Infrastructure."
        },
        {
          "term": "PaaS (Platform as a Service)",
          "definition": "Provides a hardware and software framework that allows developers to build and deploy applications without managing underlying VMs (e.g. Heroku, AWS Elastic Beanstalk).",
          "keyTakeaway": "PaaS \u2192 Application Development Platform."
        },
        {
          "term": "SaaS (Software as a Service)",
          "definition": "Delivers complete, fully managed applications directly to end users over the web (e.g. Google Workspace, Microsoft 365).",
          "keyTakeaway": "SaaS \u2192 Ready-to-use End-User Software."
        }
      ],
      "tables": [
        {
          "title": "Comparison of Cloud Delivery Models",
          "columns": [
            {
              "key": "model",
              "header": "Service Model"
            },
            {
              "key": "customerManages",
              "header": "Customer Manages"
            },
            {
              "key": "providerManages",
              "header": "Provider Manages"
            },
            {
              "key": "primaryAnalogy",
              "header": "Analogy"
            }
          ],
          "rows": [
            {
              "model": "IaaS",
              "customerManages": "OS, Middleware, Runtime, Data, Apps",
              "providerManages": "Virtualization, Servers, Storage, Networking",
              "primaryAnalogy": "Renting an unfurnished apartment"
            },
            {
              "model": "PaaS",
              "customerManages": "Applications and Data",
              "providerManages": "OS, Runtime, Middleware, Servers, Storage",
              "primaryAnalogy": "Renting a furnished office space"
            },
            {
              "model": "SaaS",
              "customerManages": "User access credentials and configurations",
              "providerManages": "Entire application, data storage, servers, patches",
              "primaryAnalogy": "Dining at a restaurant"
            }
          ]
        }
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "Network Protocol",
      "summary": "Standardized rules used by devices to communicate across networks."
    },
    {
      "topic": "IaaS",
      "summary": "Infrastructure as a Service (virtual machines, storage, networking)."
    },
    {
      "topic": "PaaS",
      "summary": "Platform as a Service (managed runtime and application deployment environments)."
    },
    {
      "topic": "SaaS",
      "summary": "Software as a Service (fully managed end-user applications over the web)."
    }
  ],
  "rememberPoints": [
    "Protocol \u2192 Rules for communication",
    "IaaS = Rent Hardware | PaaS = Rent Platform | SaaS = Rent Application"
  ],
  "examQuestions": [
    {
      "question": "Compare IaaS, PaaS, and SaaS across operational responsibility and security maintenance.",
      "answerGuidance": "Highlight that in IaaS the customer must manage the OS, patch software, and configure firewalls; in PaaS the vendor manages OS/runtime while customer manages application code; in SaaS the vendor manages everything except access policies and data inputs."
    },
    {
      "question": "Why are clear-text protocols like HTTP, Telnet, and FTP prohibited in secure enterprise architectures?",
      "answerGuidance": "Explain that clear-text protocols transmit credentials and payloads unencrypted, leaving them completely vulnerable to network sniffing, packet interception, and Man-in-the-Middle (MitM) attacks."
    }
  ],
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
          "requiredTools": [
              "tcpdump",
              "curl",
              "python3"
          ],
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
};
