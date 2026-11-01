import type { MasterQuickRevisionItem, CoreRuleItem } from './types';

export const MASTER_QUICK_REVISION_TABLE: MasterQuickRevisionItem[] = [
  {
    "topic": "Cyber Security",
    "simpleMeaning": "Protects computers, networks, and data from unauthorized harm, attacks, or theft.",
    "chapterNumber": 1,
    "chapterId": "chapter-01"
  },
  {
    "topic": "CIA Triad",
    "simpleMeaning": "Confidentiality, Integrity, and Availability \u2014 the foundational pillars of information security.",
    "chapterNumber": 1,
    "chapterId": "chapter-01"
  },
  {
    "topic": "Threat, Vulnerability & Attack",
    "simpleMeaning": "Threat is potential danger; Vulnerability is system weakness; Attack is exploitation of weakness.",
    "chapterNumber": 1,
    "chapterId": "chapter-01"
  },
  {
    "topic": "Asset",
    "simpleMeaning": "Anything valuable belonging to an entity that requires protection (data, systems, people).",
    "chapterNumber": 2,
    "chapterId": "chapter-02"
  },
  {
    "topic": "Authentication (AuthN)",
    "simpleMeaning": "Verifies the identity of a user or system entity (Who are you?).",
    "chapterNumber": 2,
    "chapterId": "chapter-02"
  },
  {
    "topic": "Authorization (AuthZ)",
    "simpleMeaning": "Determines what permissions an authenticated identity holds (What can you do?).",
    "chapterNumber": 2,
    "chapterId": "chapter-02"
  },
  {
    "topic": "Encryption & Decryption",
    "simpleMeaning": "Converts readable plaintext into unreadable ciphertext and back using cryptographic keys.",
    "chapterNumber": 2,
    "chapterId": "chapter-02"
  },
  {
    "topic": "Malware",
    "simpleMeaning": "Malicious software engineered to damage, disrupt, or exploit computer systems.",
    "chapterNumber": 2,
    "chapterId": "chapter-02"
  },
  {
    "topic": "Computer Virus",
    "simpleMeaning": "Malware that attaches to host files/programs and propagates upon human execution.",
    "chapterNumber": 3,
    "chapterId": "chapter-03"
  },
  {
    "topic": "Network Worm",
    "simpleMeaning": "Malware that replicates and spreads automatically across networks without user action.",
    "chapterNumber": 3,
    "chapterId": "chapter-03"
  },
  {
    "topic": "Trojan Horse",
    "simpleMeaning": "Malware disguised as legitimate or useful software that conceals malicious backdoors.",
    "chapterNumber": 3,
    "chapterId": "chapter-03"
  },
  {
    "topic": "Ransomware",
    "simpleMeaning": "Malware that locks or encrypts files/systems and extorts cryptocurrency payments.",
    "chapterNumber": 3,
    "chapterId": "chapter-03"
  },
  {
    "topic": "Spyware",
    "simpleMeaning": "Malware that secretly monitors user activities, logs keystrokes, and steals sensitive data.",
    "chapterNumber": 3,
    "chapterId": "chapter-03"
  },
  {
    "topic": "Server-Side Attacks",
    "simpleMeaning": "Attacks targeting backend servers, unvalidated inputs, APIs, and databases.",
    "chapterNumber": 4,
    "chapterId": "chapter-04"
  },
  {
    "topic": "Cross-Site Scripting (XSS)",
    "simpleMeaning": "Injects malicious script into trusted pages to execute inside another user's browser.",
    "chapterNumber": 5,
    "chapterId": "chapter-05"
  },
  {
    "topic": "SQL Injection (SQLi)",
    "simpleMeaning": "Manipulates database queries through malicious input to read, modify, or drop tables.",
    "chapterNumber": 6,
    "chapterId": "chapter-06"
  },
  {
    "topic": "CSRF",
    "simpleMeaning": "Tricks an authenticated user's browser into sending unauthorized requests to a web app.",
    "chapterNumber": 7,
    "chapterId": "chapter-07"
  },
  {
    "topic": "Security Planning & Policy",
    "simpleMeaning": "Defines how organizations govern risk, enforce security rules, and deploy protective controls.",
    "chapterNumber": 8,
    "chapterId": "chapter-08"
  },
  {
    "topic": "Risk Equation",
    "simpleMeaning": "The possibility of loss resulting from threats exploiting vulnerabilities (Threat + Vulnerability = Risk).",
    "chapterNumber": 8,
    "chapterId": "chapter-08"
  },
  {
    "topic": "Network Protocols",
    "simpleMeaning": "Standard rules for communication across networks (HTTP, DNS, TCP, IP).",
    "chapterNumber": 9,
    "chapterId": "chapter-09"
  },
  {
    "topic": "Cloud Service Models",
    "simpleMeaning": "IaaS (infrastructure), PaaS (platform), and SaaS (software) delivery frameworks.",
    "chapterNumber": 9,
    "chapterId": "chapter-09"
  },
  {
    "topic": "TLS & HTTPS",
    "simpleMeaning": "Transport Layer Security providing confidentiality, integrity, and authentication for web traffic.",
    "chapterNumber": 10,
    "chapterId": "chapter-10"
  },
  {
    "topic": "Network Layer Security & IPsec",
    "simpleMeaning": "Protects IP packet communications and establishes Virtual Private Networks (VPNs).",
    "chapterNumber": 11,
    "chapterId": "chapter-11"
  },
  {
    "topic": "Wireless Security & WPA3",
    "simpleMeaning": "Protects Wi-Fi networks from eavesdropping using modern SAE cryptographic handshakes.",
    "chapterNumber": 12,
    "chapterId": "chapter-12"
  },
  {
    "topic": "Cloud Security & Shared Responsibility",
    "simpleMeaning": "Provider secures underlying hardware and facilities; Customer secures data, OS, and IAM.",
    "chapterNumber": 13,
    "chapterId": "chapter-13"
  },
  {
    "topic": "IoT Security",
    "simpleMeaning": "Protects smart connected devices, firmware, networks, and telemetry data via multi-layer defense.",
    "chapterNumber": 14,
    "chapterId": "chapter-14"
  }
];

