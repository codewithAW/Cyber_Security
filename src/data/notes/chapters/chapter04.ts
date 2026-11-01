import type { Chapter } from '../types';

export const chapter04: Chapter = {
  "id": "chapter-04",
  "number": 4,
  "romanNumeral": "IV",
  "title": "Server-Side Web Application Attacks",
  "subtitle": "Back-End Threat Surfaces, Processing Vulnerabilities, and Defensive Hardening",
  "category": "Web Security",
  "readTime": "5 min read",
  "summary": "Explores attacks that target the server infrastructure hosting web applications, unvalidated user input vectors, and foundational backend hardening principles.",
  "introParagraphs": [
    "A server-side attack targets the web application or server rather than only the user's browser.",
    "Web applications frequently receive, parse, and process external data supplied by remote clients. If the application server fails to sanitize or strictly validate this input, attackers can force the server to execute malicious commands or disclose backend data."
  ],
  "topics": [
    {
      "id": "topic-4-1",
      "number": "4.1",
      "title": "Introduction to Server-Side Attacks",
      "content": [
        "A server-side attack targets the web application backend or host server rather than only the client browser.",
        "Web applications often receive data from users. If the application does not properly validate or process this data, attackers may exploit it.",
        "Server-Side Attack \u2192 Targets the application or server."
      ],
      "definitions": [
        {
          "term": "Server-Side Attack",
          "definition": "A cyber attack directed against web servers, databases, or application logic behind a website or API.",
          "keyTakeaway": "Server-Side Attack \u2192 Targets the application or server."
        }
      ]
    },
    {
      "id": "topic-4-2",
      "number": "4.2",
      "title": "Common Server-Side Attacks",
      "content": [
        "Server-side vulnerabilities typically arise from trusting user-controlled inputs when constructing database queries, system commands, or backend network requests.",
        "These attacks may allow attackers to access data, execute unauthorized actions, or affect the server."
      ],
      "examples": [
        {
          "title": "Primary Server-Side Attack Vectors",
          "scenario": "High-impact attacks targeting web application backends:",
          "breakdown": [
            {
              "label": "SQL Injection (SQLi)",
              "detail": "Manipulates database queries to extract or destroy underlying tables."
            },
            {
              "label": "Authentication Attacks",
              "detail": "Bypasses login controls via brute force, session hijacking, or credential stuffing."
            },
            {
              "label": "Command Injection",
              "detail": "Passes malicious operating system commands to server shell execution functions."
            },
            {
              "label": "SSRF (Server-Side Request Forgery)",
              "detail": "Forces the application server to make unauthorized internal network requests."
            }
          ],
          "outcome": "Can lead to complete server takeover, lateral network traversal, and catastrophic data breaches."
        }
      ],
      "keyPoints": [
        "Attacks exploit the backend server privileges and internal network reach.",
        "Often targeted through public HTTP GET/POST parameters, headers, or cookies."
      ]
    },
    {
      "id": "topic-4-3",
      "number": "4.3",
      "title": "Basic Server-Side Protection",
      "content": [
        "Web applications can be systematically protected by enforcing strict defense-in-depth across the application and host layers.",
        "The primary defensive rule in web engineering is: never trust user-supplied input."
      ],
      "definitions": [
        {
          "term": "Input Validation",
          "definition": "The defensive programming practice of ensuring input data conforms to expected formats, lengths, and character sets before processing.",
          "keyTakeaway": "Secure Input \u2192 Secure Application."
        }
      ],
      "examples": [
        {
          "title": "Core Server-Side Defensive Controls",
          "scenario": "How security engineers harden web applications:",
          "breakdown": [
            {
              "label": "Validating Input",
              "detail": "Whitelist expected characters, lengths, and datatypes on all incoming requests."
            },
            {
              "label": "Secure Authentication",
              "detail": "Enforce MFA, secure hashing (bcrypt/Argon2), and rate-limiting on login endpoints."
            },
            {
              "label": "Applying Least Privilege",
              "detail": "Run application services and database connections with minimal necessary permissions."
            },
            {
              "label": "Keeping Software Updated",
              "detail": "Promptly patch web servers, runtimes, database drivers, and frameworks."
            },
            {
              "label": "Secure Coding Practices",
              "detail": "Use established frameworks, parameterized query builders, and avoid shell execution."
            }
          ]
        }
      ],
      "keyPoints": [
        "Never trust client-side validation alone; always re-validate rigorously on the server.",
        "Least privilege limits the damage an attacker can inflict if an exploit succeeds."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "Server-Side Attack",
      "summary": "An attack that targets a web application backend or host server."
    },
    {
      "topic": "Common Attacks",
      "summary": "SQL Injection, Command Injection, Authentication attacks, and SSRF."
    },
    {
      "topic": "Defensive Controls",
      "summary": "Input validation, secure authentication, least privilege, updates, and secure coding."
    }
  ],
  "rememberPoints": [
    "Secure Input \u2192 Secure Application",
    "Never rely solely on client-side browser checks; enforce all validation on the server."
  ],
  "examQuestions": [
    {
      "question": "What distinguishes a server-side attack from a client-side attack?",
      "answerGuidance": "Server-side attacks target the web server, application code, or database directly (e.g. SQLi, SSRF, command injection), compromising backend data and infrastructure. Client-side attacks target the end-user browser (e.g. XSS, CSRF)."
    },
    {
      "question": "List and explain four essential server-side protection strategies.",
      "answerGuidance": "Discuss strict server-side input validation, least privilege database/OS account design, robust authentication with rate-limiting, and comprehensive patch management."
    }
  ],
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
          "requiredTools": [
              "ufw",
              "iptables",
              "nc",
              "curl"
          ],
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
};
