import type { Chapter } from '../types';

export const chapter06: Chapter = {
  "id": "chapter-06",
  "number": 6,
  "romanNumeral": "VI",
  "title": "SQL Injection",
  "subtitle": "Relational Database Exploitation, Query Manipulation, and Parameterized Defenses",
  "category": "Web Security",
  "readTime": "6 min read",
  "summary": "Examines SQL Injection mechanics, demonstrating how unescaped user input alters relational database query logic and how parameterized prepared statements neutralize the threat.",
  "introParagraphs": [
    "SQL Injection is an attack in which malicious input is inserted into an application's SQL query.",
    "Databases store an enterprise's most valuable assets: user accounts, financial records, authentication hashes, and proprietary business secrets. SQL Injection allows attackers to bypass application logic and execute raw commands directly on the database engine."
  ],
  "topics": [
    {
      "id": "topic-6-1",
      "number": "6.1",
      "title": "Introduction to SQL Injection",
      "content": [
        "SQL Injection (SQLi) is an attack where malicious input is inserted into an application's SQL query.",
        "It can allow an attacker to access or modify database information.",
        "SQL Injection \u2192 Malicious input affects a database query."
      ],
      "definitions": [
        {
          "term": "SQL Injection (SQLi)",
          "definition": "A code injection technique in which malicious SQL statements are inserted into entry fields for execution by the underlying database.",
          "keyTakeaway": "SQL Injection \u2192 Malicious input affects a database query."
        }
      ]
    },
    {
      "id": "topic-6-2",
      "number": "6.2",
      "title": "Simple Example & Query Manipulation",
      "content": [
        "Suppose a login system creates a database query using user input without proper protection.",
        "If the application naively concatenates user strings into the SQL statement, an attacker can input syntax characters like single quotes (') and boolean logic to subvert the query."
      ],
      "diagrams": [
        {
          "title": "Insecure Database Query Processing Flow",
          "caption": "How raw user strings flow unchecked into the database engine.",
          "orientation": "vertical",
          "steps": [
            {
              "label": "Username & Password Input",
              "sublabel": "User enters: admin' OR '1'='1"
            },
            {
              "label": "Application Backend",
              "sublabel": "String concatenation: SELECT * FROM users WHERE user='admin' OR '1'='1' AND pass=..."
            },
            {
              "label": "Database Execution Engine",
              "sublabel": "Boolean condition evaluates to TRUE for all rows",
              "highlight": true
            },
            {
              "label": "Authentication Bypass",
              "sublabel": "Attacker logged in as first database user (admin)"
            }
          ]
        }
      ],
      "codeSnippets": [
        {
          "language": "sql",
          "title": "Insecure String Concatenation vs Secure Parameterized Query",
          "vulnerableCode": "-- INSECURE: Vulnerable to SQL Injection via string interpolation\nSELECT * FROM accounts WHERE username = '' + userInput + '' AND password = '' + passInput + '';",
          "secureCode": "-- SECURE: Parameterized Query / Prepared Statement\nSELECT * FROM accounts WHERE username = ? AND password = ?;\n-- Parameters are sent separately from the SQL statement template.",
          "explanation": "Parameterized queries compile the query structure first. The database engine treats parameter values strictly as literal data, never executable syntax."
        }
      ]
    },
    {
      "id": "topic-6-3",
      "number": "6.3",
      "title": "Effects of SQL Injection",
      "content": [
        "SQL Injection is considered one of the highest-severity vulnerabilities because it directly grants access to relational databases."
      ],
      "examples": [
        {
          "title": "High-Impact SQL Injection Consequences",
          "scenario": "The destructive reach of an unmitigated SQL injection vulnerability:",
          "breakdown": [
            {
              "label": "Read Sensitive Data",
              "detail": "Dump entire customer database, credit card numbers, password hashes."
            },
            {
              "label": "Modify Stored Data",
              "detail": "Alter account balances, administrative privilege flags, or order statuses."
            },
            {
              "label": "Delete Data",
              "detail": "Drop tables or purge audit logs using injected DROP TABLE or TRUNCATE statements."
            },
            {
              "label": "Bypass Authentication",
              "detail": "Login as any user without knowing their password via boolean logic injection."
            }
          ]
        }
      ]
    },
    {
      "id": "topic-6-4",
      "number": "6.4",
      "title": "Protection Against SQL Injection",
      "content": [
        "The primary and definitive protection against SQL Injection is the universal use of parameterized queries (also known as prepared statements).",
        "SQL Injection Protection \u2192 Use parameterized queries."
      ],
      "definitions": [
        {
          "term": "Parameterized Queries",
          "definition": "A database programming technique where the SQL command structure is compiled separately from data parameters, preventing user input from altering query syntax.",
          "keyTakeaway": "The gold standard protection against SQL Injection."
        }
      ],
      "examples": [
        {
          "title": "Multi-Layer SQL Defense",
          "scenario": "Comprehensive database security architecture:",
          "breakdown": [
            {
              "label": "Parameterized Queries",
              "detail": "Use PDO in PHP, PreparedStatement in Java, or ORMs (Prisma/TypeORM)."
            },
            {
              "label": "Input Validation",
              "detail": "Verify incoming datatypes (e.g. numeric IDs must be integers)."
            },
            {
              "label": "Least-Privilege DB Accounts",
              "detail": "Web application database user should only have SELECT/INSERT/UPDATE; forbid DROP TABLE."
            },
            {
              "label": "Proper Error Handling",
              "detail": "Suppress database engine stack traces from client responses to prevent SQL error reconnaissance."
            }
          ]
        }
      ],
      "keyPoints": [
        "Parameterized queries (prepared statements) neutralize SQL injection completely.",
        "Never construct SQL commands through string formatting or dynamic concatenation."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "SQL Injection",
      "summary": "An attack that manipulates SQL queries through malicious, unescaped user input."
    },
    {
      "topic": "Possible Effects",
      "summary": "Read, modify, delete database information, or bypass authentication."
    },
    {
      "topic": "Main Protection",
      "summary": "Parameterized queries (prepared statements)."
    },
    {
      "topic": "Supporting Defenses",
      "summary": "Least privilege database accounts, strict input validation, and secure error handling."
    }
  ],
  "rememberPoints": [
    "SQL Injection Protection \u2192 Use parameterized queries",
    "Never concatenate user strings into SQL queries: Data \u2260 Code"
  ],
  "examQuestions": [
    {
      "question": "Explain how parameterized queries (prepared statements) prevent SQL Injection attacks.",
      "answerGuidance": "Explain that the database query plan is pre-compiled before parameter values are bound. When parameters arrive, the database parser treats them strictly as literal scalar values, completely ignoring any quotes, SQL keywords, or boolean operators inside the input."
    },
    {
      "question": "Discuss four catastrophic effects of SQL injection on an enterprise database.",
      "answerGuidance": "Cover authentication bypass (logging in as admin), confidential data exfiltration (credit card theft), data modification (tampering with balances), and total data destruction (dropping tables)."
    }
  ],
  "attackVisualizations": [
      {
          "id": "attack-6-1",
          "title": "Classic Authentication Bypass via Tautology SQL Injection",
          "attackName": "SQLi Tautology & In-Band Authentication Bypass",
          "overview": "An attacker enters SQL syntax into a login form to alter the query logic, creating a condition that is always true (tautology) and logging in as administrator without a password.",
          "targetVulnerability": "Backend concatenates raw user input directly into SQL command strings instead of using parameterized prepared statements.",
          "stages": [
              {
                  "step": 1,
                  "title": "Input Submission with SQL Delimiter",
                  "actor": "Attacker",
                  "action": "Enters quote delimiter and boolean tautology into login form",
                  "technicalDetail": "In the username field, the attacker types: admin' OR '1'='1 and enters any arbitrary password in the password field.",
                  "color": "red",
                  "payload": "POST /login HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin' OR '1'='1&password=anything"
              },
              {
                  "step": 2,
                  "title": "Unsafe Query String Concatenation",
                  "actor": "Backend Web Application",
                  "action": "Builds SQL statement string via direct variable interpolation",
                  "technicalDetail": "The server constructs the query: SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'.",
                  "color": "orange"
              },
              {
                  "step": 3,
                  "title": "Parser Logic Restructuring",
                  "actor": "Database SQL Parser",
                  "action": "Evaluates boolean expression altered by injected syntax",
                  "technicalDetail": "Due to operator precedence, the database evaluates: (username = 'admin') OR ('1'='1' AND password = '...'). Since '1'='1' is TRUE, the entire WHERE clause evaluates to TRUE.",
                  "color": "red"
              },
              {
                  "step": 4,
                  "title": "Administrative Record Return",
                  "actor": "Database Engine",
                  "action": "Returns the first matching user row (the admin record)",
                  "technicalDetail": "The database returns row #1: the administrator account record, completely ignoring the invalid password.",
                  "color": "red"
              },
              {
                  "step": 5,
                  "title": "Full Administrative Session Grant",
                  "actor": "Application Backend",
                  "action": "Signs admin session cookie and redirects to dashboard",
                  "technicalDetail": "The application observes a returned user record, assumes authentication succeeded, and grants full administrator privileges.",
                  "color": "red"
              },
              {
                  "step": 6,
                  "title": "Prepared Statements Defense",
                  "actor": "Database Driver with Prepared Statement",
                  "action": "Compiles query template beforehand; treats input strictly as literal data",
                  "technicalDetail": "With parameterized queries, the input admin' OR '1'='1 is matched literally against the username column. No user exists with that literal name; authentication fails safely.",
                  "color": "green"
              }
          ],
          "mitigation": {
              "title": "Robust SQL Injection Defenses",
              "rules": [
                  "Always use Parameterized Queries (Prepared Statements) for all SQL database interactions.",
                  "Utilize reputable Object-Relational Mappers (ORMs) like Prisma, Hibernate, or Entity Framework.",
                  "Apply the Principle of Least Privilege: ensure application database accounts have minimal permissions (no DROP or administrative rights).",
                  "Deploy a Web Application Firewall (WAF) to detect and block common SQL injection signatures."
              ]
          }
      }
  ],
  "beforeAfterComparisons": [
      {
          "title": "Database Queries: String Interpolation vs. Parameterized Prepared Statements",
          "vulnerable": {
              "label": "Vulnerable: String Concatenation Query Construction",
              "codeOrConfig": "# INSECURE: Direct string formatting enables SQL Injection\ndef authenticate_user(username, password):\n    query = f\"SELECT id, role FROM users WHERE username = '{username}' AND password = '{password}'\"\n    # If username is: admin' OR '1'='1 --\n    # The entire query logic is subverted!\n    cursor.execute(query)\n    return cursor.fetchone()",
              "explanation": "User input breaks out of the data context and becomes executable SQL command syntax, allowing attackers to bypass authentication or extract entire tables via UNION SELECT."
          },
          "secure": {
              "label": "Secure: Parameterized Prepared Statements",
              "codeOrConfig": "# SECURE: Prepared statement treats input strictly as literal values\ndef authenticate_user(username, password):\n    query = \"SELECT id, password_hash, role FROM users WHERE username = %s\"\n    cursor.execute(query, (username,)) # Parameter passed separately!\n    user = cursor.fetchone()\n    if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):\n        return user\n    return None",
              "explanation": "The database compiles the SQL statement structure prior to binding parameter values. Characters like quotes and semicolons are treated strictly as literal data, making SQL injection impossible."
          },
          "keyTakeaway": "Prepared statements separate code from data. Input can never change query structure when parameters are bound."
      }
  ],
  "handsOnPracticals": [
      {
          "id": "practical-6-1",
          "title": "Refactoring Vulnerable SQLite Database Queries into Secure Prepared Statements",
          "learningObjective": "Demonstrate how string concatenation permits SQL injection and refactor the code into secure prepared statements using SQLite in Python.",
          "requiredTools": [
              "python3",
              "sqlite3"
          ],
          "environmentSetup": "Local terminal with Python 3.",
          "steps": [
              {
                  "stepNumber": 1,
                  "instruction": "Create an in-memory SQLite database populated with sample user accounts.",
                  "command": "python3 -c \"import sqlite3; con = sqlite3.connect(':memory:'); cur = con.cursor(); cur.execute('CREATE TABLE users (id INT, name TEXT, pass TEXT)'); cur.execute(\\\"INSERT INTO users VALUES (1, 'admin', 'SuperSecret99')\\\"); con.commit(); print('Database initialized with admin row')\"",
                  "commandExplanation": "Initializes a temporary in-memory database with an admin user row.",
                  "expectedOutput": "Database initialized with admin row"
              },
              {
                  "stepNumber": 2,
                  "instruction": "Demonstrate authentication bypass using string concatenation with tautology payload.",
                  "command": "python3 -c \"import sqlite3; con = sqlite3.connect(':memory:'); cur = con.cursor(); cur.execute('CREATE TABLE users (id INT, name TEXT, pass TEXT)'); cur.execute(\\\"INSERT INTO users VALUES (1, 'admin', 'SuperSecret99')\\\"); user_input = \\\"admin' OR '1'='1\\\"; query = f\\\"SELECT * FROM users WHERE name = '{user_input}'\\\"; print('Executed query:', query); print('Result:', cur.execute(query).fetchall())\"",
                  "commandExplanation": "Concatenates the unescaped input into the query string, resulting in an unauthorized dump of the admin record.",
                  "expectedOutput": "Executed query: SELECT * FROM users WHERE name = 'admin' OR '1'='1'\nResult: [(1, 'admin', 'SuperSecret99')]"
              },
              {
                  "stepNumber": 3,
                  "instruction": "Test the same payload against a parameterized prepared statement.",
                  "command": "python3 -c \"import sqlite3; con = sqlite3.connect(':memory:'); cur = con.cursor(); cur.execute('CREATE TABLE users (id INT, name TEXT, pass TEXT)'); cur.execute(\\\"INSERT INTO users VALUES (1, 'admin', 'SuperSecret99')\\\"); user_input = \\\"admin' OR '1'='1\\\"; query = 'SELECT * FROM users WHERE name = ?'; print('Result with parameter binding:', cur.execute(query, (user_input,)).fetchall())\"",
                  "commandExplanation": "Binds the payload safely as a single literal string parameter. No user exists with that literal name, so empty list is returned.",
                  "expectedOutput": "Result with parameter binding: []"
              }
          ],
          "whatHappened": "The concatenated query executed the attacker's OR '1'='1 logic and leaked the administrator record. In the parameterized query, SQLite treated the entire payload as literal text, safely returning an empty result set.",
          "securityLessons": [
              "String formatting (f-strings, %s, concatenation) in SQL queries is the root cause of SQL injection.",
              "Parameterized queries completely separate SQL instruction compilation from user data values.",
              "Input validation (e.g. alphanumeric checks) is helpful for business logic, but parameterized queries are the mandatory defense."
          ],
          "prevention": [
              "Always use parameterized queries (?) or named placeholders (:name).",
              "Use ORMs like SQLAlchemy, Hibernate, or Prisma.",
              "Restrict database user privileges so web applications cannot execute DROP or schema alterations."
          ]
      }
  ]
};
