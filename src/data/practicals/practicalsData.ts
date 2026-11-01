import type { PracticalExercise } from './types';

export const ALL_PRACTICALS: PracticalExercise[] = [
  // CHAPTER 01: BASIC CYBER SECURITY CONCEPTS
  {
    id: 'password-security-lab',
    slug: 'password-security',
    title: 'Password Entropy, Hashing & Cracking Lab',
    chapterNumber: 1,
    chapterId: 'chapter-01',
    chapterSlug: 'chapter-1',
    chapterTitle: 'Basic Cyber Security Concepts',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    icon: 'key',
    summary: 'Analyze password strength mathematically, simulate a dictionary attack against insecure hashes, and understand how cryptographic salting thwarts rainbow tables.',
    learningObjectives: [
      'Calculate password entropy bits based on character sets and length',
      'Simulate a dictionary cracking attack against an MD5/SHA-256 hash',
      'Observe how bcrypt salting produces unique hashes for identical passwords',
      'Formulate password complexity and passphrase policies for enterprise systems',
    ],
    scenario:
      'You are auditing an internal authentication service. The database dump reveals legacy user records with un-salted hashes. Your task is to analyze candidate passwords, run a dictionary attack benchmark, and verify the defense provided by modern adaptive salted hashing algorithms.',
    toolsAndConcepts: ['Entropy Formula (E = L * log2(R))', 'Dictionary Attack Simulator', 'Bcrypt Salt Generator', 'Rainbow Table Prevention'],
    steps: [
      {
        id: 'pwd-step-1',
        stepNumber: 1,
        title: 'Evaluate Password Entropy',
        instruction: 'Type different sample passwords into the analyzer (e.g., "password", "P@ssw0rd2026", "correct-horse-battery-staple") and observe how character pool size (R) and length (L) change brute-force resistance.',
        expectedResult: 'Passphrases exceeding 16 characters achieve over 80 bits of entropy, rendering offline guessing computationally infeasible.',
      },
      {
        id: 'pwd-step-2',
        stepNumber: 2,
        title: 'Execute Dictionary Attack on Insecure Hash',
        instruction: 'Select target hash "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" (SHA-256 of "password") and click "Launch Dictionary Attack".',
        expectedResult: 'The simulated cracking engine finds the collision within milliseconds because the word is present in standard wordlists.',
      },
      {
        id: 'pwd-step-3',
        stepNumber: 3,
        title: 'Test Salted Bcrypt Generation',
        instruction: 'Enter identical passwords into the Bcrypt Salt Visualizer and generate hashes. Observe that each generation creates completely distinct ciphertexts.',
        expectedResult: 'Even with identical input passwords, random 128-bit salts prevent precomputed rainbow table lookups.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'Entropy Calculation',
        content: 'Entropy measures randomness. Each character from a 94-character set provides ~6.55 bits of entropy. Length matters exponentially more than character substitution.',
      },
      {
        tier: 2,
        title: 'Dictionary Flaws',
        content: 'Cryptographic hash functions like SHA-256 are fast. Attackers can test billions of hashes per second using GPUs, cracking dictionary words in under a second.',
      },
      {
        tier: 3,
        title: 'Salting Defense',
        content: 'Salting appends a unique random string to each password before hashing. Bcrypt also includes an adjustable cost factor to slow down brute-force hardware.',
      },
    ],
    solution: {
      answer: 'Use salted, slow cryptographic key derivation functions (Argon2id or Bcrypt with work factor >= 12) and encourage multi-word passphrases over complex short passwords.',
      detailedExplanation:
        'Fast hash functions are designed for data integrity, not password storage. When an attacker gains access to un-salted hashes, precomputed rainbow tables crack common words almost instantaneously. Combining random 128-bit salts with slow, memory-hard hashing (Argon2id/Bcrypt) neutralizes dictionary tools.',
      codeSnippet: {
        language: 'python',
        filename: 'secure_password_storage.py',
        code: `import bcrypt\n\n# Hash a password with automatic random salt (cost factor 12)\npassword = b"correct-horse-battery-staple"\nsalt = bcrypt.gensalt(rounds=12)\nhashed = bcrypt.hashpw(password, salt)\n\n# Verification takes ~250ms per attempt to throttle brute force\nis_valid = bcrypt.checkpw(b"correct-horse-battery-staple", hashed)\nprint(f"Password Valid: {is_valid}")`,
      },
    },
    whatHappened:
      'The lab simulated real-world dictionary matching against an unsalted SHA-256 digest, followed by generating salted Bcrypt strings with embedded cost parameters.',
    vulnerabilityExplanation:
      'Unsalted password hashing allows attackers to perform bulk parallel lookups against precomputed dictionaries.',
    detectionMethods: [
      'Audit database schemas for columns storing plaintext or MD5/SHA-1 digests',
      'Run John the Ripper or Hashcat in audit mode against internal password hashes',
      'Monitor authentication endpoints for high-velocity login failure spikes',
    ],
    preventionAndMitigation: [
      'Store all credentials using Argon2id or Bcrypt with an appropriate work factor (cost >= 12)',
      'Enforce minimum length of 12-16 characters and check against breached password lists',
      'Implement Multi-Factor Authentication (MFA)',
    ],
    knowledgeCheck: {
      question: 'Why does adding a unique random salt to each password before hashing prevent rainbow table attacks?',
      options: [
        'It encrypts the password with a secret symmetric key',
        'It forces attackers to recompute the entire rainbow table specifically for each individual user',
        'It shortens the length of the hashed string',
        'It hides the hash from the database administrator',
      ],
      correctIndex: 1,
      explanation:
        'Rainbow tables rely on precomputing hash values for common passwords. Because each user has a unique random salt, an attacker cannot reuse a single table across multiple accounts.',
    },
    simulationType: 'password-cracking',
    badgeAwarded: {
      id: 'badge-pwd-master',
      name: 'Entropy Sentinel',
      description: 'Mastered password entropy mathematics and salted hashing defense.',
      icon: '🛡️',
    },
  },

  // CHAPTER 02: CYBER SECURITY TERMINOLOGY
  {
    id: 'idor-authorization-lab',
    slug: 'idor-authorization',
    title: 'Insecure Direct Object Reference (IDOR) Lab',
    chapterNumber: 2,
    chapterId: 'chapter-02',
    chapterSlug: 'chapter-2',
    chapterTitle: 'Cyber Security Terminology',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    icon: 'user-check',
    summary: 'Exploit a flawed REST API endpoint that exposes patient records by manipulating object identifiers, then refactor the endpoint to enforce tenant-scoped authorization checks.',
    learningObjectives: [
      'Understand how Insecure Direct Object References violate the Principle of Least Privilege',
      'Manipulate URL and JSON parameters to access unauthorized records',
      'Contrast direct database identifier lookups with session-scoped authorization checks',
      'Implement role-based and ownership-based access control filters',
    ],
    scenario:
      'You are testing "HealthSync Portal", a healthcare application. You are logged in as Patient "Alice" (Account ID: 1042). The application fetches your medical history using `GET /api/v1/records/1042`. Discover whether the backend properly verifies if the requesting session owns the requested medical file.',
    toolsAndConcepts: ['IDOR Vulnerability', 'REST API Request Inspector', 'Session Token Binding', 'Tenant Isolation'],
    steps: [
      {
        id: 'idor-step-1',
        stepNumber: 1,
        title: 'Fetch Authorized Record',
        instruction: 'Click "Fetch My Record" to request `/api/v1/records/1042`. Observe your legitimate patient file and the status code 200 OK.',
        expectedResult: 'Patient file for Alice is returned safely.',
      },
      {
        id: 'idor-step-2',
        stepNumber: 2,
        title: 'Tamper with Object Identifier',
        instruction: 'Change the Record ID in the API request box from `1042` to `1043` (Bob) and click "Send Tampered Request".',
        expectedResult: 'In Vulnerable Mode, the server returns Bob\'s sensitive private medical records without verifying session ownership!',
      },
      {
        id: 'idor-step-3',
        stepNumber: 3,
        title: 'Activate Secure Session Enforcement',
        instruction: 'Toggle "Secure Application Mode" and resend the tampered request `GET /api/v1/records/1043`.',
        expectedResult: 'The secure server validates `record.userId === req.session.userId` and responds with 403 Forbidden.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'Parameter Tampering',
        content: 'Look at the request parameters. If the system relies solely on the client-supplied ID without verifying the caller\'s identity token, you can request any record by changing the number.',
      },
      {
        tier: 2,
        title: 'The Missing Check',
        content: 'The vulnerable query executes `SELECT * FROM medical_records WHERE id = req.params.id`. It lacks a condition that binds the query to the authenticated session user.',
      },
      {
        tier: 3,
        title: 'Secure Query Architecture',
        content: 'To fix IDOR, query with both the record ID AND the session user ID: `WHERE id = ? AND user_id = ?`.',
      },
    ],
    solution: {
      answer: 'Always validate object ownership server-side using the verified session identity before querying or returning sensitive entity data.',
      detailedExplanation:
        'IDOR vulnerabilities occur when an application exposes a reference to an internal implementation object without validating that the authenticated client has permission to access that specific object.',
      codeSnippet: {
        language: 'javascript',
        filename: 'secure_controller.js',
        code: `app.get('/api/v1/records/:id', authenticateSession, async (req, res) => {\n  const recordId = req.params.id;\n  const loggedInUserId = req.session.userId;\n  const record = await db.query('SELECT * FROM medical_records WHERE id = ? AND patient_id = ?', [recordId, loggedInUserId]);\n  if (!record) return res.status(404).json({ error: 'Not found or denied.' });\n  return res.json(record);\n});`,
      },
    },
    whatHappened:
      'The simulated API endpoint blindly trusted client-supplied identifiers without matching them against session tokens.',
    vulnerabilityExplanation:
      'Insecure Direct Object Reference enables horizontal and vertical privilege escalation simply by iterating numerical resource identifiers.',
    detectionMethods: [
      'Automated dynamic application security testing (DAST) with multi-user matrix',
      'Code reviews searching for direct SQL/ORM findById calls that omit session filtering',
    ],
    preventionAndMitigation: [
      'Bind all object queries to the authenticated session identity',
      'Use indirect reference maps or non-guessable UUIDv4 identifiers',
    ],
    knowledgeCheck: {
      question: 'Which of the following is the most robust defense against IDOR vulnerabilities?',
      options: [
        'Hiding the ID input field in the frontend HTML form',
        'Server-side validation that the authenticated user owns or has permission for the requested object',
        'Encoding the ID parameter in Base64',
        'Encrypting the frontend JavaScript bundle',
      ],
      correctIndex: 1,
      explanation:
        'The only robust defense is server-side authorization enforcement verifying that the caller\'s session has permissions for the resource.',
    },
    simulationType: 'idor',
    badgeAwarded: {
      id: 'badge-idor-shield',
      name: 'Access Controller',
      description: 'Defeated Insecure Direct Object References and enforced strict tenant isolation.',
      icon: '🛡️',
    },
  },

  // CHAPTER 03: CYBER SECURITY VULNERABILITIES
  {
    id: 'sql-injection-lab',
    slug: 'sql-injection',
    title: 'SQL Injection Authentication Bypass & Parameterization Lab',
    chapterNumber: 3,
    chapterId: 'chapter-03',
    chapterSlug: 'chapter-3',
    chapterTitle: 'Cyber Security Vulnerabilities',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    icon: 'database',
    summary: 'Break through an unsafe login form by injecting malicious SQL statements, inspect live query reconstruction, and refactor the backend with parameterized prepared statements.',
    learningObjectives: [
      'Understand how unsafe SQL string concatenation alters database query logic',
      'Perform classic authentication bypass using demonstration payload `\' OR \'1\'=\'1\' --`',
      'Inspect simulated database query construction and execution in real time',
      'Verify how prepared statements with parameterized inputs eliminate SQL injection completely',
    ],
    scenario:
      'You are examining an administrative portal with a legacy authentication gateway. The application takes user-submitted credentials and concatenates them directly into a raw SQL query. Your mission is to demonstrate the vulnerability in a controlled environment, observe query logic alteration, and verify the parameterized mitigation.',
    toolsAndConcepts: ['SQL Injection (SQLi)', 'Raw String Concatenation', 'Tautology Exploitation', 'Parameterized Prepared Statements'],
    steps: [
      {
        id: 'sqli-step-1',
        stepNumber: 1,
        title: 'Test Normal Legitimate Login',
        instruction: 'Log into the portal using valid student test credentials (Username: `student`, Password: `student123`). Click "Log In".',
        expectedResult: 'The simulated query executes and grants standard user access.',
      },
      {
        id: 'sqli-step-2',
        stepNumber: 2,
        title: 'Inject Tautology Payload to Bypass Authentication',
        instruction: 'In the Username input, enter `admin\' OR \'1\'=\'1\' --` (leave Password empty or enter dummy text). Click "Log In".',
        expectedResult: 'The query logic is broken! The WHERE clause evaluates to TRUE, the comment symbol neutralizes the password check, and administrator access is granted!',
      },
      {
        id: 'sqli-step-3',
        stepNumber: 3,
        title: 'Switch to Secure Parameterized Mode & Retest',
        instruction: 'Toggle "Secure Application Mode". Try the identical injection payload `admin\' OR \'1\'=\'1\' --`. Click "Log In".',
        expectedResult: 'Authentication fails! In secure mode, the database treats the payload as an ordinary literal username string rather than executable SQL logic.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'Input Breaking Delimiters',
        content: 'An unescaped single quote in your input closes the SQL literal string prematurely.',
      },
      {
        tier: 2,
        title: 'The Tautology Trick',
        content: 'By injecting `\' OR \'1\'=\'1\'`, the query condition evaluates to TRUE for every row.',
      },
      {
        tier: 3,
        title: 'Comment Characters',
        content: 'In SQL, `--` tells the database to treat the rest of the line as a comment, discarding the password check.',
      },
    ],
    solution: {
      answer: 'Input: `admin\' OR \'1\'=\'1\' --` in the username field. Fix: Always use Parameterized Prepared Statements.',
      detailedExplanation:
        'SQL Injection occurs when untrusted user input is concatenated directly into query commands. Prepared statements solve this by compiling the SQL structure first, then binding user parameters purely as raw values.',
      codeSnippet: {
        language: 'sql',
        filename: 'vulnerable_vs_secure.sql',
        code: `-- INSECURE: Dynamic String Concatenation\nquery = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";\n\n-- SECURE: Parameterized Prepared Statement\nPREPARE auth_stmt FROM 'SELECT id, username, role FROM users WHERE username = ? AND password_hash = ?';\nEXECUTE auth_stmt USING @input_user, @input_hash;`,
      },
    },
    whatHappened:
      'In vulnerable mode, the injected single quote broke out of the string boundary, and the OR clause forced the query to match the admin row. In secure mode, placeholders treated quotes as harmless literal text.',
    vulnerabilityExplanation:
      'SQL injection happens when code and data are mixed together in a single communication channel.',
    detectionMethods: [
      'Static Application Security Testing (SAST) tools flagging raw SQL string concatenation',
      'Dynamic Web Application Firewalls (WAF) detecting SQL token syntax in query parameters',
    ],
    preventionAndMitigation: [
      'Mandate parameterized queries or Object-Relational Mappers (ORMs)',
      'Apply the Principle of Least Privilege to database service accounts',
    ],
    knowledgeCheck: {
      question: 'Why do parameterized queries (prepared statements) prevent SQL injection vulnerabilities?',
      options: [
        'They automatically encrypt the database table on disk',
        'They compile the SQL structure first and treat input parameters strictly as literal data values',
        'They strip all single quotes and hyphens from user inputs before saving',
        'They block all requests originating from IP addresses outside the local network',
      ],
      correctIndex: 1,
      explanation:
        'With parameterized queries, the database compiles and plans query execution before parameter values are inserted. Metacharacters in inputs cannot alter the compiled query logic.',
    },
    simulationType: 'sqli',
    badgeAwarded: {
      id: 'badge-sqli-infiltrator',
      name: 'Query Master',
      description: 'Mastered SQL injection mechanics, payload analysis, and parameterized defenses.',
      icon: '💉',
    },
  },

  // CHAPTER 04: NETWORK SECURITY & ARCHITECTURE
  {
    id: 'firewall-packet-filter-lab',
    slug: 'firewall-packet-filter',
    title: 'Stateful Firewall Rule Engineering & Packet Inspection Lab',
    chapterNumber: 4,
    chapterId: 'chapter-04',
    chapterSlug: 'chapter-4',
    chapterTitle: 'Network Security & Architecture',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    icon: 'shield',
    summary: 'Construct an ordered firewall rule table, test synthetic packets against ingress filters, and master default-deny access control policies.',
    learningObjectives: [
      'Understand the First-Match rule processing model in firewall policy evaluation',
      'Differentiate between stateless packet filtering and stateful connection tracking',
      'Configure ingress rules permitting HTTP/HTTPS and SSH while blocking unauthorized ports',
      'Demonstrate why default-deny (implicit drop) is vital for network perimeter defense',
    ],
    scenario:
      'You are hardening the edge firewall of an enterprise DMZ server hosting web services. Malicious port sweeps and unauthenticated Telnet packets are hitting the gateway. Configure firewall rules to allow legitimate web traffic while dropping unauthorized probes.',
    toolsAndConcepts: ['Packet Inspection Engine', 'Tuple Matching (Src IP, Dst Port, Proto)', 'Default-Deny Policy', 'Stateful Filtering'],
    steps: [
      {
        id: 'fw-step-1',
        stepNumber: 1,
        title: 'Inspect Default Ingress Rule Set',
        instruction: 'Review the current active rules in the firewall simulator. Notice the rule order and the final default policy.',
        expectedResult: 'Rules are evaluated sequentially from top to bottom. The first matching rule decides packet fate.',
      },
      {
        id: 'fw-step-2',
        stepNumber: 2,
        title: 'Inject Test Packets Through Firewall',
        instruction: 'Send synthetic packets: HTTP (TCP 80), SSH (TCP 22 from Admin vs Foreign IP), and Telnet (TCP 23). Click "Send Packet".',
        expectedResult: 'The tracer highlights each evaluated rule in real time, showing matched criteria and whether the packet was ACCEPTED or DROPPED.',
      },
      {
        id: 'fw-step-3',
        stepNumber: 3,
        title: 'Add Secure Rule & Fix Port Exposure',
        instruction: 'Add a new rule restricting SSH (Port 22) exclusively to the management subnet `10.0.0.0/24` and drop all foreign SSH attempts.',
        expectedResult: 'Foreign attempts to port 22 are now immediately rejected by the firewall filter.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'Rule Order Matters',
        content: 'Firewalls evaluate rules top-to-bottom. If a generic "ALLOW ALL" rule is positioned first, subsequent block rules are never evaluated.',
      },
      {
        tier: 2,
        title: 'Default Deny Philosophy',
        content: 'A secure firewall policy should always terminate with an implicit DROP rule for any traffic that was not explicitly whitelisted.',
      },
      {
        tier: 3,
        title: 'Principle of Least Privilege',
        content: 'Never open administrative ports (SSH 22, RDP 3389) to 0.0.0.0/0.',
      },
    ],
    solution: {
      answer: 'Place specific whitelist rules at top and maintain an explicit DROP ALL policy at bottom.',
      detailedExplanation:
        'Firewalls match incoming packets against 5-tuples. A standard best practice is default-deny, where any packet that does not match an approved rule is silently dropped.',
      codeSnippet: {
        language: 'bash',
        filename: 'iptables_rules.sh',
        code: `# Set Default Policies to DROP\niptables -P INPUT DROP\niptables -A INPUT -p tcp --dport 80 -j ACCEPT\niptables -A INPUT -p tcp --dport 443 -j ACCEPT\niptables -A INPUT -p tcp -s 10.0.0.0/24 --dport 22 -j ACCEPT`,
      },
    },
    whatHappened:
      'The packet evaluation engine tested packet headers against the rule set, stopping at the first matching rule.',
    vulnerabilityExplanation:
      'Permissive firewall rules expose sensitive internal services to the open internet.',
    detectionMethods: ['Automated external nmap port audits', 'SIEM firewall drop-log monitoring'],
    preventionAndMitigation: ['Enforce Default-Deny ingress policy', 'Isolate admin services behind VPNs'],
    knowledgeCheck: {
      question: 'What occurs if an "ALLOW ALL TCP Port 80" rule is placed directly above a rule blocking a malicious IP on Port 80?',
      options: [
        'The firewall merges the rules and blocks the malicious IP',
        'The malicious IP is allowed through because the firewall matches the first ALLOW rule and stops evaluating',
        'The firewall throws a configuration syntax error',
        'The packet is duplicated and sent to both rules',
      ],
      correctIndex: 1,
      explanation:
        'Because standard firewalls process rules sequentially and stop at the first matching rule, the broad ALLOW rule matches before the block rule is ever examined.',
    },
    simulationType: 'firewall',
    badgeAwarded: {
      id: 'badge-firewall-architect',
      name: 'Perimeter Defender',
      description: 'Mastered firewall rule ordering, packet inspection, and default-deny policies.',
      icon: '🧱',
    },
  },

  // CHAPTER 05: CRYPTOGRAPHY & ENCRYPTION
  {
    id: 'crypto-workbench-lab',
    slug: 'crypto-workbench',
    title: 'Cryptographic Workbench: Symmetric, Asymmetric & Hashes',
    chapterNumber: 5,
    chapterId: 'chapter-05',
    chapterSlug: 'chapter-5',
    chapterTitle: 'Cryptography & Encryption',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    icon: 'lock',
    summary: 'Encrypt and decrypt live messages using AES-256-GCM, test toy substitution ciphers, inspect one-way SHA-256 digests, and observe ciphertext sensitivity.',
    learningObjectives: [
      'Differentiate symmetric key encryption (AES-256) from asymmetric cryptography (RSA)',
      'Observe the Avalanche Effect where modifying 1 bit of plaintext completely scrambles the output hash',
      'Understand why toy substitution ciphers (Caesar) fail against frequency analysis',
      'Verify how Galois/Counter Mode (GCM) provides both confidentiality and tamper-proof authentication',
    ],
    scenario:
      'You are setting up secure messaging protocols for an internal service. Use this cryptographic workbench to experiment with symmetric AES encryption, observe the integrity authentication tag, test educational ciphers, and verify one-way cryptographic hashes.',
    toolsAndConcepts: ['AES-256-GCM', 'Initialization Vector (IV/Nonce)', 'Avalanche Effect', 'SHA-256 Digest', 'Authentication Tags'],
    steps: [
      {
        id: 'crypto-step-1',
        stepNumber: 1,
        title: 'Encrypt with AES-256-GCM',
        instruction: 'Enter a secret message, select AES-256-GCM, and click "Encrypt Payload".',
        expectedResult: 'The workbench generates random IV, ciphertext hex bytes, and an authentication tag.',
      },
      {
        id: 'crypto-step-2',
        stepNumber: 2,
        title: 'Tamper with Ciphertext & Decrypt',
        instruction: 'Change a single hexadecimal digit in the Ciphertext and click "Decrypt Payload".',
        expectedResult: 'Decryption fails with an Authentication Error! AES-GCM detects the data tampering and refuses to emit corrupted data.',
      },
      {
        id: 'crypto-step-3',
        stepNumber: 3,
        title: 'Test SHA-256 Avalanche Effect',
        instruction: 'Switch to SHA-256. Hash the text "StudyVerse", then change one letter to "Studyverse" (lowercase "v").',
        expectedResult: 'Over 50% of the output hash bits flip entirely, demonstrating the cryptographic Avalanche Effect.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'Symmetric vs Asymmetric',
        content: 'Symmetric ciphers use the same key for encryption and decryption. Asymmetric algorithms use linked public and private key pairs.',
      },
      {
        tier: 2,
        title: 'Purpose of IV',
        content: 'An Initialization Vector ensures encrypting identical plaintext twice produces completely different ciphertexts.',
      },
      {
        tier: 3,
        title: 'Authenticated Encryption',
        content: 'AES-GCM includes an authentication tag verifying data integrity and authenticity.',
      },
    ],
    solution: {
      answer: 'Always use Authenticated Encryption with Associated Data (AEAD) like AES-256-GCM with a unique nonce for every message.',
      detailedExplanation:
        'Modern AEAD modes like AES-GCM produce an authentication tag alongside ciphertext. If any byte is altered in transit, tag verification fails during decryption.',
      codeSnippet: {
        language: 'javascript',
        filename: 'aes_gcm_example.js',
        code: `async function encryptSecret(plaintext, key) {\n  const iv = crypto.getRandomValues(new Uint8Array(12));\n  const encoded = new TextEncoder().encode(plaintext);\n  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);\n  return { ciphertext, iv };\n}`,
      },
    },
    whatHappened:
      'The cryptographic engine performed mathematical transformations using modern block cipher primitives and SHA-256 hashing algorithms.',
    vulnerabilityExplanation:
      'Using unauthenticated cipher modes allows attackers to perform replay attacks, block rearrangement, and bit-flipping manipulation.',
    detectionMethods: ['Static code analysis flagging deprecated ciphers like DES or ECB mode'],
    preventionAndMitigation: ['Mandate AEAD ciphers (AES-GCM, ChaCha20-Poly1305)', 'Never reuse an IV with the same key'],
    knowledgeCheck: {
      question: 'What happens when you alter a single byte of ciphertext in an AES-256-GCM encrypted message before decrypting it?',
      options: [
        'Only that single character in the plaintext is corrupted',
        'The authentication tag verification fails and decryption is aborted with an error',
        'The key is automatically invalidated by the system',
        'The cipher falls back to Caesar substitution',
      ],
      correctIndex: 1,
      explanation:
        'AES-GCM is an Authenticated Encryption cipher. Modifying ciphertext invalidates the tag and causes the decryption engine to reject the payload.',
    },
    simulationType: 'crypto',
    badgeAwarded: {
      id: 'badge-crypto-master',
      name: 'Cipher Sovereign',
      description: 'Mastered symmetric encryption, integrity tags, and cryptographic hashes.',
      icon: '🔐',
    },
  },

  // CHAPTER 06: IDENTITY & ACCESS MANAGEMENT / RECON
  {
    id: 'network-port-scanner-lab',
    slug: 'network-port-scanner',
    title: 'Network Reconnaissance & Port Scanning Lab',
    chapterNumber: 6,
    chapterId: 'chapter-06',
    chapterSlug: 'chapter-6',
    chapterTitle: 'Identity & Access Management',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    icon: 'terminal',
    summary: 'Simulate an authorized Nmap port scan across a fictional subnet, inspect TCP handshake states, and discover exposed vulnerable service banners.',
    learningObjectives: [
      'Understand how TCP SYN scans probe target port states (Open, Closed, Filtered)',
      'Inspect simulated service version banners on exposed ports',
      'Identify critical attack surface exposures such as unencrypted FTP and outdated databases',
      'Formulate remediation steps to close unnecessary ports and harden host perimeters',
    ],
    scenario:
      'You are performing an authorized vulnerability assessment of the internal staging subnet `192.168.1.0/24`. Scan the target host (`192.168.1.50`), inspect open service ports, analyze returned banners, and document discovered security risks.',
    toolsAndConcepts: ['Port Scanning (Nmap simulation)', 'TCP 3-Way Handshake', 'Service Banner Grabbing', 'Attack Surface Reduction'],
    steps: [
      {
        id: 'scan-step-1',
        stepNumber: 1,
        title: 'Select Target & Execute Quick Scan',
        instruction: 'Select target host `192.168.1.50` and click "Run Quick Port Scan (Ports 1-1024)".',
        expectedResult: 'Terminal displays scanning progress and reports Open ports: 21 (FTP), 22 (SSH), 80 (HTTP), and 3306 (MySQL).',
      },
      {
        id: 'scan-step-2',
        stepNumber: 2,
        title: 'Perform Service Version Detection (-sV)',
        instruction: 'Run the Service Banner Detection scan to grab version strings from open ports.',
        expectedResult: 'Port 21 exposes vsftpd 2.3.4 (Anonymous Login Allowed) and Port 3306 reveals MySQL 5.5.62.',
      },
      {
        id: 'scan-step-3',
        stepNumber: 3,
        title: 'Identify Critical Finding',
        instruction: 'Review the scan results table and click "Audit Vulnerability" on the unencrypted anonymous FTP service.',
        expectedResult: 'Challenge confirmed! You correctly identified cleartext service exposure on port 21.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'Standard Ports',
        content: 'Port 21 is FTP, 22 is SSH, 80 is HTTP, and 3306 is MySQL.',
      },
      {
        tier: 2,
        title: 'Banner Grabbing',
        content: 'Service banners disclose software name and version number.',
      },
      {
        tier: 3,
        title: 'Database Exposure',
        content: 'Databases should listen strictly on localhost (127.0.0.1), never on 0.0.0.0.',
      },
    ],
    solution: {
      answer: 'Port 21 (vsftpd with anonymous login) and Port 3306 (MySQL exposed externally) represent critical vulnerabilities.',
      detailedExplanation:
        'Port scanning identifies active endpoints and listening daemons. Databases should never listen on public interfaces without encrypted tunneling and IP whitelist restrictions.',
      codeSnippet: {
        language: 'bash',
        filename: 'nmap_audit.sh',
        code: `nmap -sV -sC -O -T4 192.168.1.50`,
      },
    },
    whatHappened:
      'The scanner sent simulated TCP SYN packets to standard ports, inspecting responses to determine port states.',
    vulnerabilityExplanation:
      'Exposing unnecessary services expands the attack surface.',
    detectionMethods: ['Network Intrusion Detection Systems (NIDS) detecting rapid SYN packets'],
    preventionAndMitigation: ['Disable unused services', 'Bind services strictly to localhost when remote access is not needed'],
    knowledgeCheck: {
      question: 'During a TCP SYN scan, what response indicates that a target port is OPEN?',
      options: [
        'The target responds with a RST/ACK packet',
        'The target responds with a SYN/ACK packet',
        'The target does not respond at all',
        'The target sends an ICMP Port Unreachable message',
      ],
      correctIndex: 1,
      explanation:
        'When a listening service receives a SYN packet, it attempts to complete the handshake by replying with SYN/ACK, indicating the port is open.',
    },
    simulationType: 'network-scan',
    badgeAwarded: {
      id: 'badge-recon-scout',
      name: 'Network Recon Scout',
      description: 'Mastered port scanning, service banner grabbing, and attack surface enumeration.',
      icon: '📡',
    },
  },

  // CHAPTER 07: WEB APPLICATION SECURITY
  {
    id: 'xss-stored-defense-lab',
    slug: 'xss-stored-defense',
    title: 'Cross-Site Scripting (XSS) & Contextual Escaping Lab',
    chapterNumber: 7,
    chapterId: 'chapter-07',
    chapterSlug: 'chapter-7',
    chapterTitle: 'Web Application Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    icon: 'code',
    summary: 'Inject harmless test scripts into an unsafe discussion comment box, observe simulated cookie theft execution, and implement contextual HTML entity escaping.',
    learningObjectives: [
      'Understand how Stored and Reflected XSS occur when user input is rendered unescaped into HTML DOM',
      'Demonstrate how JavaScript execution in the victim browser can access document cookies and session tokens',
      'Observe the difference between raw innerHTML rendering and safe textContent/HTML-entity escaping',
      'Formulate Content Security Policy (CSP) headers to restrict script execution',
    ],
    scenario:
      'You are testing a discussion forum component. The application stores user feedback and renders comments on the public community wall using `element.innerHTML = comment`. Demonstrate how an unescaped comment executes arbitrary JavaScript in the visitor\'s browser session, and verify the contextual escaping fix.',
    toolsAndConcepts: ['Cross-Site Scripting (XSS)', 'DOM Injection', 'Contextual Output Encoding', 'Content Security Policy (CSP)'],
    steps: [
      {
        id: 'xss-step-1',
        stepNumber: 1,
        title: 'Post Harmless Normal Comment',
        instruction: 'Post a normal greeting message: "Great website! Highly recommend." Click "Post Comment to Board".',
        expectedResult: 'The comment appears normally in the preview feed.',
      },
      {
        id: 'xss-step-2',
        stepNumber: 2,
        title: 'Inject Educational Demonstration Script',
        instruction: 'In the comment input, enter `<img src="x" onerror="simulateExploit()">`. Click "Post Comment to Board".',
        expectedResult: 'In Vulnerable Mode, the browser executes the script! An alert dialog pops up demonstrating simulated session cookie interception.',
      },
      {
        id: 'xss-step-3',
        stepNumber: 3,
        title: 'Toggle Secure Escaping Mode',
        instruction: 'Switch the toggle to "Secure Escaping Mode" and re-submit the payload.',
        expectedResult: 'The payload renders harmlessly as literal text. No script executes, protecting visitor sessions.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'HTML Context',
        content: 'When an application uses innerHTML, incoming text is parsed as markup.',
      },
      {
        tier: 2,
        title: 'Event Handler Vectors',
        content: 'Attackers often use image onerror or svg onload event handlers to trigger JavaScript.',
      },
      {
        tier: 3,
        title: 'Contextual Escaping',
        content: 'Replace special characters (<, >, &, ") with HTML entities.',
      },
    ],
    solution: {
      answer: 'Always use textContent or contextual HTML entity encoding when rendering untrusted user strings into the DOM.',
      detailedExplanation:
        'Converting metacharacters into harmless HTML entities ensures browsers display characters as visible text rather than executable elements.',
      codeSnippet: {
        language: 'javascript',
        filename: 'safe_dom_rendering.js',
        code: `// SECURE: Use textContent\ncommentElement.textContent = userComment;`,
      },
    },
    whatHappened:
      'In vulnerable mode, the DOM parser treated input markup as executable elements. In secure mode, entity escaping neutralized the tags.',
    vulnerabilityExplanation:
      'XSS allows an attacker to execute arbitrary scripts in the security context of a visitor\'s browser session.',
    detectionMethods: ['Automated DAST scanners injecting polyglot XSS vectors'],
    preventionAndMitigation: ['Deploy Content Security Policy (CSP)', 'Set HttpOnly cookie flag'],
    knowledgeCheck: {
      question: 'Which HTTP cookie flag prevents client-side JavaScript from accessing session tokens via document.cookie?',
      options: ['SameSite=Strict', 'HttpOnly', 'Secure', 'Path=/'],
      correctIndex: 1,
      explanation:
        'The HttpOnly flag instructs the browser that the cookie should not be exposed through the document.cookie DOM API.',
    },
    simulationType: 'xss',
    badgeAwarded: {
      id: 'badge-xss-slayer',
      name: 'DOM Sanitizer',
      description: 'Mastered Cross-Site Scripting mechanics, DOM injection, and output encoding.',
      icon: '🧼',
    },
  },

  // CHAPTER 08: PHISHING & SOCIAL ENGINEERING
  {
    id: 'phishing-triage-lab',
    slug: 'phishing-triage',
    title: 'Phishing Detection & Threat Triage Email Lab',
    chapterNumber: 8,
    chapterId: 'chapter-08',
    chapterSlug: 'chapter-8',
    chapterTitle: 'Phishing & Social Engineering',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    icon: 'mail',
    summary: 'Analyze a simulated corporate inbox, inspect header envelopes, detect typosquatting domains, identify social engineering lures, and classify threats with high precision.',
    learningObjectives: [
      'Inspect email headers to detect spoofed sender display names and typosquatted domains',
      'Analyze deceptive hyperlinks by comparing visible anchor text against actual destination URLs',
      'Recognize psychological urgency, fear, and authority manipulation tactics used in phishing lures',
      'Formulate incident triage actions',
    ],
    scenario:
      'You are an Incident Response Analyst on duty at the SOC. Suspicious emails reported by employees have arrived in the quarantine queue. Inspect sender headers, destination links, and attachments to classify each email as Phishing or Legitimate.',
    toolsAndConcepts: ['Email Header Analysis', 'Typosquatting Detection', 'Urgency & Fear Lures', 'Malicious Attachment Indicators'],
    steps: [
      {
        id: 'phish-step-1',
        stepNumber: 1,
        title: 'Inspect Email 1: Account Suspension Warning',
        instruction: 'Open Email 1. Hover over the "Verify Account Now" button to inspect destination URL and examine the sender address.',
        expectedResult: 'Sender is `security-alerts@paypa1-support-portal.biz` (typosquatted digit 1) and link targets an external domain.',
      },
      {
        id: 'phish-step-2',
        stepNumber: 2,
        title: 'Triage All Sample Messages',
        instruction: 'Review each message in the queue and label them as Phishing or Legitimate.',
        expectedResult: 'You accurately identify phishing lures while permitting legitimate corporate notices.',
      },
      {
        id: 'phish-step-3',
        stepNumber: 3,
        title: 'Review Triage Score & Indicators',
        instruction: 'Submit your determinations and review the detailed breakdown for each message.',
        expectedResult: 'The analysis reveals exact detection points: typosquatting, attachment file extensions, and deceptive URL mismatches.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'Check the From Header',
        content: 'Attackers disguise the display name while the actual email address is completely different.',
      },
      {
        tier: 2,
        title: 'Hover Before Clicking',
        content: 'Displayed link text often does not match the actual href destination URL.',
      },
      {
        tier: 3,
        title: 'Urgent Demands',
        content: 'Scammers frequently demand artificial urgency ("Account suspended in 2 hours!").',
      },
    ],
    solution: {
      answer: 'Always verify sender domain authenticity, inspect link destinations, and authenticate out-of-band for sensitive requests.',
      detailedExplanation:
        'Phishing exploits human cognitive vulnerabilities. Key indicators include typosquatting, generic greetings, urgency tones, and mismatched links.',
      codeSnippet: {
        language: 'text',
        filename: 'email_headers.txt',
        code: `From: "IT Support" <helpdesk@studyverse-internall.net> [Typosquatted domain]\nReply-To: credential-collector@offshore-server.biz`,
      },
    },
    whatHappened:
      'The triage simulator parsed simulated email envelopes, providing hover previews of disguised links.',
    vulnerabilityExplanation:
      'Human users are the perimeter. Phishing bypasses technical defenses by tricking authenticated users.',
    detectionMethods: ['Gateway mail filters inspecting SPF, DKIM, and DMARC DNS records'],
    preventionAndMitigation: ['Enforce FIDO2/WebAuthn hardware security keys', 'Security awareness training'],
    knowledgeCheck: {
      question: 'Which authentication technology completely prevents phishing credential theft even if a user enters credentials on a fake site?',
      options: [
        'SMS-based One-Time Passwords (OTP)',
        'FIDO2 / WebAuthn Hardware Security Keys',
        'Complex 20-character passwords',
        'Security question prompts',
      ],
      correctIndex: 1,
      explanation:
        'FIDO2 / WebAuthn keys cryptographically bind authentication assertions to the exact domain origin in the browser address bar.',
    },
    simulationType: 'phishing',
    badgeAwarded: {
      id: 'badge-phish-hunter',
      name: 'Phish Buster',
      description: 'Mastered email header analysis, link inspection, and social engineering triage.',
      icon: '🎣',
    },
  },

  // CHAPTER 09: MALWARE & ENDPOINT DEFENSE
  {
    id: 'malware-sandbox-analysis-lab',
    slug: 'malware-sandbox-analysis',
    title: 'Malware Static & Behavioral Sandbox Analysis Lab',
    chapterNumber: 9,
    chapterId: 'chapter-09',
    chapterSlug: 'chapter-9',
    chapterTitle: 'Malware & Endpoint Defense',
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    icon: 'activity',
    summary: 'Dissect a suspicious executable report in a safe simulated sandbox: inspect PE headers, analyze anomalous Windows API calls, detect C2 network beacons, and identify ransomware IoCs.',
    learningObjectives: [
      'Analyze static file metadata, compile timestamps, and cryptographic hashes (SHA-256)',
      'Inspect imported Windows API functions commonly abused by process injection (VirtualAllocEx, WriteProcessMemory)',
      'Analyze dynamic behavioral artifacts including registry autorun persistence and shadow copy deletion',
      'Classify threats and extract actionable Indicators of Compromise (IoCs)',
    ],
    scenario:
      'A suspicious attachment named `Annual_Financial_Invoice_2026.pdf.exe` was intercepted on an executive workstation. The file has been detonated in an isolated sandbox. Inspect the static PE structure, dynamic execution trace, registry modifications, and network connections to classify the threat.',
    toolsAndConcepts: ['Static PE Analysis', 'Dynamic Behavioral Sandbox', 'Process Injection APIs', 'Indicators of Compromise (IoC)', 'Ransomware Mechanics'],
    steps: [
      {
        id: 'mal-step-1',
        stepNumber: 1,
        title: 'Examine Static File Metadata & PE Headers',
        instruction: 'Review the file details: double extension (.pdf.exe) and entropy score (7.84 indicates packed code).',
        expectedResult: 'High entropy confirms the executable is packed to evade static signature detection.',
      },
      {
        id: 'mal-step-2',
        stepNumber: 2,
        title: 'Audit Suspicious Imported API Calls',
        instruction: 'Inspect the DLL imports table. Note calls to `VirtualAllocEx`, `WriteProcessMemory`, and `CreateRemoteThread`.',
        expectedResult: 'These APIs are the hallmark of Process Hollowing and DLL Injection.',
      },
      {
        id: 'mal-step-3',
        stepNumber: 3,
        title: 'Inspect Dynamic Sandbox Execution Trace',
        instruction: 'Review the dynamic behavior log: spawned processes, command-line executions, and outbound beacons.',
        expectedResult: 'Execution reveals `vssadmin.exe delete shadows /all /quiet` and an outbound beacon, confirming Ransomware activity.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'Double Extensions',
        content: 'Windows hides known extensions by default, making Invoice.pdf.exe appear as Invoice.pdf.',
      },
      {
        tier: 2,
        title: 'Shadow Copies',
        content: 'Ransomware deletes Volume Shadow Copies to prevent free file restoration.',
      },
      {
        tier: 3,
        title: 'Process Injection',
        content: 'Calls to VirtualAllocEx and CreateRemoteThread inject shellcode into legitimate processes.',
      },
    ],
    solution: {
      answer: 'Classified as Ransomware Dropper with Process Hollowing and C2 Beaconing.',
      detailedExplanation:
        'Dynamic analysis records behavioral activity in an instrumented VM. Commands like vssadmin delete shadows specifically prevent disaster recovery.',
      codeSnippet: {
        language: 'text',
        filename: 'ioc_indicators.txt',
        code: `SHA-256: 8f4e2b1c9a6d3e7f0b5c8d2a4e1f7a9b3c5d8e2f1a6c4b9d7e0f2a4b8c6d1e3f\nCommand: cmd.exe /c vssadmin.exe delete shadows /all /quiet\nC2 IP: 185.220.101.5:8443`,
      },
    },
    whatHappened:
      'The simulated malware sandbox parsed synthetic PE headers and simulated API call sequences safely.',
    vulnerabilityExplanation:
      'Malware abuses administrative tools to establish persistence, elevate privileges, and encrypt files.',
    detectionMethods: ['Endpoint Detection and Response (EDR) behavioral monitoring'],
    preventionAndMitigation: ['Deploy AppLocker or WDAC to block unauthorized executables from running in user folders'],
    knowledgeCheck: {
      question: 'Why does ransomware execute `vssadmin.exe delete shadows /all /quiet` upon infection?',
      options: [
        'To speed up CPU processing performance',
        'To delete Volume Shadow Copies and prevent the user from restoring encrypted files for free',
        'To clear Windows event logs',
        'To disable network card drivers',
      ],
      correctIndex: 1,
      explanation:
        'Volume Shadow Copies allow users to restore files. Ransomware destroys them to force ransom payments.',
    },
    simulationType: 'malware-analysis',
    badgeAwarded: {
      id: 'badge-malware-hunter',
      name: 'Malware Analyst',
      description: 'Dissected PE headers, API injection vectors, and ransomware behavior.',
      icon: '🦠',
    },
  },

  // CHAPTER 10: DENIAL OF SERVICE & AVAILABILITY
  {
    id: 'ddos-rate-limiting-lab',
    slug: 'ddos-rate-limiting',
    title: 'Volumetric DDoS & Rate Limiting Defense Simulator',
    chapterNumber: 10,
    chapterId: 'chapter-10',
    chapterSlug: 'chapter-10',
    chapterTitle: 'Denial of Service & Availability',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    icon: 'zap',
    summary: 'Subject a simulated web cluster to high-volume SYN floods and HTTP application surges, observe CPU spikes and server crashes, and deploy defensive filters in real time.',
    learningObjectives: [
      'Differentiate network-layer volumetric floods (SYN flood) from application-layer surges (HTTP GET floods)',
      'Observe resource starvation effects on server CPU, memory, and concurrent connection pools',
      'Implement Token Bucket rate limiting to throttle abusive IP addresses',
      'Deploy SYN Cookies and Cloud Web Application Firewall (WAF) challenge filters',
    ],
    scenario:
      'You are operating the reliability command center for an e-commerce platform. During a high-profile promotion, a distributed botnet launches a mixed SYN and HTTP request flood. The server is dropping legitimate requests and CPU is spiking toward 100%. Activate defensive controls and stabilize the infrastructure.',
    toolsAndConcepts: ['Denial of Service (DoS/DDoS)', 'SYN Flood & Half-Open Connections', 'Token Bucket Rate Limiting', 'SYN Cookies', 'Cloud WAF Scrubbing'],
    steps: [
      {
        id: 'ddos-step-1',
        stepNumber: 1,
        title: 'Observe Baseline Healthy Traffic',
        instruction: 'Review server metrics under normal load (~50 requests/sec, 12% CPU, 0% packet loss).',
        expectedResult: 'System status is GREEN with 100% service availability.',
      },
      {
        id: 'ddos-step-2',
        stepNumber: 2,
        title: 'Launch Simulated SYN Flood Attack',
        instruction: 'Under Attack Simulation, select "SYN Flood (5,000 req/sec)".',
        expectedResult: 'CPU jumps to 98%, legitimate requests time out, and availability drops to CRITICAL RED!',
      },
      {
        id: 'ddos-step-3',
        stepNumber: 3,
        title: 'Activate Defense Modules',
        instruction: 'Enable "SYN Cookies" and "Token Bucket Rate Limiting".',
        expectedResult: 'Malicious packets are dropped, server CPU normalizes back to 22%, and legitimate student traffic is restored!',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'SYN Flood Mechanics',
        content: 'In a SYN flood, the attacker sends SYN packets with spoofed source IPs and never sends final ACKs.',
      },
      {
        tier: 2,
        title: 'How SYN Cookies Help',
        content: 'SYN Cookies encode connection state inside the TCP sequence number, eliminating memory allocation for half-open queues.',
      },
      {
        tier: 3,
        title: 'Layer 7 Surges',
        content: 'HTTP application floods require rate limiters and WAF bot challenges.',
      },
    ],
    solution: {
      answer: 'Activate SYN Cookies in the OS kernel for Layer 4 TCP exhaustion, and configure Token Bucket rate limiting for Layer 7 surges.',
      detailedExplanation:
        'Denial of Service attacks target availability. SYN cookies eliminate state storage until the handshake completes.',
      codeSnippet: {
        language: 'bash',
        filename: 'ddos_hardening.sh',
        code: `sysctl -w net.ipv4.tcp_syncookies=1\nsysctl -w net.ipv4.tcp_max_syn_backlog=4096`,
      },
    },
    whatHappened:
      'The simulator calculated resource consumption algorithms based on incoming request rates.',
    vulnerabilityExplanation:
      'Computing systems possess finite resources. Without limits, asymmetric attacks exhaust enterprise capacity.',
    detectionMethods: ['NetFlow/sFlow traffic analyzers monitoring sudden bandwidth surges'],
    preventionAndMitigation: ['Deploy upstream Cloud DDoS scrubbing centers', 'Enable SYN cookies'],
    knowledgeCheck: {
      question: 'How do TCP SYN Cookies protect a server against connection table exhaustion during a SYN flood?',
      options: [
        'They immediately block all incoming IP addresses from foreign countries',
        'They encode connection state into the initial TCP sequence number, eliminating memory allocation until the client completes the handshake',
        'They compress all incoming packets using gzip',
        'They redirect all HTTP traffic to port 443',
      ],
      correctIndex: 1,
      explanation:
        'SYN Cookies encode connection state in the initial 32-bit sequence number, preventing connection queue exhaustion.',
    },
    simulationType: 'ddos',
    badgeAwarded: {
      id: 'badge-ddos-shield',
      name: 'Availability Guardian',
      description: 'Mastered DDoS attack mechanics, SYN cookies, and rate limiting defenses.',
      icon: '🛡️',
    },
  },

  // CHAPTER 11: MAN-IN-THE-MIDDLE & NETWORK ATTACKS
  {
    id: 'mitm-arp-tls-lab',
    slug: 'mitm-arp-tls',
    title: 'Man-in-the-Middle Interception & TLS Certificate Verification',
    chapterNumber: 11,
    chapterId: 'chapter-011',
    chapterSlug: 'chapter-11',
    chapterTitle: 'Man-in-the-Middle & Network Attacks',
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    icon: 'shuffle',
    summary: 'Place an attacker between a client workstation and banking server, intercept plaintext HTTP traffic, and demonstrate how TLS 1.3 cryptographic certificates prevent eavesdropping and data tampering.',
    learningObjectives: [
      'Understand how ARP spoofing positions an attacker between communication endpoints',
      'Demonstrate how unencrypted HTTP transmissions expose credentials to passive sniffing and active modification',
      'Observe the TLS handshake process: public key exchange, certificate validation, and symmetric session key generation',
      'Explain why HTTP Strict Transport Security (HSTS) prevents SSL stripping attacks',
    ],
    scenario:
      'A rogue device has joined the local Wi-Fi network and is broadcasting spoofed ARP replies to impersonate the default gateway. Experience the interaction from the perspectives of the victim client, the eavesdropping proxy, and the backend banking server under both unencrypted HTTP and encrypted HTTPS connections.',
    toolsAndConcepts: ['Man-in-the-Middle (MitM)', 'ARP Spoofing / Poisoning', 'Cleartext Sniffing', 'TLS 1.3 Handshake', 'HSTS & Certificate Validation'],
    steps: [
      {
        id: 'mitm-step-1',
        stepNumber: 1,
        title: 'Send Transfer over Insecure HTTP',
        instruction: 'Set connection mode to "Insecure HTTP". As the client, send a funds transfer request.',
        expectedResult: 'The packet travels through the Attacker Node. The attacker reads the plaintext PIN and alters the recipient account!',
      },
      {
        id: 'mitm-step-2',
        stepNumber: 2,
        title: 'Inspect Attacker Interception Console',
        instruction: 'Review what the attacker captured: plaintext credentials, session cookies, and mutable payload data.',
        expectedResult: 'Because HTTP lacks encryption and integrity protection, data is fully readable and modifiable in transit.',
      },
      {
        id: 'mitm-step-3',
        stepNumber: 3,
        title: 'Upgrade to Authenticated TLS 1.3 (HTTPS)',
        instruction: 'Toggle "Secure HTTPS Connection (TLS 1.3)" and resend the transfer.',
        expectedResult: 'The client verifies the server certificate. The payload is encrypted with an ephemeral session key. The attacker only sees unreadable ciphertext and cannot modify data without triggering a MAC error!',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'The Role of ARP',
        content: 'Because ARP lacks authentication, any device can broadcast fake replies claiming to be the router.',
      },
      {
        tier: 2,
        title: 'Confidentiality and Integrity',
        content: 'HTTPS provides both confidentiality (ciphertext) and integrity (MAC tags).',
      },
      {
        tier: 3,
        title: 'Certificate Authorities',
        content: 'Clients validate digital certificates against trusted CAs in root stores.',
      },
    ],
    solution: {
      answer: 'Enforce HTTPS everywhere with HTTP Strict Transport Security (HSTS) and Dynamic ARP Inspection on switches.',
      detailedExplanation:
        'TLS 1.3 thwarts MitM attacks by using asymmetric certificates to verify server identity, followed by Diffie-Hellman key exchange to derive symmetric session keys.',
      codeSnippet: {
        language: 'text',
        filename: 'hsts_header.txt',
        code: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
      },
    },
    whatHappened:
      'The simulator visualized packet routing across client, proxy, and server nodes, contrasting cleartext payload interception with AEAD-encrypted TLS frames.',
    vulnerabilityExplanation:
      'Without authenticated encryption, intermediate network nodes have full visibility and control over data packets.',
    detectionMethods: ['Network monitors alerting on ARP conflicts', 'Browser certificate validation warnings'],
    preventionAndMitigation: ['Enforce HTTPS exclusively with HSTS', 'Enable Dynamic ARP Inspection (DAI) on switches'],
    knowledgeCheck: {
      question: 'What happens when an attacker attempts to modify a single character in an HTTPS packet encrypted with TLS 1.3?',
      options: [
        'The modified character is accepted by the server without error',
        'The server\'s Message Authentication Code (MAC) check fails and the connection is immediately terminated',
        'The browser prompts the user to accept the altered packet',
        'The server downgrades the connection to HTTP automatically',
      ],
      correctIndex: 1,
      explanation:
        'TLS 1.3 uses Authenticated Encryption with Associated Data (AEAD). If any byte is altered in transit, the MAC check fails and the receiver terminates the session.',
    },
    simulationType: 'mitm',
    badgeAwarded: {
      id: 'badge-mitm-neutralizer',
      name: 'TLS Sentinel',
      description: 'Mastered Man-in-the-Middle mechanics, ARP spoofing, and TLS 1.3 defenses.',
      icon: '🛡️',
    },
  },

  // CHAPTER 12: OSINT & RECONNAISSANCE
  {
    id: 'osint-digital-footprint-lab',
    slug: 'osint-digital-footprint',
    title: 'Open Source Intelligence (OSINT) Threat Reconnaissance Lab',
    chapterNumber: 12,
    chapterId: 'chapter-12',
    chapterSlug: 'chapter-12',
    chapterTitle: 'OSINT & Reconnaissance',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    icon: 'search',
    summary: 'Investigate a fictional target entity, connect publicly accessible data fragments across WHOIS records, leaked Git commit metadata, and social media footprints to uncover an exposed attack surface.',
    learningObjectives: [
      'Understand the methodology of Open Source Intelligence (OSINT) gathering',
      'Correlate disparate public clues: WHOIS records, DNS entries, and leaked source code',
      'Extract sensitive metadata from public Git commit histories',
      'Evaluate personal and corporate digital footprints to mitigate inadvertent data exposure',
    ],
    scenario:
      'You are performing an authorized external attack surface assessment for a startup founded by fictional executive "Alex Morgan". Alex registered a test domain and pushed sample code to a public repository. Using publicly accessible OSINT tools, correlate clues to uncover an exposed database credential.',
    toolsAndConcepts: ['OSINT Methodology', 'WHOIS & DNS Enumeration', 'Git Commit History Metadata', 'Digital Footprint Analysis'],
    steps: [
      {
        id: 'osint-step-1',
        stepNumber: 1,
        title: 'Run WHOIS Query on Target Domain',
        instruction: 'Query the domain `alexmorgan-tech.net` in the OSINT investigative board.',
        expectedResult: 'Registration details disclose admin email `alex.m92@fictionalmail.com`.',
      },
      {
        id: 'osint-step-2',
        stepNumber: 2,
        title: 'Inspect Public Git Repository Metadata',
        instruction: 'Search public repositories for username `alexm92`. Examine commit diffs.',
        expectedResult: 'Inspecting the commit diff reveals an exposed staging database password: `Staging_Database_Secret_Pass_2026!`!',
      },
      {
        id: 'osint-step-3',
        stepNumber: 3,
        title: 'Correlate Attack Surface Findings',
        instruction: 'Combine registrar email, GitHub username, and leaked credential to document the compromised staging environment.',
        expectedResult: 'Investigation complete! You demonstrated how public digital breadcrumbs lead to critical infrastructure exposure.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'WHOIS Privacy',
        content: 'Without WHOIS privacy, domain registrations expose owner emails and names.',
      },
      {
        tier: 2,
        title: 'Git History',
        content: 'Deleting a secret in a new commit does not remove it from Git history; past diffs remain visible.',
      },
      {
        tier: 3,
        title: 'Username Reuse',
        content: 'People frequently reuse the same username across different developer platforms.',
      },
    ],
    solution: {
      answer: 'Discovered leaked staging database credential in Git commit history diffs mapped to registrar email.',
      detailedExplanation:
        'OSINT utilizes publicly available information. Attackers rarely need zero-day bugs when developers accidentally push credentials into public repositories.',
      codeSnippet: {
        language: 'bash',
        filename: 'git_history_leak.sh',
        code: `git log -p -S "password"`,
      },
    },
    whatHappened:
      'The OSINT board simulated public DNS queries, WHOIS registrar databases, and Git revision trees.',
    vulnerabilityExplanation:
      'Information disclosure supplies adversaries with usernames and credentials necessary for targeted perimeter compromise.',
    detectionMethods: ['Automated repository secret scanning alerting on credential commits'],
    preventionAndMitigation: ['Enable pre-commit hooks to block secrets', 'Store secrets in dedicated secret managers'],
    knowledgeCheck: {
      question: 'If a developer accidentally commits an API key to a public GitHub repository and removes it in the next commit, is the key secure?',
      options: [
        'Yes, because the current version of the code no longer displays the key',
        'No, because the key remains permanently visible in the Git commit history and must be revoked immediately',
        'Yes, GitHub automatically deletes commit histories after 24 hours',
        'No, but only if the developer marks the repository as private afterwards',
      ],
      correctIndex: 1,
      explanation:
        'Git retains the entire history of all commits. Anyone can inspect previous commit diffs to retrieve the deleted secret.',
    },
    simulationType: 'osint',
    badgeAwarded: {
      id: 'badge-osint-investigator',
      name: 'OSINT Specialist',
      description: 'Mastered open source intelligence, Git leak auditing, and footprint reduction.',
      icon: '🔎',
    },
  },

  // CHAPTER 13: CLOUD SECURITY & ARCHITECTURE
  {
    id: 'cloud-s3-iam-misconfig-lab',
    slug: 'cloud-s3-iam-misconfig',
    title: 'Cloud Storage Bucket & IAM Policy Misconfiguration Lab',
    chapterNumber: 13,
    chapterId: 'chapter-13',
    chapterSlug: 'chapter-13',
    chapterTitle: 'Cloud Security & Architecture',
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    icon: 'cloud',
    summary: 'Audit an insecure AWS-style cloud storage bucket policy exposing corporate financial backups to the public internet, refactor the JSON policy, and enforce IAM least privilege.',
    learningObjectives: [
      'Analyze JSON cloud access policies (Principal, Action, Resource, Effect)',
      'Understand how wildcard `Principal: "*"` exposes cloud assets to anonymous internet requests',
      'Refactor bucket policies to enforce VPC endpoint and IAM role restrictions',
      'Verify how Cloud "Block Public Access" guardrails prevent accidental data leaks',
    ],
    scenario:
      'An enterprise cloud bucket named `studyverse-finance-backups` was mistakenly configured with a permissive resource policy. Audit the current JSON policy, test anonymous download access, refactor the policy using the Principle of Least Privilege, and verify that public requests are blocked.',
    toolsAndConcepts: ['Cloud Storage Buckets', 'IAM Policy Grammar (JSON)', 'Wildcard Principals (*)', 'VPC Endpoint Restriction', 'Shared Responsibility Model'],
    steps: [
      {
        id: 'cloud-step-1',
        stepNumber: 1,
        title: 'Inspect Insecure Cloud Policy',
        instruction: 'Review the active bucket policy for `studyverse-finance-backups`. Examine the Principal and Action directives.',
        expectedResult: 'The policy specifies `"Principal": "*"` and `"Action": "s3:GetObject"`, allowing anyone to download files.',
      },
      {
        id: 'cloud-step-2',
        stepNumber: 2,
        title: 'Simulate Anonymous Curl Request',
        instruction: 'Click "Execute Public Download Probe" to simulate an unauthenticated web request.',
        expectedResult: 'The server returns HTTP 200 OK and serves the sensitive document to an anonymous requester.',
      },
      {
        id: 'cloud-step-3',
        stepNumber: 3,
        title: 'Apply Hardened Policy & Block Public Access',
        instruction: 'Deploy hardened IAM policy restricting access to the internal finance role via VPC.',
        expectedResult: 'Public anonymous access returns HTTP 403 Access Denied.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'Wildcard Principals',
        content: 'In IAM policies, "Principal": "*" means any identity in the world.',
      },
      {
        tier: 2,
        title: 'Condition Keys',
        content: 'Restrict access to specific networks using Condition blocks like aws:sourceVpce.',
      },
      {
        tier: 3,
        title: 'Shared Responsibility',
        content: 'Customers are strictly responsible for configuring IAM access policies and data privacy.',
      },
    ],
    solution: {
      answer: 'Replace `"Principal": "*"` with specific IAM role ARNs and enable Account-Level Block Public Access.',
      detailedExplanation:
        'By default, buckets should have public access entirely blocked at the account level. When programmatic access is required, restrict callers to designated IAM roles.',
      codeSnippet: {
        language: 'json',
        filename: 'hardened_bucket_policy.json',
        code: `{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Deny",\n    "Principal": "*",\n    "Action": "s3:*",\n    "Resource": "arn:aws:s3:::studyverse-finance-backups/*",\n    "Condition": { "Bool": { "aws:SecureTransport": "false" } }\n  }]\n}`,
      },
    },
    whatHappened:
      'The cloud simulator parsed JSON policy statements and evaluated permission conditions against incoming request identities.',
    vulnerabilityExplanation:
      'Overly permissive cloud policies grant read or write permissions to unauthorized external users.',
    detectionMethods: ['Cloud security posture management tools (CSPM) flagging public buckets'],
    preventionAndMitigation: ['Enable S3 Block Public Access at organization level', 'Enforce least privilege'],
    knowledgeCheck: {
      question: 'Under the Cloud Shared Responsibility Model, who is responsible for ensuring an S3 storage bucket policy does not allow public anonymous downloads?',
      options: [
        'The Cloud Service Provider (e.g. AWS / Google Cloud)',
        'The Customer / Cloud Tenant',
        'The Internet Service Provider',
        'The Hardware Manufacturer',
      ],
      correctIndex: 1,
      explanation:
        'Under the Shared Responsibility Model, the customer is strictly responsible for security in the cloud, including IAM policies and access configurations.',
    },
    simulationType: 'cloud-security',
    badgeAwarded: {
      id: 'badge-cloud-architect',
      name: 'Cloud Armor',
      description: 'Mastered IAM policy JSON, bucket access controls, and cloud least privilege.',
      icon: '☁️',
    },
  },

  // CHAPTER 14: IOT SECURITY & EMBEDDED SYSTEMS
  {
    id: 'iot-mqtt-broker-lab',
    slug: 'iot-mqtt-broker',
    title: 'IoT MQTT Broker Exploitation & Access Control Lab',
    chapterNumber: 14,
    chapterId: 'chapter-14',
    chapterSlug: 'chapter-14',
    chapterTitle: 'IoT Security & Embedded Systems',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    icon: 'cpu',
    summary: 'Connect to an unauthenticated MQTT message broker running smart building sensors, sniff unencrypted telemetry via wildcard subscription (`#`), send rogue commands, and secure the broker with TLS and topic ACLs.',
    learningObjectives: [
      'Understand the publish/subscribe messaging architecture of MQTT in IoT environments',
      'Demonstrate how wildcard topic subscriptions (`#`) allow an attacker to sniff entire device networks',
      'Simulate unauthorized command injection to override physical actuators (smart door lock)',
      'Secure IoT brokers by enforcing mutual TLS, authentication credentials, and topic-level Access Control Lists (ACLs)',
    ],
    scenario:
      'You are inspecting a smart building facility management system. The IoT devices communicate with an internal MQTT broker. The broker was deployed with default settings: no authentication and no topic access controls. Discover telemetry data and secure the broker.',
    toolsAndConcepts: ['MQTT Protocol (Pub/Sub)', 'Topic Wildcards (+ and #)', 'Unauthenticated Brokers', 'Topic ACLs'],
    steps: [
      {
        id: 'iot-step-1',
        stepNumber: 1,
        title: 'Subscribe to Wildcard Topic (#)',
        instruction: 'In the MQTT client console, enter topic `#` and click "Subscribe".',
        expectedResult: 'The console floods with unencrypted real-time telemetry: room temperatures and security badge scans.',
      },
      {
        id: 'iot-step-2',
        stepNumber: 2,
        title: 'Publish Unauthorized Actuator Command',
        instruction: 'Publish payload `{"command": "UNLOCK", "override": true}` to topic `building/perimeter/door101/control`.',
        expectedResult: 'Because the broker lacks authorization, the smart door lock receives the command and displays STATUS: UNLOCKED!',
      },
      {
        id: 'iot-step-3',
        stepNumber: 3,
        title: 'Apply MQTT Security Hardening',
        instruction: 'Toggle "ACLs Enforced" to configure client certificates and restrict topics per client role.',
        expectedResult: 'Unauthorized subscriptions are terminated and the door lock returns to LOCKED state.',
      },
    ],
    hints: [
      {
        tier: 1,
        title: 'The # Wildcard',
        content: 'In MQTT, # is a multi-level wildcard that matches all topics in the broker.',
      },
      {
        tier: 2,
        title: 'Default Port 1883',
        content: 'Port 1883 is standard unencrypted MQTT. Secure MQTT runs over port 8883 using TLS.',
      },
      {
        tier: 3,
        title: 'Topic ACLs',
        content: 'Sensors should only have WRITE permissions for their own telemetry topics.',
      },
    ],
    solution: {
      answer: 'Migrate to MQTTS on port 8883, mandate client certificates, and configure topic ACLs.',
      detailedExplanation:
        'Hardening requires enabling TLS on port 8883, issuing client certificates, and creating granular Access Control Lists (ACLs).',
      codeSnippet: {
        language: 'text',
        filename: 'mosquitto_acl.conf',
        code: `port 8883\nrequire_certificate true\nallow_anonymous false\n\nuser temp_sensor_01\ntopic write building/temperature/room101`,
      },
    },
    whatHappened:
      'The simulated MQTT broker tracked subscriptions and routed published JSON packets across simulated IoT endpoints.',
    vulnerabilityExplanation:
      'Unauthenticated message buses allow remote attackers to eavesdrop on private sensor telemetry and inject commands into physical actuators.',
    detectionMethods: ['Network monitors alerting on unencrypted MQTT traffic on TCP port 1883'],
    preventionAndMitigation: ['Enforce TLS 1.3 on port 8883 and disallow anonymous broker connections'],
    knowledgeCheck: {
      question: 'In the MQTT messaging protocol, what does subscribing to the `#` character do?',
      options: [
        'It subscribes to only the root level topics',
        'It acts as a multi-level wildcard, subscribing the client to all messages published across every topic',
        'It disconnects all other clients currently connected to the broker',
        'It enables encryption on the active channel',
      ],
      correctIndex: 1,
      explanation:
        'In MQTT, # is the multi-level wildcard character that subscribes the client to every topic level.',
    },
    simulationType: 'iot-mqtt',
    badgeAwarded: {
      id: 'badge-iot-defender',
      name: 'IoT Hardener',
      description: 'Mastered MQTT protocol security, topic ACLs, and embedded device isolation.',
      icon: '📡',
    },
  },
];

