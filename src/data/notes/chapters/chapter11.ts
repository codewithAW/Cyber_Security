import type { Chapter } from '../types';

export const chapter011: Chapter = {
  "id": "chapter-11",
  "number": 11,
  "romanNumeral": "XI",
  "title": "Network Layer Security",
  "subtitle": "IPsec Architecture, Tunnel vs Transport Modes, and Virtual Private Networks",
  "category": "Network & Cloud Security",
  "readTime": "5 min read",
  "summary": "Focuses on securing traffic at Layer 3 of the OSI model using IPsec protocols (AH and ESP) and constructing Virtual Private Networks (VPNs).",
  "introParagraphs": [
    "Network Layer Security protects communication at the network layer (Layer 3 of the OSI model).",
    "While TLS secures specific application sockets (such as browser HTTPS), Network Layer Security protects all IP packets passing between devices or networks regardless of what applications generated them."
  ],
  "topics": [
    {
      "id": "topic-11-1",
      "number": "11.1",
      "title": "Introduction to Network Layer Security",
      "content": [
        "Network Layer Security operates directly on Internet Protocol (IP) datagrams.",
        "A common and universally supported technology is IPsec (Internet Protocol Security).",
        "IPsec \u2192 Protects IP communication."
      ],
      "definitions": [
        {
          "term": "Network Layer Security",
          "definition": "Security mechanisms operating at Layer 3 of the network stack to authenticate and encrypt IP packet streams transparently to user applications.",
          "keyTakeaway": "IPsec \u2192 Protects IP communication."
        }
      ]
    },
    {
      "id": "topic-11-2",
      "number": "11.2",
      "title": "IPsec (Internet Protocol Security)",
      "content": [
        "IPsec is a suite of cryptographic protocols used to secure IP communications by authenticating and encrypting each IP packet of a communication session.",
        "It provides three vital guarantees: Authentication, Integrity, and Confidentiality.",
        "IPsec is commonly used to establish Virtual Private Networks (VPNs) connecting remote branches or teleworkers to enterprise intranets."
      ],
      "definitions": [
        {
          "term": "IPsec",
          "definition": "A suite of open standards developed by the IETF that secures Internet Protocol communications at the network layer through cryptography.",
          "keyTakeaway": "Provides Authentication, Integrity, and Confidentiality for IP packets."
        }
      ],
      "examples": [
        {
          "title": "IPsec Protocol Suite Components",
          "scenario": "The primary sub-protocols of the IPsec architecture:",
          "breakdown": [
            {
              "label": "AH (Authentication Header)",
              "detail": "Provides data integrity and origin authentication for IP packets, but does NOT encrypt payload."
            },
            {
              "label": "ESP (Encapsulating Security Payload)",
              "detail": "Provides confidentiality via encryption, along with origin authentication and integrity."
            },
            {
              "label": "IKE (Internet Key Exchange)",
              "detail": "Automates security association (SA) parameter negotiation and shared key generation."
            }
          ]
        }
      ]
    },
    {
      "id": "topic-11-3",
      "number": "11.3",
      "title": "Virtual Private Networks (VPNs)",
      "content": [
        "A Virtual Private Network (VPN) creates an encrypted, protected communication connection (tunnel) over an untrusted public network like the internet.",
        "VPN \u2192 Creates a secure connection over an untrusted/public network."
      ],
      "diagrams": [
        {
          "title": "Site-to-Site IPsec VPN Gateway Flow",
          "caption": "How IPsec encapsulates and shields private packets traversing public routers.",
          "orientation": "horizontal",
          "steps": [
            {
              "label": "Device A (Private LAN)",
              "sublabel": "192.168.1.50 cleartext packet"
            },
            {
              "label": "Branch VPN Gateway",
              "sublabel": "IPsec encryption & tunnel encapsulation",
              "highlight": true
            },
            {
              "label": "Untrusted Public Internet",
              "sublabel": "Encrypted ciphertext packet stream"
            },
            {
              "label": "HQ VPN Gateway",
              "sublabel": "IPsec decapsulation & authenticity check",
              "highlight": true
            },
            {
              "label": "Device B (HQ Server)",
              "sublabel": "Delivers cleartext packet inside HQ LAN"
            }
          ]
        }
      ],
      "keyPoints": [
        "Transport Mode encrypts only the IP packet payload, keeping original IP headers intact.",
        "Tunnel Mode encrypts the entire original IP packet (header and payload) inside a new outer IP header; this mode is used for VPN tunnels."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "Network Layer Security",
      "summary": "Protects communication at the IP routing layer (OSI Layer 3)."
    },
    {
      "topic": "IPsec",
      "summary": "Suite of cryptographic protocols providing authentication, integrity, and encryption for IP."
    },
    {
      "topic": "VPN",
      "summary": "Creates a protected, encrypted connection over untrusted public networks."
    },
    {
      "topic": "Tunnel Mode",
      "summary": "Encapsulates entire original IP packet inside a new outer IP header for secure transit."
    }
  ],
  "rememberPoints": [
    "IPsec \u2192 Protects IP communication",
    "VPN \u2192 Creates a secure connection over untrusted public networks"
  ],
  "examQuestions": [
    {
      "question": "Differentiate between IPsec Transport Mode and IPsec Tunnel Mode.",
      "answerGuidance": "In Transport Mode, only the IP payload is encrypted while the original IP header remains visible (used for host-to-host). In Tunnel Mode, the entire original IP packet (header + payload) is encrypted and placed inside a brand new IP packet with a new header (used for gateway-to-gateway VPN tunnels)."
    },
    {
      "question": "Compare the roles of AH (Authentication Header) and ESP (Encapsulating Security Payload) in IPsec.",
      "answerGuidance": "AH provides integrity and origin authentication without encryption (data remains readable); ESP provides confidentiality (encryption) along with optional authentication and integrity."
    }
  ],
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
          "requiredTools": [
              "ip",
              "arp",
              "ping",
              "python3"
          ],
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
};
