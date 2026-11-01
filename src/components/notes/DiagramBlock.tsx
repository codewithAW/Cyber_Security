import { Fragment } from 'react';
import type { DiagramFlow } from '../../data/notes/types';

interface DiagramBlockProps {
  diagram: DiagramFlow;
}

export function DiagramBlock({ diagram }: DiagramBlockProps) {
  const isHorizontal = diagram.orientation !== 'vertical';

  return (
    <div className="diagram-card">
      <div className="diagram-header">
        <span className="diagram-badge">PROCESS FLOW</span>
        <h4 className="diagram-title">{diagram.title}</h4>
      </div>

      <div className={`diagram-flow-container ${isHorizontal ? 'flow-horizontal' : 'flow-vertical'}`}>
        {diagram.steps.map((step, idx) => (
          <Fragment key={idx}>
            <div className={`flow-node ${step.highlight ? 'flow-node-highlight' : ''}`}>
              <div className="flow-node-badge">0{idx + 1}</div>
              <div className="flow-node-content">
                <span className="flow-node-label">{step.label}</span>
                {step.sublabel && (
                  <span className="flow-node-sublabel">{step.sublabel}</span>
                )}
              </div>
            </div>

            {idx < diagram.steps.length - 1 && (
              <div className="flow-connector" aria-hidden="true">
                <span className="connector-arrow">
                  {isHorizontal ? '→' : '↓'}
                </span>
                <span className="connector-line" />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {diagram.caption && (
        <p className="diagram-caption">{diagram.caption}</p>
      )}
    </div>
  );
}
