import type { Chapter } from '../types';

export const chapter13: Chapter = {
  "id": "chapter-13",
  "number": 13,
  "romanNumeral": "XIII",
  "title": "Cloud Security",
  "subtitle": "Cloud Governance, IAM Perimeters, and the Shared Responsibility Model",
  "category": "Network & Cloud Security",
  "readTime": "6 min read",
  "summary": "Examines modern cloud security architecture, detailing identity perimeters, encryption at rest and in transit, and the pivotal Shared Responsibility Model.",
  "introParagraphs": [
    "Cloud Security means protecting cloud systems, applications, networks, and data across shared remote infrastructure.",
    "Moving workloads to public clouds (AWS, Google Cloud, Azure) shifts physical facility management to hyperscalers, transforming security into an API-driven discipline centered on Identity and Access Management (IAM)."
  ],
  "topics": [
    {
      "id": "topic-13-1",
      "number": "13.1",
      "title": "Introduction to Cloud Security",
      "content": [
        "Cloud Security encompasses the broad set of policies, technologies, applications, and controls utilized to protect virtualized IP, data, applications, and services in cloud environments.",
        "Cloud Security \u2192 Protects resources and data in cloud environments."
      ],
      "definitions": [
        {
          "term": "Cloud Security",
          "definition": "The discipline of cybersecurity dedicated to securing cloud computing environments, including data privacy, access control, and regulatory compliance.",
          "keyTakeaway": "Cloud Security \u2192 Protects resources and data in cloud environments."
        }
      ]
    },
    {
      "id": "topic-13-2",
      "number": "13.2",
      "title": "Common Cloud Security Measures",
      "content": [
        "Securing cloud environments requires a layered set of preventative, detective, and corrective controls:"
      ],
      "examples": [
        {
          "title": "The Six Core Cloud Security Controls",
          "scenario": "Standard cloud defense architecture:",
          "breakdown": [
            {
              "label": "Identity & Access Management (IAM)",
              "detail": "Enforces least-privilege role policies and zero-trust credentials (IAM is the new cloud perimeter)."
            },
            {
              "label": "Multi-Factor Authentication (MFA)",
              "detail": "Mandated across root cloud accounts, administrative roles, and CLI federation."
            },
            {
              "label": "Ubiquitous Encryption",
              "detail": "Enforcing AES-256 for data at rest (S3, EBS, databases) and TLS 1.3 for data in transit."
            },
            {
              "label": "Network Security (VPCs & SGs)",
              "detail": "Configuring private subnets, security group stateful rules, and Web Application Firewalls (WAF)."
            },
            {
              "label": "Continuous Monitoring & SIEM",
              "detail": "Aggregating API audit logs (CloudTrail) and anomaly detection for real-time alerting."
            },
            {
              "label": "Automated Backup & Disaster Recovery",
              "detail": "Cross-region replication and immutable snapshots to ensure rapid recovery from outages."
            }
          ]
        }
      ]
    },
    {
      "id": "topic-13-3",
      "number": "13.3",
      "title": "The Shared Responsibility Model",
      "content": [
        "In cloud computing, security responsibilities are shared between the cloud service provider (CSP) and the customer organization.",
        "The cloud provider is responsible for 'Security OF the Cloud' (physical data centers, host hypervisors, server hardware, power, facility security).",
        "The customer is responsible for 'Security IN the Cloud' (customer data, IAM credentials, operating systems, network firewall rules, application code)."
      ],
      "diagrams": [
        {
          "title": "Shared Responsibility Division Flow",
          "caption": "How security obligations combine to achieve total cloud security.",
          "orientation": "horizontal",
          "steps": [
            {
              "label": "Cloud Provider",
              "sublabel": "Security OF the Cloud (Hardware, Facilities, Hypervisors)"
            },
            {
              "label": "+",
              "sublabel": "Collaborative Division"
            },
            {
              "label": "Customer Organization",
              "sublabel": "Security IN the Cloud (Data, IAM, App Code, OS)",
              "highlight": true
            },
            {
              "label": "=",
              "sublabel": "Operational Joint Defense"
            },
            {
              "label": "Total Cloud Security",
              "sublabel": "Continuous Protection"
            }
          ]
        }
      ],
      "tables": [
        {
          "title": "Shared Responsibility Breakdown by Cloud Model",
          "columns": [
            {
              "key": "layer",
              "header": "Architectural Layer"
            },
            {
              "key": "iaas",
              "header": "IaaS (e.g. AWS EC2)"
            },
            {
              "key": "paas",
              "header": "PaaS (e.g. App Engine)"
            },
            {
              "key": "saas",
              "header": "SaaS (e.g. Office 365)"
            }
          ],
          "rows": [
            {
              "layer": "Customer Data & Access",
              "iaas": "Customer",
              "paas": "Customer",
              "saas": "Customer"
            },
            {
              "layer": "Application Code",
              "iaas": "Customer",
              "paas": "Customer",
              "saas": "Provider"
            },
            {
              "layer": "Runtime & Middleware",
              "iaas": "Customer",
              "paas": "Provider",
              "saas": "Provider"
            },
            {
              "layer": "Operating System & Patching",
              "iaas": "Customer",
              "paas": "Provider",
              "saas": "Provider"
            },
            {
              "layer": "Virtualization & Hypervisor",
              "iaas": "Provider",
              "paas": "Provider",
              "saas": "Provider"
            },
            {
              "layer": "Physical Servers & Facilities",
              "iaas": "Provider",
              "paas": "Provider",
              "saas": "Provider"
            }
          ]
        }
      ],
      "keyPoints": [
        "Shared Responsibility \u2192 Cloud security is shared between provider and customer.",
        "The customer is ALWAYS responsible for protecting its data, identities, and access policies regardless of model."
      ]
    }
  ],
  "quickRevision": [
    {
      "topic": "Cloud Security",
      "summary": "Protects virtualized cloud systems, services, applications, and stored customer data."
    },
    {
      "topic": "Core Measures",
      "summary": "IAM least privilege, mandatory MFA, encryption at rest/in transit, VPC firewalls, and audit logging."
    },
    {
      "topic": "Shared Responsibility",
      "summary": "Provider secures underlying hardware and facilities; Customer secures data, OS, apps, and credentials."
    }
  ],
  "rememberPoints": [
    "Cloud Provider + Customer = Cloud Security",
    "Customer is ALWAYS responsible for its data and IAM configurations"
  ],
  "examQuestions": [
    {
      "question": "Explain the Shared Responsibility Model and distinguish between 'Security OF the Cloud' and 'Security IN the Cloud'.",
      "answerGuidance": "Security OF the Cloud is the provider's duty to protect physical data centers, host servers, network cabling, and hypervisors. Security IN the Cloud is the tenant's duty to configure firewall rules, patch guest OSs, encrypt data, and manage user access permissions."
    },
    {
      "question": "Why is Identity and Access Management (IAM) considered the primary security perimeter in modern cloud architecture?",
      "answerGuidance": "In cloud environments, traditional network perimeters dissolve as resources are accessible via internet APIs. Strong IAM with least-privilege role policies and MFA ensures only authorized entities can invoke APIs or access cloud storage."
    }
  ],
  "technicalVisual": {
      "type": "cloud-shared-responsibility",
      "title": "Cloud Shared Responsibility Model Architecture",
      "caption": "Division of security responsibilities between Cloud Service Provider (CSP) and Customer across IaaS (Infrastructure), PaaS (Platform), and SaaS (Software as a Service) models."
  },
  "attackVisualizations": [
      {
          "id": "attack-13-1",
          "title": "Public Cloud Storage Exposure & IAM Privilege Escalation",
          "attackName": "S3 Bucket Misconfiguration & IAM Policy Escalation",
          "overview": "An attacker discovers an unauthenticated public Amazon S3 bucket, downloads application configuration backups containing AWS API keys, and escalates IAM privileges to administrative control.",
          "targetVulnerability": "Public S3 bucket ACL (AllUsers: READ) and overprivileged IAM user permissions allowing iam:CreatePolicyVersion or iam:AttachUserPolicy.",
          "stages": [
              {
                  "step": 1,
                  "title": "OSINT Cloud Reconnaissance",
                  "actor": "Attacker",
                  "action": "Scans public bucket namespaces matching target company name",
                  "technicalDetail": "Attacker uses tools like Cloud-Brute or inspects public JavaScript bundles for S3 endpoints: https://acme-corp-backups.s3.amazonaws.com.",
                  "color": "orange"
              },
              {
                  "step": 2,
                  "title": "Unauthenticated Bucket Enumeration",
                  "actor": "Attacker",
                  "action": "Issues anonymous GET request to the S3 bucket URL",
                  "technicalDetail": "The S3 bucket returns XML listing all stored objects because 'Block Public Access' was disabled and ACL set to AllUsers: READ.",
                  "color": "red",
                  "payload": "GET / HTTP/1.1\nHost: acme-corp-backups.s3.amazonaws.com\n\n<ListBucketResult>\n  <Contents><Key>database_backup_2026.sql.gz</Key></Contents>\n  <Contents><Key>.env.production</Key></Contents>\n</ListBucketResult>"
              },
              {
                  "step": 3,
                  "title": "Credential Extraction from Backup",
                  "actor": "Attacker",
                  "action": "Downloads .env.production and extracts AWS access keys",
                  "technicalDetail": "Attacker extracts AWS_ACCESS_KEY_ID=AKIA... and AWS_SECRET_ACCESS_KEY=... belonging to a developer service account.",
                  "color": "red"
              },
              {
                  "step": 4,
                  "title": "IAM Privilege Enumeration",
                  "actor": "Attacker",
                  "action": "Calls aws sts get-caller-identity and inspects attached policies",
                  "technicalDetail": "Attacker observes the user has iam:CreatePolicyVersion permission on existing custom IAM policies.",
                  "color": "red"
              },
              {
                  "step": 5,
                  "title": "Administrative Privilege Escalation",
                  "actor": "Attacker",
                  "action": "Creates a new default policy version granting wildcard admin rights",
                  "technicalDetail": "Attacker runs aws iam create-policy-version --set-as-default with Action: * and Resource: *, elevating their user account to Full Administrator.",
                  "color": "red",
                  "payload": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":\"*\",\"Resource\":\"*\"}]}"
              },
              {
                  "step": 6,
                  "title": "S3 Block Public Access & SCP Guardrails",
                  "actor": "Cloud Security Architecture",
                  "action": "Enforces Organization SCPs and S3 account-level block",
                  "technicalDetail": "Account-level S3 Block Public Access overrides bucket ACLs, blocking anonymous reads. AWS Organizations Service Control Policies (SCPs) prevent IAM privilege modification.",
                  "color": "green"
              }
          ],
          "mitigation": {
              "title": "Cloud Security & IAM Governance",
              "rules": [
                  "Enable AWS S3 Block Public Access at the AWS Organization root level.",
                  "Enforce the Principle of Least Privilege: never grant wildcard Action: * or Resource: * in IAM policies.",
                  "Deploy AWS Organizations Service Control Policies (SCPs) as immutable guardrails around IAM changes.",
                  "Enable AWS CloudTrail and Amazon GuardDuty to alert on unusual IAM policy version creation."
              ]
          }
      }
  ],
  "beforeAfterComparisons": [
      {
          "title": "Cloud IAM Policy: Overprivileged Wildcard vs. Scoped Least-Privilege Policy",
          "vulnerable": {
              "label": "Vulnerable: Overprivileged Wildcard IAM Policy",
              "codeOrConfig": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"*\",        // INSECURE: Full administrative rights!\n      \"Resource\": \"*\"      // Access to all services across entire cloud\n    }\n  ]\n}",
              "explanation": "If the credentials for this role are leaked via SSRF or an S3 misconfiguration, the attacker gains total control of the entire cloud estate."
          },
          "secure": {
              "label": "Secure: Scoped Least-Privilege IAM Policy",
              "codeOrConfig": "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"ScopedS3ReadOnly\",\n      \"Effect\": \"Allow\",\n      \"Action\": [\n        \"s3:GetObject\",\n        \"s3:ListBucket\"\n      ],\n      \"Resource\": [\n        \"arn:aws:s3:::acme-app-assets\",\n        \"arn:aws:s3:::acme-app-assets/*\"\n      ],\n      \"Condition\": {\n        \"Bool\": { \"aws:SecureTransport\": \"true\" }\n      }\n    }\n  ]\n}",
              "explanation": "Explicitly restricts actions to GetObject and ListBucket, strictly scopes resources to a single named bucket ARN, and enforces HTTPS transport."
          },
          "keyTakeaway": "Apply the Principle of Least Privilege to every IAM role. Never use wildcard * permissions for applications or services."
      }
  ],
  "handsOnPracticals": [
      {
          "id": "practical-13-1",
          "title": "Auditing Cloud IAM Policies for Wildcard Permissions & Enforcing Least Privilege",
          "learningObjective": "Analyze JSON IAM policy documents using Python to detect dangerous wildcard permissions and audit cloud security boundaries.",
          "requiredTools": [
              "python3",
              "json",
              "curl"
          ],
          "environmentSetup": "Local terminal with Python 3.",
          "steps": [
              {
                  "stepNumber": 1,
                  "instruction": "Create a Python auditor script to detect dangerous wildcard actions in IAM policy documents.",
                  "command": "python3 -c \"import json; policy = {'Statement': [{'Action': '*', 'Resource': '*'}]}; print('Wildcard detected!' if any(s.get('Action') == '*' for s in policy['Statement']) else 'Compliant')\"",
                  "commandExplanation": "Parses an IAM policy document and flags administrative wildcard actions.",
                  "expectedOutput": "Wildcard detected!"
              },
              {
                  "stepNumber": 2,
                  "instruction": "Audit a compliant least-privilege policy with scoped actions.",
                  "command": "python3 -c \"import json; policy = {'Statement': [{'Action': ['s3:GetObject'], 'Resource': 'arn:aws:s3:::bucket/*'}]}; has_wildcard = any(s.get('Action') == '*' or s.get('Resource') == '*' for s in policy['Statement']); print('Policy Status:', 'NON-COMPLIANT' if has_wildcard else 'COMPLIANT LEAST-PRIVILEGE')\"",
                  "commandExplanation": "Verifies that scoped action lists and resource ARNs pass security policy validation.",
                  "expectedOutput": "Policy Status: COMPLIANT LEAST-PRIVILEGE"
              },
              {
                  "stepNumber": 3,
                  "instruction": "Inspect AWS S3 Block Public Access configuration parameters.",
                  "command": "python3 -c \"bpa = {'BlockPublicAcls': True, 'IgnorePublicAcls': True, 'BlockPublicPolicy': True, 'RestrictPublicBuckets': True}; print('S3 Block Public Access Status:', 'FULLY SECURED' if all(bpa.values()) else 'VULNERABLE')\"",
                  "commandExplanation": "Checks the four critical Amazon S3 Block Public Access settings required to prevent public leaks.",
                  "expectedOutput": "S3 Block Public Access Status: FULLY SECURED"
              }
          ],
          "whatHappened": "The script successfully audited IAM JSON structures, identifying dangerous administrative wildcards and validating that all four S3 Block Public Access flags were enforced.",
          "securityLessons": [
              "Under the Cloud Shared Responsibility Model, data classification and IAM policy configuration are ALWAYS the customer's responsibility.",
              "Wildcard Action: * in an IAM policy is equivalent to giving root access.",
              "Enforce mandatory multi-factor authentication (MFA) for all IAM users with console access."
          ],
          "prevention": [
              "Enable AWS S3 Block Public Access across the entire AWS Organization.",
              "Use automated IAM policy analyzers (e.g. AWS IAM Access Analyzer).",
              "Rotate access keys regularly and prefer IAM Roles with temporary STS credentials over static keys."
          ]
      }
  ]
};
