import { useState } from 'react';
import type { AttackVisualization } from '../../data/notes/types';

interface AttackFlowDiagramProps {
  attack: AttackVisualization;
}

export function AttackFlowDiagram({ attack }: AttackFlowDiagramProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const currentStage = attack.stages.find((s) => s.step === activeStep) || attack.stages[0];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red':
        return 'color-red';
      case 'orange':
        return 'color-orange';
      case 'green':
        return 'color-green';
      case 'blue':
        return 'color-blue';
      case 'gray':
      default:
        return 'color-gray';
    }
  };

  return (
    <div className="attack-visualization-card" id={attack.id}>
      <div className="attack-vis-header">
        <div className="attack-badge-row">
          <span className="attack-section-tag">ATTACK DECONSTRUCTION</span>
          <span className="attack-name-badge">{attack.attackName}</span>
        </div>
        <h3 className="attack-vis-title">{attack.title}</h3>
        <p className="attack-vis-overview">{attack.overview}</p>
        <div className="attack-vuln-bar">
          <span className="vuln-indicator-tag">TARGET VULNERABILITY:</span>
          <span className="vuln-text">{attack.targetVulnerability}</span>
        </div>
      </div>

      {/* INTERACTIVE STEPPER / DIAGRAM TRACK */}
      <div className="attack-stepper-container">
        <div className="stepper-track-header">
          <span className="stepper-instruction">CLICK A STEP TO TRACE THE ATTACK SEQUENCE</span>
          <span className="stepper-counter">
            Step {activeStep} of {attack.stages.length}
          </span>
        </div>

        <div className="attack-nodes-track" role="tablist" aria-label="Attack execution stages">
          {attack.stages.map((stage) => {
            const isSelected = stage.step === activeStep;
            const colorClass = getColorClass(stage.color);

            return (
              <button
                key={stage.step}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`attack-node-pill ${isSelected ? 'is-selected' : ''} ${colorClass}`}
                onClick={() => setActiveStep(stage.step)}
              >
                <div className="node-step-badge">0{stage.step}</div>
                <div className="node-pill-info">
                  <span className="node-pill-actor">{stage.actor}</span>
                  <span className="node-pill-title">{stage.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE STAGE DEEP DIVE DISPLAY */}
      {currentStage && (
        <div className={`attack-stage-detail-panel ${getColorClass(currentStage.color)}`}>
          <div className="stage-panel-header">
            <div className="stage-badge-group">
              <span className="stage-step-tag">STAGE {currentStage.step}</span>
              <span className="stage-actor-tag">{currentStage.actor}</span>
            </div>
            <h4 className="stage-detail-title">{currentStage.title}</h4>
          </div>

          <div className="stage-action-box">
            <span className="stage-label">Action Performed:</span>
            <p className="stage-action-desc">{currentStage.action}</p>
          </div>

          <div className="stage-tech-box">
            <span className="stage-label">What Happens Inside Target System:</span>
            <p className="stage-tech-desc">{currentStage.technicalDetail}</p>
          </div>

          {currentStage.payload && (
            <div className="stage-payload-box">
              <span className="payload-label">Observed Data / Attack Vector:</span>
              <pre className="payload-code">
                <code>{currentStage.payload}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      {/* MITIGATION & DEFENSIVE STRATEGY */}
      {attack.mitigation && (
        <div className="attack-mitigation-panel">
          <div className="mitigation-header">
            <span className="shield-icon" aria-hidden="true">🛡️</span>
            <div>
              <span className="mitigation-tag">DEFENSIVE COUNTERMEASURES</span>
              <h4 className="mitigation-title">{attack.mitigation.title}</h4>
            </div>
          </div>

          <ul className="mitigation-rules-list">
            {attack.mitigation.rules.map((rule, idx) => (
              <li key={idx} className="mitigation-rule-item">
                <span className="rule-checkmark" aria-hidden="true">✓</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          {/* Optional Code Comparison in Mitigation */}
          {attack.mitigation.codeComparison && (
            <div className="mitigation-code-compare">
              <div className="compare-grid">
                <div className="compare-col compare-vulnerable">
                  <div className="compare-banner banner-red">
                    <span className="dot-red" />
                    <span>{attack.mitigation.codeComparison.vulnerableTitle}</span>
                  </div>
                  <pre className="compare-pre">
                    <code>{attack.mitigation.codeComparison.vulnerableCode}</code>
                  </pre>
                </div>

                <div className="compare-col compare-secure">
                  <div className="compare-banner banner-green">
                    <span className="dot-green" />
                    <span>{attack.mitigation.codeComparison.secureTitle}</span>
                  </div>
                  <pre className="compare-pre">
                    <code>{attack.mitigation.codeComparison.secureCode}</code>
                  </pre>
                </div>
              </div>
              <p className="compare-explanation">
                <strong>Why this fixes it:</strong> {attack.mitigation.codeComparison.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

