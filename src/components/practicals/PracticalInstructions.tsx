import type { PracticalExercise } from '../../data/practicals/types';

interface PracticalInstructionsProps {
  practical: PracticalExercise;
  checkedSteps: string[];
  onToggleStep: (stepId: string) => void;
}

export function PracticalInstructions({
  practical,
  checkedSteps,
  onToggleStep,
}: PracticalInstructionsProps) {
  return (
    <div className="instructions-root">
      <div className="instr-card instr-scenario">
        <div className="instr-card-header">
          <span className="instr-icon">🎯</span>
          <h4>Operational Scenario</h4>
        </div>
        <p className="scenario-text">{practical.scenario}</p>
      </div>

      <div className="instr-card instr-objectives">
        <div className="instr-card-header">
          <span className="instr-icon">📋</span>
          <h4>Learning Objectives</h4>
        </div>
        <ul className="objectives-list">
          {practical.learningObjectives.map((obj, idx) => (
            <li key={idx} className="obj-item">
              <span className="check-bullet text-cyan">✓</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="instr-card instr-tools">
        <div className="instr-card-header">
          <span className="instr-icon">🛠️</span>
          <h4>Tools & Concepts</h4>
        </div>
        <div className="tools-tags-wrap font-mono">
          {practical.toolsAndConcepts.map((tool, idx) => (
            <span key={idx} className="tool-pill">
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div className="instr-card instr-steps">
        <div className="instr-card-header">
          <span className="instr-icon">🪜</span>
          <h4>Step-by-Step Exercise Protocol</h4>
        </div>

        <div className="steps-checklist">
          {practical.steps.map((st) => {
            const isDone = checkedSteps.includes(st.id);

            return (
              <div
                key={st.id}
                className={`step-item-card ${isDone ? 'step-completed' : ''}`}
                onClick={() => onToggleStep(st.id)}
              >
                <div className="step-head">
                  <div className="step-checkbox">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => onToggleStep(st.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <span className="step-num font-mono">Step {st.stepNumber}:</span>
                  <span className="step-title font-bold">{st.title}</span>
                </div>

                <p className="step-instruction">{st.instruction}</p>

                {st.expectedResult && (
                  <div className="step-expected">
                    <span className="exp-label font-mono">Expected Result:</span>
                    <span className="exp-val">{st.expectedResult}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

