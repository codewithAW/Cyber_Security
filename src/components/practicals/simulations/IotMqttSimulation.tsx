import { useState } from 'react';

interface IotMqttSimulationProps {
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

interface MqttMessage {
  id: string;
  topic: string;
  payload: string;
  timestamp: string;
  device: string;
  isCommand?: boolean;
}

export function IotMqttSimulation({ onStepComplete, onSimulationSuccess }: IotMqttSimulationProps) {
  const [isAclEnabled, setIsAclEnabled] = useState(false);
  const [subscribedTopic, setSubscribedTopic] = useState('#');
  const [messages, setMessages] = useState<MqttMessage[]>([
    {
      id: 'm1',
      topic: 'building/floor2/room204/temp',
      payload: '{"celsius": 21.4, "humidity": 45}',
      timestamp: '10:02:11',
      device: 'Sensirion-Temp-01',
    },
    {
      id: 'm2',
      topic: 'building/access/badge_reader_main',
      payload: '{"badgeId": "USR_9921", "granted": true}',
      timestamp: '10:02:15',
      device: 'HID-Access-Scanner',
    },
  ]);
  const [doorState, setDoorState] = useState<'LOCKED' | 'UNLOCKED'>('LOCKED');

  const [publishTopic, setPublishTopic] = useState('building/perimeter/door101/control');
  const [publishPayload, setPublishPayload] = useState('{"command": "UNLOCK", "override": true}');

  const handleSubscribe = () => {
    if (isAclEnabled && subscribedTopic === '#') {
      alert('🔒 MQTT Broker ACL Rejection:\n\nWildcard subscription "#" is rejected. Authorized clients can only subscribe to their designated subtrees.');
      return;
    }

    onStepComplete?.(1);
    setMessages((prev) => [
      {
        id: `m_${Date.now()}`,
        topic: 'building/power/smart_meter',
        payload: '{"voltage": 230.1, "amperage": 14.2}',
        timestamp: new Date().toLocaleTimeString(),
        device: 'SmartMeter-WestWing',
      },
      ...prev,
    ]);
  };

  const handlePublishCommand = () => {
    if (isAclEnabled) {
      alert('🛡️ Access Denied by Mosquitto ACL:\n\nUnauthenticated clients cannot publish to "building/perimeter/door101/control". The smart door lock remains SECURE and LOCKED.');
      onStepComplete?.(3);
      onSimulationSuccess?.();
      return;
    }

    const newMsg: MqttMessage = {
      id: `m_${Date.now()}`,
      topic: publishTopic,
      payload: publishPayload,
      timestamp: new Date().toLocaleTimeString(),
      device: 'Attacker Rogue Client',
      isCommand: true,
    };

    setMessages((prev) => [newMsg, ...prev]);

    if (publishPayload.includes('UNLOCK')) {
      setDoorState('UNLOCKED');
      onStepComplete?.(2);
      onSimulationSuccess?.();
    }
  };

  return (
    <div className="simulation-iot-root">
      <div className="sim-mode-toolbar">
        <div className="sim-mode-info">
          <span className="sim-badge-label">Broker Security Status:</span>
          <span className={`sim-mode-tag ${isAclEnabled ? 'is-secure' : 'is-vulnerable'}`}>
            {isAclEnabled ? '🛡️ Hardened MQTTS (Port 8883, TLS & Granular Topic ACLs)' : '⚠️ Unauthenticated Broker (Port 1883, Open Wildcard #)'}
          </span>
        </div>
        <div className="sim-mode-toggle-wrap">
          <label className="sim-switch">
            <input
              type="checkbox"
              checked={isAclEnabled}
              onChange={(e) => {
                setIsAclEnabled(e.target.checked);
                if (e.target.checked) setDoorState('LOCKED');
              }}
            />
            <span className="sim-slider round" />
          </label>
          <span className="sim-switch-text">{isAclEnabled ? 'ACLs Enforced' : 'Open Broker'}</span>
        </div>
      </div>

      <div className="iot-grid-layout">
        <div className="iot-card">
          <div className="sim-card-header">
            <span className="window-title">📡 MQTT Client Console (Pub/Sub)</span>
          </div>

          <div className="sim-card-body">
            <div className="sim-field-group">
              <label htmlFor="iot-sub-topic">Subscribe to Topic Pattern</label>
              <div className="mqtt-input-row font-mono">
                <input
                  id="iot-sub-topic"
                  type="text"
                  className="sim-input"
                  value={subscribedTopic}
                  onChange={(e) => setSubscribedTopic(e.target.value)}
                />
                <button type="button" className="btn-sim-action" onClick={handleSubscribe}>
                  Subscribe
                </button>
              </div>
              <span className="input-hint text-subtle">
                Hint: <code>#</code> is a multi-level wildcard that listens to all building traffic.
              </span>
            </div>

            <div className="sim-field-group">
              <label htmlFor="iot-pub-topic">Publish Command Payload to Actuator Topic</label>
              <input
                id="iot-pub-topic"
                type="text"
                className="sim-input font-mono mb-2"
                value={publishTopic}
                onChange={(e) => setPublishTopic(e.target.value)}
              />
              <textarea
                rows={2}
                className="sim-input font-mono"
                value={publishPayload}
                onChange={(e) => setPublishPayload(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn-sim-action btn-danger"
              onClick={handlePublishCommand}
            >
              ⚡ Publish Rogue Actuator Command
            </button>
          </div>
        </div>

        <div className="iot-card">
          <div className="sim-card-header db-header">
            <span className="window-title">🚪 Physical Facility Actuator & Message Stream</span>
          </div>

          <div className="sim-card-body">
            <div className="door-actuator-panel">
              <div className="door-status-display">
                <span className="door-icon">{doorState === 'LOCKED' ? '🔒' : '🔓'}</span>
                <div className="door-text">
                  <span className="door-label">Smart Perimeter Door 101:</span>
                  <span
                    className={`door-val font-mono font-bold ${
                      doorState === 'LOCKED' ? 'text-green' : 'text-red'
                    }`}
                  >
                    STATUS: {doorState}
                  </span>
                </div>
              </div>
            </div>

            <div className="telemetry-feed font-mono">
              <div className="feed-title">Captured MQTT Messages:</div>
              {messages.map((m) => (
                <div key={m.id} className={`telemetry-item ${m.isCommand ? 'item-rogue-cmd' : ''}`}>
                  <div className="msg-meta">
                    <span className="msg-topic text-cyan">{m.topic}</span>
                    <span className="msg-time text-subtle">{m.timestamp}</span>
                  </div>
                  <div className="msg-payload">{m.payload}</div>
                  <div className="msg-device text-subtle">Device: {m.device}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

