import type { Chapter } from '../types';

export const chapter12: Chapter = {
  "id": "chapter-12",
  "number": 12,
  "romanNumeral": "XII",
  "title": "Wireless Security",
  "subtitle": "Wi-Fi Encryption Protocols, 802.11 Standards, and Access Point Hardening",
  "category": "Network & Cloud Security",
  "readTime": "5 min read",
  "summary": "Details wireless local area network security, examining the evolution from legacy WEP to modern WPA3 encryption alongside essential AP hardening practices.",
  "introParagraphs": [
    "Wireless Security protects wireless networks from unauthorized access and airborne radio-frequency attacks.",
    "Unlike wired Ethernet cables bounded by physical walls, Wi-Fi radio signals broadcast indiscriminately through building walls and open streets, making robust cryptographic authentication essential."
  ],
  "topics": [
    {
      "id": "topic-12-1",
      "number": "12.1",
      "title": "Introduction to Wireless Security",
      "content": [
        "Wireless Security protects wireless networks and radio frequency communications from unauthorized access, eavesdropping, and tampering.",
        "Wireless networks predominantly utilize IEEE 802.11 standards, commonly known as Wi-Fi."
      ],
      "definitions": [
        {
          "term": "Wireless Security",
          "definition": "The prevention of unauthorized access or damage to computers or data using wireless radio frequency networks.",
          "keyTakeaway": "Wireless Security \u2192 Protects Wi-Fi networks and wireless communication."
        }
      ]
    },
    {
      "id": "topic-12-2",
      "number": "12.2",
      "title": "Common Wireless Security Standards",
      "content": [
        "Wi-Fi security protocols have evolved over decades to replace broken cryptographic algorithms with robust modern standards."
      ],
      "definitions": [
        {
          "term": "WPA (Wi-Fi Protected Access)",
          "definition": "A security standard created by the Wi-Fi Alliance to replace the obsolete and cryptographically broken WEP protocol.",
          "keyTakeaway": "WPA \u2192 Wi-Fi Protected Access."
        },
        {
          "term": "WPA2",
          "definition": "The standard introducing mandatory AES-CCMP encryption and 4-way handshakes, serving as the industry baseline since 2004.",
          "keyTakeaway": "WPA2 uses AES encryption."
        },
        {
          "term": "WPA3",
          "definition": "The modern standard featuring Simultaneous Authentication of Equals (SAE) resistant to offline dictionary attacks and 192-bit enterprise security.",
          "keyTakeaway": "WPA3 provides stronger security than older wireless methods."
        }
      ],
      "tables": [
        {
          "title": "Evolution of Wi-Fi Security Protocols",
          "columns": [
            {
              "key": "standard",
              "header": "Standard"
            },
            {
              "key": "cipher",
              "header": "Encryption Cipher"
            },
            {
              "key": "keyExchange",
              "header": "Key Exchange Method"
            },
            {
              "key": "securityStatus",
              "header": "Current Security Status"
            }
          ],
          "rows": [
            {
              "standard": "WEP",
              "cipher": "RC4 (Broken)",
              "keyExchange": "Static 24-bit IV",
              "securityStatus": "Deprecated; cracked in minutes"
            },
            {
              "standard": "WPA",
              "cipher": "TKIP",
              "keyExchange": "Per-packet 4-way handshake",
              "securityStatus": "Deprecated; vulnerable to replay attacks"
            },
            {
              "standard": "WPA2",
              "cipher": "AES-CCMP",
              "keyExchange": "4-Way Handshake (PSK)",
              "securityStatus": "Acceptable baseline; vulnerable to KRACK offline attacks"
            },
            {
              "standard": "WPA3",
              "cipher": "AES-GCM / 192-bit CNSA",
              "keyExchange": "SAE (Dragonfly Handshake)",
              "securityStatus": "Recommended modern gold standard"
            }
          ]
        }
      ]
    },
    {
      "id": "topic-12-3",
      "number": "12.3",
      "title": "Wireless Security Best Practices",
      "content": [
        "Securing wireless environments requires both selecting modern protocol versions and configuring administrative access point controls properly."
      ],
      "examples": [
        {
          "title": "Essential Wi-Fi Hardening Checklist",
          "scenario": "Hardening corporate and home Wi-Fi routers:",
          "breakdown": [
            {
              "label": "Use WPA2 or WPA3",
              "detail": "Disable legacy WEP and TKIP protocols completely on all access points."
            },
            {
              "label": "Strong Passphrases",
              "detail": "Use passphrases with high entropy (20+ characters) to defeat dictionary brute forcing."
            },
            {
              "label": "Change Default Admin Credentials",
              "detail": "Immediately change factory admin logins (e.g. admin/admin) on router management interfaces."
            },
            {
              "label": "Keep Router Firmware Updated",
              "detail": "Regularly patch router firmware to mitigate known zero-day exploits and buffer overflows."
            },
            {
              "label": "Separate Guest Network",
              "detail": "Isolate visitor smartphones and IoT devices onto a separate VLAN isolated from corporate subnets."
            }
          ]
        }
      ],
      "keyPoints": [
        "WPA3 DragonFly handshake completely eliminates offline dictionary wordlist attacks on captured handshakes.",
        "Always disable WPS (Wi-Fi Protected Setup) as its PIN mechanism is trivially brute-forced."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "Wireless Security",
      "summary": "Protects wireless local area networks from airborne radio eavesdropping and rogue access."
    },
    {
      "topic": "WPA Standards",
      "summary": "WPA (legacy), WPA2 (AES baseline), WPA3 (modern standard with SAE resistance)."
    },
    {
      "topic": "Best Practices",
      "summary": "Enforce WPA3/WPA2, use strong passphrases, change default router logins, update firmware, and isolate guest VLANs."
    }
  ],
  "rememberPoints": [
    "WPA \u2192 Wi-Fi Protected Access",
    "WPA3 \u2192 Stronger modern Wi-Fi security (SAE Handshake prevents offline cracking)"
  ],
  "examQuestions": [
    {
      "question": "Trace the evolution of Wi-Fi security from WEP to WPA3 and explain why WPA3 is superior.",
      "answerGuidance": "Discuss WEP weak RC4 IV collisions, WPA TKIP transitional band-aid, WPA2 AES-CCMP introduction, and WPA3 Simultaneous Authentication of Equals (SAE) which prevents offline dictionary guessing even when weak passwords are used."
    },
    {
      "question": "What is a Rogue Access Point (Evil Twin) attack and what controls prevent it in enterprise wireless networks?",
      "answerGuidance": "Explain how an attacker deploys an AP with an identical SSID to trick victim devices into connecting and routing traffic through the attacker. Prevent using 802.1X EAP-TLS with mutual certificate validation and Wireless Intrusion Prevention Systems (WIPS)."
    }
  ],
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
                  "technicalDetail": "The attacker runs dnsmasq to spoof all DNS queries to the attacker's IP, presenting a fake 'Router Firmware Update \u2014 Enter Wi-Fi Password' portal.",
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
          "requiredTools": [
              "iw",
              "iwlist",
              "openssl",
              "python3"
          ],
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
};