export const CORE_RULES_CHEAT_SHEET: CoreRuleItem[] = [
  {
    "title": "The CIA Triad",
    "formula": [
      "Confidentiality (Privacy)",
      "Integrity (Accuracy)",
      "Availability (Accessibility)"
    ],
    "explanation": "The three mandatory security pillars that govern all information protection decisions."
  },
  {
    "title": "Identity & Access Verification",
    "formula": [
      "Authentication \u2192 Who are you?",
      "Authorization \u2192 What can you do?"
    ],
    "explanation": "Authentication verifies claimed identity; Authorization determines permitted privileges. Always authenticate before authorizing."
  },
  {
    "title": "The Risk Management Pipeline",
    "formula": [
      "Asset \u2192 What we protect",
      "Threat \u2192 What can cause harm",
      "Vulnerability \u2192 Weakness in system",
      "Risk \u2192 Possible loss / probability",
      "Control \u2192 Protection mechanism"
    ],
    "explanation": "Threats exploit vulnerabilities to manifest risk. Controls mitigate vulnerabilities and dampen impact."
  },
  {
    "title": "Core Web Exploitation Triad",
    "formula": [
      "XSS \u2192 Attacks the user's browser (Client-side)",
      "SQL Injection \u2192 Attacks database queries (Server-side)",
      "CSRF \u2192 Tricks an authenticated user's session"
    ],
    "explanation": "XSS exploits user trust in an app; SQLi exploits backend query logic; CSRF exploits app trust in a user's browser session."
  },
  {
    "title": "Network Cryptographic Hierarchy",
    "formula": [
      "TLS \u2192 Secure application communication (Port 443 / HTTPS)",
      "IPsec \u2192 Secure IP packet communication (Layer 3)",
      "VPN \u2192 Protected network connection over untrusted public networks"
    ],
    "explanation": "Different cryptographic layers protect different scopes of network communication."
  },
  {
    "title": "Modern Wireless Defense",
    "formula": [
      "WPA3 \u2192 Stronger modern Wi-Fi security (SAE Handshake prevents offline cracking)"
    ],
    "explanation": "Simultaneous Authentication of Equals completely prevents offline dictionary attacks on Wi-Fi passphrases."
  },
  {
    "title": "Cloud Security Formula",
    "formula": [
      "Cloud Provider (Facilities/Hardware) + Customer (Data/IAM/OS) = Cloud Security"
    ],
    "explanation": "The Shared Responsibility Model mandates joint defense based on the cloud service model."
  },
  {
    "title": "IoT Security Defense Equation",
    "formula": [
      "IoT Security \u2192 Device + Software + Network + Data"
    ],
    "explanation": "Comprehensive IoT security requires hardening hardware pins, signing firmware, isolating VLANs, and encrypting telemetry."
  }
];
