interface TechnicalVisualSvgProps {
  type:
    | 'cia-triad'
    | 'client-server-firewall'
    | 'osi-vs-tcpip'
    | 'mitm-attack'
    | 'phishing-flow'
    | 'cloud-shared-responsibility'
    | 'iot-botnet-swarm'
    | 'wpa3-dragonfly';
  title: string;
  caption: string;
}

export function TechnicalVisualSvg({ type, title, caption }: TechnicalVisualSvgProps) {
  const renderSvg = () => {
    switch (type) {
      case 'cia-triad':
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
        );

      case 'client-server-firewall':
        return (
          <svg viewBox="0 0 720 280" className="tech-svg" role="img" aria-label="Firewall Inspection Architecture">
            {/* Client */}
            <g transform="translate(50, 70)">
              <rect x="0" y="0" width="130" height="140" rx="10" fill="var(--svg-node-bg, #050B14)" stroke="#168BFF" strokeWidth="2" />
              <text x="65" y="30" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="13" fontWeight="700">Client / Browser</text>
              <rect x="25" y="45" width="80" height="40" rx="4" fill="#03070f" stroke="rgba(99,217,255,0.2)" />
              <text x="65" y="68" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="10">192.168.1.10</text>
              <text x="65" y="110" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Local Client Zone</text>
            </g>

            {/* Traffic Arrows */}
            {/* Normal Request (Blue) */}
            <path d="M 190,110 L 290,110" stroke="#168BFF" strokeWidth="3" markerEnd="url(#arrow-blue)" />
            <text x="240" y="100" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="10" fontWeight="600">Port 443 (HTTPS)</text>

            {/* Suspicious Traffic (Red) */}
            <path d="M 190,170 L 285,170" stroke="#EF4444" strokeWidth="3" strokeDasharray="5 3" />
            <text x="240" y="162" textAnchor="middle" fill="#F87171" fontSize="10" fontWeight="600">Port 23 (Telnet Scan)</text>

            {/* Stateful Firewall */}
            <g transform="translate(300, 40)">
              <rect x="0" y="0" width="120" height="200" rx="8" fill="#0F172A" stroke="#FF9D32" strokeWidth="2" />
              <rect x="10" y="10" width="100" height="24" rx="4" fill="rgba(255,157,50,0.15)" />
              <text x="60" y="27" textAnchor="middle" fill="#FF9D32" fontSize="11" fontWeight="800">STATEFUL FIREWALL</text>

              {/* Inspection Engine */}
              <circle cx="60" cy="70" r="16" fill="var(--svg-node-bg, #050B14)" stroke="#22C55E" strokeWidth="2" />
              <text x="60" y="74" textAnchor="middle" fill="#22C55E" fontSize="14">✓</text>
              <text x="60" y="98" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="9">Allow Rule: 443</text>

              <circle cx="60" cy="130" r="16" fill="var(--svg-node-bg, #050B14)" stroke="#EF4444" strokeWidth="2" />
              <text x="60" y="135" textAnchor="middle" fill="#EF4444" fontSize="14">✕</text>
              <text x="60" y="158" textAnchor="middle" fill="#F87171" fontSize="9">Drop Rule: 23</text>
            </g>

            {/* Allowed Traffic through to Server */}
            <path d="M 430,110 L 530,110" stroke="#22C55E" strokeWidth="3" />
            <text x="480" y="100" textAnchor="middle" fill="#4ADE80" fontSize="10" fontWeight="600">Inspected Clean</text>

            {/* Target Server */}
            <g transform="translate(540, 70)">
              <rect x="0" y="0" width="130" height="140" rx="10" fill="var(--svg-node-bg, #050B14)" stroke="#22C55E" strokeWidth="2" />
              <text x="65" y="30" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="13" fontWeight="700">App Server</text>
              <rect x="25" y="45" width="80" height="40" rx="4" fill="#03070f" stroke="rgba(34,197,94,0.2)" />
              <text x="65" y="68" textAnchor="middle" fill="#4ADE80" fontSize="10">10.0.0.50</text>
              <text x="65" y="110" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Protected DMZ</text>
            </g>
          </svg>
        );

      case 'osi-vs-tcpip':
        return (
          <svg viewBox="0 0 740 340" className="tech-svg" role="img" aria-label="OSI 7-Layer vs TCP/IP Architecture">
            {/* OSI Column */}
            <g transform="translate(40, 20)">
              <text x="140" y="20" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="14" fontWeight="800">OSI 7-LAYER MODEL</text>
              {[
                { num: '7', name: 'Application (HTTP, DNS)', col: '#63D9FF' },
                { num: '6', name: 'Presentation (TLS, SSL)', col: '#63D9FF' },
                { num: '5', name: 'Session (RPC, Sockets)', col: '#63D9FF' },
                { num: '4', name: 'Transport (TCP, UDP)', col: '#168BFF' },
                { num: '3', name: 'Network (IP, IPsec, ICMP)', col: '#FF9D32' },
                { num: '2', name: 'Data Link (Ethernet, Wi-Fi)', col: '#9BB1C9' },
                { num: '1', name: 'Physical (Cables, Radio)', col: '#475569' },
              ].map((layer, i) => (
                <g key={i} transform={`translate(0, ${36 + i * 36})`}>
                  <rect x="0" y="0" width="280" height="30" rx="4" fill="var(--svg-node-bg, #050B14)" stroke={layer.col} strokeWidth="1.5" />
                  <text x="25" y="20" fill={layer.col} fontSize="12" fontWeight="700">L{layer.num}</text>
                  <text x="60" y="19" fill="var(--svg-text, #E8F2FF)" fontSize="11" fontWeight="600">{layer.name}</text>
                </g>
              ))}
            </g>

            {/* Mappings */}
            <path d="M 330,85 L 410,85" stroke="rgba(99,217,255,0.4)" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 330,158 L 410,158" stroke="rgba(22,139,255,0.4)" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 330,195 L 410,210" stroke="rgba(255,157,50,0.4)" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M 330,250 L 410,265" stroke="rgba(155,177,201,0.4)" strokeWidth="2" strokeDasharray="3 3" />

            {/* TCP/IP Column */}
            <g transform="translate(420, 20)">
              <text x="140" y="20" textAnchor="middle" fill="#22C55E" fontSize="14" fontWeight="800">TCP/IP PROTOCOL SUITE</text>
              {[
                { name: 'Application Layer (HTTP, TLS, DNS)', sub: 'Covers OSI L5 - L7', h: 90, col: '#63D9FF' },
                { name: 'Transport Layer (TCP, UDP)', sub: 'Port-to-Port Transmission', h: 42, col: '#168BFF' },
                { name: 'Internet Layer (IPv4, IPv6, IPsec)', sub: 'Packet Routing & IPsec Tunneling', h: 54, col: '#FF9D32' },
                { name: 'Network Access Layer (Ethernet, 802.11)', sub: 'Frames & Physical Transceivers', h: 60, col: '#9BB1C9' },
              ].map((layer, i) => {
                const yOffsets = [36, 136, 188, 252];
                return (
                  <g key={i} transform={`translate(0, ${yOffsets[i]})`}>
                    <rect x="0" y="0" width="280" height={layer.h} rx="6" fill="var(--svg-node-bg, #050B14)" stroke={layer.col} strokeWidth="1.5" />
                    <text x="18" y="24" fill={layer.col} fontSize="12" fontWeight="700">{layer.name}</text>
                    <text x="18" y="42" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">{layer.sub}</text>
                  </g>
                );
              })}
            </g>
          </svg>
        );

      case 'mitm-attack':
        return (
          <svg viewBox="0 0 720 300" className="tech-svg" role="img" aria-label="Man-in-the-Middle Attack Architecture">
            {/* Client */}
            <g transform="translate(40, 110)">
              <circle cx="50" cy="50" r="42" fill="var(--svg-node-bg, #050B14)" stroke="#168BFF" strokeWidth="2" />
              <text x="50" y="46" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="12" fontWeight="700">Client</text>
              <text x="50" y="62" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="10">Legitimate</text>
            </g>

            {/* Direct Channel with Attack Interception */}
            <path d="M 140,150 Q 360,50 580,150" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="6 3" />
            <text x="360" y="70" textAnchor="middle" fill="#F87171" fontSize="11" fontWeight="700">INTERCEPTED / MODIFIED TRAFFIC</text>

            {/* Attacker in the Middle */}
            <g transform="translate(300, 85)">
              <rect x="0" y="0" width="120" height="110" rx="8" fill="#1C0808" stroke="#EF4444" strokeWidth="2" />
              <text x="60" y="26" textAnchor="middle" fill="#F87171" fontSize="12" fontWeight="800">ATTACKER (MitM)</text>
              <text x="60" y="44" textAnchor="middle" fill="#EF4444" fontSize="10">ARP Poison / Proxy</text>
              <rect x="15" y="55" width="90" height="36" rx="4" fill="var(--svg-node-bg, #050B14)" />
              <text x="60" y="72" textAnchor="middle" fill="#F87171" fontSize="9">Steals Cleartext</text>
              <text x="60" y="84" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="8">Sniffs Passwords</text>
            </g>

            {/* Server */}
            <g transform="translate(580, 110)">
              <circle cx="50" cy="50" r="42" fill="var(--svg-node-bg, #050B14)" stroke="#22C55E" strokeWidth="2" />
              <text x="50" y="46" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="12" fontWeight="700">Bank Server</text>
              <text x="50" y="62" textAnchor="middle" fill="#4ADE80" fontSize="10">Target App</text>
            </g>

            {/* Lower Protected Channel (TLS Tunnel) */}
            <path d="M 140,180 Q 360,270 580,180" fill="none" stroke="#22C55E" strokeWidth="3" />
            <text x="360" y="240" textAnchor="middle" fill="#4ADE80" fontSize="11" fontWeight="700">PROTECTED TLS 1.3 ENCRYPTED TUNNEL</text>
            <text x="360" y="258" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Defeats MitM: Attacker sees only unreadable ciphertext</text>
          </svg>
        );

      case 'phishing-flow':
        return (
          <svg viewBox="0 0 720 280" className="tech-svg" role="img" aria-label="Phishing Attack & Credential Harvest Flow">
            {/* Step 1: Attacker sends email */}
            <g transform="translate(30, 40)">
              <rect x="0" y="0" width="130" height="180" rx="8" fill="var(--svg-node-bg, #050B14)" stroke="#EF4444" strokeWidth="1.5" />
              <text x="65" y="28" textAnchor="middle" fill="#F87171" fontSize="11" fontWeight="800">1. ATTACKER</text>
              <text x="65" y="48" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Crafts spoofed email</text>
              <rect x="15" y="65" width="100" height="40" rx="4" fill="#1C0808" />
              <text x="65" y="82" textAnchor="middle" fill="#F87171" fontSize="9">"Account Suspended!"</text>
              <text x="65" y="96" textAnchor="middle" fill="#FF9D32" fontSize="8">Urgent Call to Action</text>
              <text x="65" y="140" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="9">From: billing@bank-sec.xyz</text>
            </g>

            <path d="M 170,130 L 230,130" stroke="#FF9D32" strokeWidth="2.5" />

            {/* Step 2: Victim Clicks */}
            <g transform="translate(240, 40)">
              <rect x="0" y="0" width="130" height="180" rx="8" fill="var(--svg-node-bg, #050B14)" stroke="#FF9D32" strokeWidth="1.5" />
              <text x="65" y="28" textAnchor="middle" fill="#FF9D32" fontSize="11" fontWeight="800">2. VICTIM CLICK</text>
              <text x="65" y="48" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Clicks phishing link</text>
              <rect x="15" y="65" width="100" height="40" rx="4" fill="#0F172A" />
              <text x="65" y="82" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="9">Browser opens:</text>
              <text x="65" y="96" textAnchor="middle" fill="#F87171" fontSize="8">http://fake-bank-login.com</text>
              <text x="65" y="140" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="9">Unaware of spoofed URL</text>
            </g>

            <path d="M 380,130 L 440,130" stroke="#EF4444" strokeWidth="2.5" />

            {/* Step 3: Spoofed Portal Harvest */}
            <g transform="translate(450, 40)">
              <rect x="0" y="0" width="130" height="180" rx="8" fill="var(--svg-node-bg, #050B14)" stroke="#EF4444" strokeWidth="1.5" />
              <text x="65" y="28" textAnchor="middle" fill="#F87171" fontSize="11" fontWeight="800">3. HARVESTING</text>
              <text x="65" y="48" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Victim submits password</text>
              <rect x="15" y="65" width="100" height="40" rx="4" fill="#1C0808" />
              <text x="65" y="82" textAnchor="middle" fill="#F87171" fontSize="9">User: user@corp.com</text>
              <text x="65" y="96" textAnchor="middle" fill="#F87171" fontSize="9">Pass: Secret123!</text>
              <text x="65" y="140" textAnchor="middle" fill="#F87171" fontSize="9">Stored to Attacker DB</text>
            </g>

            <path d="M 590,130 L 640,130" stroke="#22C55E" strokeWidth="2.5" />

            {/* Defense Barrier */}
            <g transform="translate(650, 40)">
              <rect x="0" y="0" width="50" height="180" rx="6" fill="#05180C" stroke="#22C55E" strokeWidth="2" />
              <text x="25" y="70" textAnchor="middle" fill="#4ADE80" fontSize="11" fontWeight="800" transform="rotate(-90 25 70)">MFA / FIDO2 DEFENSE</text>
              <text x="25" y="140" textAnchor="middle" fill="#22C55E" fontSize="16">🛡️</text>
            </g>
          </svg>
        );

      case 'cloud-shared-responsibility':
        return (
          <svg viewBox="0 0 720 280" className="tech-svg" role="img" aria-label="Shared Responsibility Breakdown">
            <g transform="translate(40, 20)">
              <text x="140" y="20" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="13" fontWeight="800">IaaS (Infrastructure)</text>
              <rect x="0" y="35" width="280" height="70" rx="6" fill="#0A1828" stroke="#168BFF" strokeWidth="1.5" />
              <text x="140" y="60" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="11" fontWeight="700">Customer Responsibility</text>
              <text x="140" y="80" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Data · IAM · OS Patching · Network Firewalls</text>

              <rect x="0" y="115" width="280" height="70" rx="6" fill="#0F172A" stroke="#9BB1C9" strokeWidth="1.5" />
              <text x="140" y="140" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="11" fontWeight="700">Cloud Provider Responsibility</text>
              <text x="140" y="160" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Hypervisor · Physical Servers · Data Center Facilities</text>
            </g>

            <g transform="translate(400, 20)">
              <text x="140" y="20" textAnchor="middle" fill="#22C55E" fontSize="13" fontWeight="800">SaaS (Software as a Service)</text>
              <rect x="0" y="35" width="280" height="40" rx="6" fill="#0A1828" stroke="#168BFF" strokeWidth="1.5" />
              <text x="140" y="58" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="11" fontWeight="700">Customer: Data & User Identity Permissions</text>

              <rect x="0" y="85" width="280" height="100" rx="6" fill="#0F172A" stroke="#22C55E" strokeWidth="1.5" />
              <text x="140" y="115" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="700">Cloud Provider Responsibility</text>
              <text x="140" y="135" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Application Code · Runtimes · Operating System</text>
              <text x="140" y="155" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="10">Databases · Physical Infrastructure · Disaster Recovery</text>
            </g>
          </svg>
        );

      case 'iot-botnet-swarm':
        return (
          <svg viewBox="0 0 720 280" className="tech-svg" role="img" aria-label="IoT Botnet Infection and DDoS Swarm">
            {/* Attacker C2 Server */}
            <g transform="translate(40, 90)">
              <rect x="0" y="0" width="120" height="100" rx="8" fill="#1C0808" stroke="#EF4444" strokeWidth="2" />
              <text x="60" y="30" textAnchor="middle" fill="#F87171" fontSize="11" fontWeight="800">ATTACKER C2</text>
              <text x="60" y="50" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="9">Command & Control</text>
              <text x="60" y="75" textAnchor="middle" fill="#EF4444" fontSize="9">Scans Telnet Port 23</text>
            </g>

            {/* Bot Swarm (Smart Cameras) */}
            <g transform="translate(240, 20)">
              {[
                { name: 'Smart Camera #1', ip: '172.16.0.4', y: 0 },
                { name: 'Smart DVR #2', ip: '172.16.0.18', y: 80 },
                { name: 'Smart Router #3', ip: '172.16.0.95', y: 160 },
              ].map((bot, i) => (
                <g key={i} transform={`translate(0, ${bot.y})`}>
                  <rect x="0" y="0" width="170" height="60" rx="6" fill="var(--svg-node-bg, #050B14)" stroke="#EF4444" strokeWidth="1.5" />
                  <text x="85" y="24" textAnchor="middle" fill="#F87171" fontSize="11" fontWeight="700">🤖 {bot.name}</text>
                  <text x="85" y="42" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="9">Infected via admin:1234 ({bot.ip})</text>
                  <path d="M -70,30 L -10,30" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 2" />
                </g>
              ))}
            </g>

            {/* Synchronized DDoS Traffic */}
            <path d="M 420,50 L 540,120" stroke="#EF4444" strokeWidth="3" />
            <path d="M 420,110 L 540,135" stroke="#EF4444" strokeWidth="4" />
            <path d="M 420,190 L 540,150" stroke="#EF4444" strokeWidth="3" />
            <text x="475" y="95" textAnchor="middle" fill="#FF9D32" fontSize="10" fontWeight="800">1.2 Tbps SYN FLOOD</text>

            {/* Target Enterprise */}
            <g transform="translate(550, 85)">
              <rect x="0" y="0" width="130" height="110" rx="8" fill="#0F172A" stroke="#FF9D32" strokeWidth="2" />
              <text x="65" y="30" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="11" fontWeight="800">VICTIM TARGET</text>
              <text x="65" y="50" textAnchor="middle" fill="#F87171" fontSize="10">Server Overloaded</text>
              <rect x="20" y="65" width="90" height="28" rx="4" fill="#1C0808" />
              <text x="65" y="83" textAnchor="middle" fill="#F87171" fontSize="9">DENIAL OF SERVICE</text>
            </g>
          </svg>
        );

      case 'wpa3-dragonfly':
      default:
        return (
          <svg viewBox="0 0 720 280" className="tech-svg" role="img" aria-label="WPA3 Dragonfly SAE Handshake Architecture">
            {/* Wi-Fi Client */}
            <g transform="translate(60, 60)">
              <rect x="0" y="0" width="150" height="150" rx="10" fill="var(--svg-node-bg, #050B14)" stroke="#168BFF" strokeWidth="2" />
              <text x="75" y="32" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="12" fontWeight="700">Wi-Fi Device</text>
              <text x="75" y="50" textAnchor="middle" fill="var(--svg-cyan, #63D9FF)" fontSize="10">Supplicant</text>
              <rect x="20" y="70" width="110" height="50" rx="4" fill="#03070f" />
              <text x="75" y="90" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="9">Password Scalar</text>
              <text x="75" y="106" textAnchor="middle" fill="#22C55E" fontSize="9">PWE Zero-Knowledge</text>
            </g>

            {/* Bidirectional Dragonfly Exchange */}
            <g transform="translate(230, 80)">
              <path d="M 0,20 L 240,20" stroke="#22C55E" strokeWidth="2.5" />
              <text x="120" y="12" textAnchor="middle" fill="#4ADE80" fontSize="10" fontWeight="700">1. Commit Message (Scalar + Element)</text>

              <path d="M 240,60 L 0,60" stroke="#22C55E" strokeWidth="2.5" />
              <text x="120" y="52" textAnchor="middle" fill="#4ADE80" fontSize="10" fontWeight="700">2. Confirm Message (HMAC Verification)</text>

              <rect x="30" y="80" width="180" height="30" rx="6" fill="rgba(34, 197, 94, 0.1)" stroke="#22C55E" />
              <text x="120" y="100" textAnchor="middle" fill="#22C55E" fontSize="10" fontWeight="800">NO PASSWORD HASH OVER THE AIR</text>
            </g>

            {/* Access Point */}
            <g transform="translate(490, 60)">
              <rect x="0" y="0" width="150" height="150" rx="10" fill="var(--svg-node-bg, #050B14)" stroke="#22C55E" strokeWidth="2" />
              <text x="75" y="32" textAnchor="middle" fill="var(--svg-text, #E8F2FF)" fontSize="12" fontWeight="700">WPA3 Access Point</text>
              <text x="75" y="50" textAnchor="middle" fill="#4ADE80" fontSize="10">Authenticator</text>
              <rect x="20" y="70" width="110" height="50" rx="4" fill="#03070f" />
              <text x="75" y="90" textAnchor="middle" fill="var(--svg-text-subtle, #9BB1C9)" fontSize="9">SAE Validation</text>
              <text x="75" y="106" textAnchor="middle" fill="#22C55E" fontSize="9">Forward Secrecy Key</text>
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="technical-visual-container">
      <div className="tech-visual-header">
        <span className="tech-visual-badge">SYSTEM ARCHITECTURE VISUALIZATION</span>
        <h4 className="tech-visual-title">{title}</h4>
      </div>
      <div className="tech-svg-viewport">{renderSvg()}</div>
      <p className="tech-visual-caption">{caption}</p>
    </div>
  );
}