export const PRACTICALS_MAP: Record<string, PracticalExercise> = ALL_PRACTICALS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    acc[p.slug] = p; // map by slug
    acc[`chapter-${p.chapterNumber}`] = p; // map by chapter, e.g. chapter-3
    acc[`ch-${p.chapterNumber}`] = p;

    // Common aliases for flexible URL routing
    if (p.slug === 'password-security') {
      acc['password'] = p;
      acc['password-cracking'] = p;
      acc['passwords'] = p;
    }
    if (p.slug === 'idor-authorization') {
      acc['idor'] = p;
      acc['broken-object-level-auth'] = p;
    }
    if (p.slug === 'sql-injection') {
      acc['sqli'] = p;
      acc['sql'] = p;
    }
    if (p.slug === 'firewall-packet-filter') {
      acc['firewall'] = p;
      acc['firewalls'] = p;
      acc['packet-filter'] = p;
    }
    if (p.slug === 'crypto-workbench') {
      acc['cryptography'] = p;
      acc['crypto'] = p;
    }
    if (p.slug === 'network-port-scanner') {
      acc['network-scanning'] = p;
      acc['network-scanner'] = p;
      acc['port-scanner'] = p;
    }
    if (p.slug === 'xss-stored-defense') {
      acc['xss'] = p;
      acc['cross-site-scripting'] = p;
    }
    if (p.slug === 'phishing-triage') {
      acc['phishing'] = p;
      acc['phishing-detection'] = p;
    }
    if (p.slug === 'malware-sandbox-analysis') {
      acc['malware'] = p;
      acc['malware-analysis'] = p;
      acc['sandbox-analysis'] = p;
    }
    if (p.slug === 'ddos-rate-limiting') {
      acc['ddos'] = p;
      acc['dos'] = p;
      acc['dos-concepts'] = p;
      acc['rate-limiting'] = p;
    }
    if (p.slug === 'mitm-arp-tls') {
      acc['mitm'] = p;
      acc['man-in-the-middle'] = p;
      acc['arp-spoofing'] = p;
    }
    if (p.slug === 'osint-digital-footprint') {
      acc['osint'] = p;
      acc['reconnaissance'] = p;
    }
    if (p.slug === 'cloud-s3-iam-misconfig') {
      acc['cloud'] = p;
      acc['cloud-security'] = p;
      acc['s3'] = p;
    }
    if (p.slug === 'iot-mqtt-broker') {
      acc['iot'] = p;
      acc['mqtt'] = p;
      acc['iot-mqtt'] = p;
    }
    return acc;
  },
  {} as Record<string, PracticalExercise>
);

export function getPracticalsByChapter(chapterNumber: number): PracticalExercise[] {
  return ALL_PRACTICALS.filter((p) => p.chapterNumber === chapterNumber);
}

export function searchPracticals(query: string): PracticalExercise[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_PRACTICALS;

  return ALL_PRACTICALS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.chapterTitle.toLowerCase().includes(q) ||
      `chapter ${p.chapterNumber}`.includes(q) ||
      p.difficulty.toLowerCase() === q ||
      p.toolsAndConcepts.some((t) => t.toLowerCase().includes(q))
  );
}

