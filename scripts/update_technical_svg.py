import re

with open('src/components/notes/TechnicalVisualSvg.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CIA Triad SVG
old_cia = """      case 'cia-triad':
        return (
          <svg viewBox="0 0 700 360" className="tech-svg" role="img" aria-label="The CIA Triad Architecture">
            <defs>
              <radialGradient id="cia-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#168BFF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--svg-bg, #02060C)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="edge-c-i" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#63D9FF" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
              <linearGradient id="edge-i-a" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#FF9D32" />
              </linearGradient>
              <linearGradient id="edge-a-c" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9D32" />
                <stop offset="100%" stopColor="#63D9FF" />
              </linearGradient>
            </defs>
            <circle cx="350" cy="180" r="160" fill="url(#cia-glow)" />

            {/* Connecting Triangle Edges */}
            <polygon points="350,55 540,280 160,280" fill="rgba(22, 139, 255, 0.05)" stroke="rgba(99, 217, 255, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="350" y1="55" x2="540" y2="280" stroke="url(#edge-c-i)" strokeWidth="3" />
            <line x1="540" y1="280" x2="160" y2="280" stroke="url(#edge-i-a)" strokeWidth="3" />
            <line x1="160" y1="280" x2="350" y2="55" stroke="url(#edge-a-c)" strokeWidth="3" />

            {/* Center Core */}
            <circle cx="350" cy="195" r="38" fill="var(--svg-node-bg, #050B14)" stroke="var(--svg-cyan, #63D9FF)" strokeWidth="2" />
            <text x="350" y="191" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="12" fontWeight="700">INFOSEC</text>
            <text x="350" y="208" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="10" fontWeight="600">BALANCE</text>

            {/* Top Node: Confidentiality */}
            <g transform="translate(350, 55)">
              <circle cx="0" cy="0" r="32" fill="var(--svg-node-bg, #050B14)" stroke="var(--svg-cyan, #63D9FF)" strokeWidth="2" />
              <text x="0" y="-3" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="12" fontWeight="bold">C</text>
              <text x="0" y="13" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="9">Privacy</text>
              <text x="0" y="-42" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="13" fontWeight="700">CONFIDENTIALITY</text>
              <text x="0" y="-28" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Encryption · Access Controls</text>
            </g>

            {/* Right Node: Integrity */}
            <g transform="translate(540, 280)">
              <circle cx="0" cy="0" r="32" fill="var(--svg-node-bg, #050B14)" stroke="#22C55E" strokeWidth="2" />
              <text x="0" y="-3" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="bold">I</text>
              <text x="0" y="13" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="9">Accuracy</text>
              <text x="0" y="48" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="13" fontWeight="700">INTEGRITY</text>
              <text x="0" y="62" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Hashing · Digital Signatures</text>
            </g>

            {/* Left Node: Availability */}
            <g transform="translate(160, 280)">
              <circle cx="0" cy="0" r="32" fill="var(--svg-node-bg, #050B14)" stroke="#FF9D32" strokeWidth="2" />
              <text x="0" y="-3" textAnchor="middle" fill="#FF9D32" fontSize="12" fontWeight="bold">A</text>
              <text x="0" y="13" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="9">Uptime</text>
              <text x="0" y="48" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="13" fontWeight="700">AVAILABILITY</text>
              <text x="0" y="62" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Redundancy · Backups · DDoS Defense</text>
            </g>
          </svg>
        );"""

new_cia = """      case 'cia-triad':
        return (
          <svg viewBox="0 0 740 430" className="tech-svg" role="img" aria-label="The CIA Triad Architecture">
            <defs>
              <radialGradient id="cia-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#168BFF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--svg-bg, #02060C)" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="edge-c-i" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#63D9FF" />
                <stop offset="100%" stopColor="#22C55E" />
              </linearGradient>
              <linearGradient id="edge-i-a" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#FF9D32" />
              </linearGradient>
              <linearGradient id="edge-a-c" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9D32" />
                <stop offset="100%" stopColor="#63D9FF" />
              </linearGradient>
            </defs>
            <circle cx="370" cy="235" r="170" fill="url(#cia-glow)" />

            {/* Connecting Triangle Edges */}
            <polygon points="370,110 575,320 165,320" fill="rgba(22, 139, 255, 0.05)" stroke="rgba(99, 217, 255, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="370" y1="110" x2="575" y2="320" stroke="url(#edge-c-i)" strokeWidth="3" />
            <line x1="575" y1="320" x2="165" y2="320" stroke="url(#edge-i-a)" strokeWidth="3" />
            <line x1="165" y1="320" x2="370" y2="110" stroke="url(#edge-a-c)" strokeWidth="3" />

            {/* Center Core */}
            <circle cx="370" cy="235" r="44" fill="var(--svg-node-bg, #050B14)" stroke="var(--svg-cyan, #63D9FF)" strokeWidth="2.5" />
            <text x="370" y="231" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="13" fontWeight="800" letterSpacing="0.05em">INFOSEC</text>
            <text x="370" y="249" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="11" fontWeight="700">BALANCE</text>

            {/* Top Node: Confidentiality (Labels positioned with ample clearance above circle to prevent any text collisions) */}
            <g transform="translate(370, 110)">
              <circle cx="0" cy="0" r="35" fill="var(--svg-node-bg, #050B14)" stroke="var(--svg-cyan, #63D9FF)" strokeWidth="2.5" />
              <text x="0" y="-4" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="16" fontWeight="bold">C</text>
              <text x="0" y="14" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10.5" fontWeight="600">Privacy</text>
              <text x="0" y="-62" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="14" fontWeight="800" letterSpacing="0.08em">CONFIDENTIALITY</text>
              <text x="0" y="-45" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="11" fontWeight="600">Encryption · Access Controls · Data Privacy</text>
            </g>

            {/* Right Node: Integrity (Labels positioned cleanly below circle) */}
            <g transform="translate(575, 320)">
              <circle cx="0" cy="0" r="35" fill="var(--svg-node-bg, #050B14)" stroke="#22C55E" strokeWidth="2.5" />
              <text x="0" y="-4" textAnchor="middle" fill="#22C55E" fontSize="16" fontWeight="bold">I</text>
              <text x="0" y="14" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10.5" fontWeight="600">Accuracy</text>
              <text x="0" y="58" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="14" fontWeight="800" letterSpacing="0.08em">INTEGRITY</text>
              <text x="0" y="74" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="11" fontWeight="600">Hashing · Digital Signatures · Tamper Proofing</text>
            </g>

            {/* Left Node: Availability (Labels positioned cleanly below circle) */}
            <g transform="translate(165, 320)">
              <circle cx="0" cy="0" r="35" fill="var(--svg-node-bg, #050B14)" stroke="#FF9D32" strokeWidth="2.5" />
              <text x="0" y="-4" textAnchor="middle" fill="#FF9D32" fontSize="16" fontWeight="bold">A</text>
              <text x="0" y="14" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10.5" fontWeight="600">Uptime</text>
              <text x="0" y="58" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="14" fontWeight="800" letterSpacing="0.08em">AVAILABILITY</text>
              <text x="0" y="74" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="11" fontWeight="600">Redundancy · Backups · DDoS Defense</text>
            </g>
          </svg>
        );"""

# Normalize line breaks for matching
norm_content = content.replace('\r\n', '\n')
norm_old = old_cia.replace('\r\n', '\n')
norm_new = new_cia.replace('\r\n', '\n')

assert norm_old in norm_content, "old_cia block not found"
norm_content = norm_content.replace(norm_old, norm_new, 1)

# Replace dark fills in other SVGs with theme variables
norm_content = norm_content.replace('fill="#03070f"', 'fill="var(--svg-subbox-bg, #03070f)"')
norm_content = norm_content.replace('fill="#0F172A"', 'fill="var(--svg-card-bg, #0F172A)"')
norm_content = norm_content.replace('fill="#1C0808"', 'fill="var(--svg-danger-bg, #1C0808)"')
norm_content = norm_content.replace('fill="#05180C"', 'fill="var(--svg-success-bg, #05180C)"')
norm_content = norm_content.replace('fill="#0A1828"', 'fill="var(--svg-info-bg, #0A1828)"')

with open('src/components/notes/TechnicalVisualSvg.tsx', 'w', encoding='utf-8') as f:
    f.write(norm_content)

print("Successfully updated TechnicalVisualSvg.tsx!")

