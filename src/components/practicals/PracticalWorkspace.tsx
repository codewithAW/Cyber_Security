import { useState } from 'react';
import type { PracticalExercise, PracticalProgressRecord } from '../../data/practicals/types';
import { PracticalInstructions } from './PracticalInstructions';
import { InteractiveSimulationContainer } from './simulations/InteractiveSimulationContainer';
import { HintPanel } from './HintPanel';
import { KnowledgeCheckQuiz } from './KnowledgeCheckQuiz';
import { VulnerabilityDeepDive } from './VulnerabilityDeepDive';

interface PracticalWorkspaceProps {
  practical: PracticalExercise;
  progressRecord?: PracticalProgressRecord;
  onBackToList: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
  onUpdateProgress: (
    practicalId: string,
    updates: Partial<PracticalProgressRecord>
  ) => void;
}

type MobileTab = 'instructions' | 'simulation' | 'deepdive';

export function PracticalWorkspace({
  practical,
  progressRecord,
  onBackToList,
  onNavigatePrev,
  onNavigateNext,
  onUpdateProgress,
}: PracticalWorkspaceProps) {
  const [mobileTab, setMobileTab] = useState<MobileTab>('simulation');
  const [simulationKey, setSimulationKey] = useState(0);

  const checkedSteps = progressRecord?.checkedSteps || [];
  const status = progressRecord?.status || 'not-started';

  const handleToggleStep = (stepId: string) => {
    const isCurrentlyChecked = checkedSteps.includes(stepId);
    let newSteps: string[];
    if (isCurrentlyChecked) {
      newSteps = checkedSteps.filter((id) => id !== stepId);
    } else {
      newSteps = [...checkedSteps, stepId];
    }

    const allChecked = newSteps.length === practical.steps.length;
    onUpdateProgress(practical.id, {
      checkedSteps: newSteps,
      currentStep: newSteps.length,
      status: allChecked ? 'completed' : 'in-progress',
    });
  };

  const handleStepComplete = (stepNumber: number) => {
    const stepObj = practical.steps[stepNumber - 1];
    if (stepObj && !checkedSteps.includes(stepObj.id)) {
      handleToggleStep(stepObj.id);
    }
  };

  const handleSimulationSuccess = () => {
    const allStepIds = practical.steps.map((s) => s.id);
    onUpdateProgress(practical.id, {
      status: 'completed',
      checkedSteps: allStepIds,
      currentStep: practical.steps.length,
    });
  };

  const handleUseHint = (tier: number) => {
    const currentHints = progressRecord?.usedHints || 0;
    if (tier > currentHints) {
      onUpdateProgress(practical.id, {
        usedHints: tier,
      });
    }
  };

  const handleRevealSolution = () => {
    onUpdateProgress(practical.id, {
      revealedSolution: true,
    });
  };

  const handleQuizComplete = (isCorrect: boolean) => {
    onUpdateProgress(practical.id, {
      quizCompleted: true,
      pointsEarned: isCorrect ? 25 : 10,
    });
  };

  const handleResetLab = () => {
    setSimulationKey((k) => k + 1);
    onUpdateProgress(practical.id, {
      checkedSteps: [],
      currentStep: 0,
      status: 'in-progress',
      usedHints: 0,
      revealedSolution: false,
    });
  };

  return (
    <div className="workspace-root">
      {/* Top Workspace Header Bar */}
      <header className="workspace-top-bar" aria-label="Practical workspace top bar">
        <div className="top-bar-left">
          <button
            type="button"
            className="btn-workspace-back"
            onClick={onBackToList}
            aria-label="Back to all practicals"
          >
            ← All Practicals
          </button>

          <nav className="workspace-breadcrumbs font-mono" aria-label="Breadcrumb">
            <span>Practicals</span>
            <span className="sep">/</span>
            <span>CH {practical.chapterNumber.toString().padStart(2, '0')}</span>
            <span className="sep">/</span>
            <span className="current text-cyan">{practical.title}</span>
          </nav>
        </div>

        <div className="top-bar-center">
          <span
            className={`status-pill font-mono status-${status}`}
          >
            {status === 'completed' ? '✓ COMPLETED' : status === 'in-progress' ? '● IN PROGRESS' : '○ NOT STARTED'}
          </span>
          <span className="workspace-step-counter font-mono">
            {checkedSteps.length} / {practical.steps.length} Steps
          </span>
        </div>

        <div className="top-bar-right">
          <button
            type="button"
            className="btn-workspace-reset font-mono"
            onClick={handleResetLab}
            title="Reset lab simulation and checklist"
          >
            🔄 Reset
          </button>

          {onNavigatePrev && (
            <button
              type="button"
              className="btn-workspace-nav font-mono"
              onClick={onNavigatePrev}
              title="Previous Practical"
            >
              ← Prev
            </button>
          )}

          {onNavigateNext && (
            <button
              type="button"
              className="btn-workspace-nav font-mono"
              onClick={onNavigateNext}
              title="Next Practical"
            >
              Next →
            </button>
          )}
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="mobile-workspace-tabs" role="tablist">
        <button
          type="button"
          className={`mob-tab-btn ${mobileTab === 'instructions' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('instructions')}
          role="tab"
          aria-selected={mobileTab === 'instructions'}
        >
          📋 Protocol & Steps
        </button>
        <button
          type="button"
          className={`mob-tab-btn ${mobileTab === 'simulation' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('simulation')}
          role="tab"
          aria-selected={mobileTab === 'simulation'}
        >
          💻 Interactive Lab
        </button>
        <button
          type="button"
          className={`mob-tab-btn ${mobileTab === 'deepdive' ? 'is-active' : ''}`}
          onClick={() => setMobileTab('deepdive')}
          role="tab"
          aria-selected={mobileTab === 'deepdive'}
        >
          💡 Hints & Deep Dive
        </button>
      </div>

      {/* 3-Column Workspace Layout */}
      <div className={`workspace-columns-layout view-${mobileTab}`}>
        {/* Left Column: Instructions, Scenario, Step Protocol */}
        <section
          className="workspace-col col-instructions"
          aria-label="Protocol and Instructions"
        >
          <PracticalInstructions
            practical={practical}
            checkedSteps={checkedSteps}
            onToggleStep={handleToggleStep}
          />
        </section>

        {/* Center Column: Interactive Sandbox Simulation */}
        <main
          className="workspace-col col-simulation"
          aria-label="Interactive Sandbox Simulation"
        >
          <InteractiveSimulationContainer
            key={`${practical.id}_${simulationKey}`}
            practical={practical}
            onStepComplete={handleStepComplete}
            onSimulationSuccess={handleSimulationSuccess}
          />
        </main>

        {/* Right Column: Progressive Hints, Solution Reveal, Assessment Quiz, Deep Dive */}
        <aside
          className="workspace-col col-deepdive"
          aria-label="Guidance, Hints and Security Deep Dive"
        >
          <HintPanel
            key={`${practical.id}_hint_${simulationKey}`}
            hints={practical.hints}
            solution={practical.solution}
            onUseHint={handleUseHint}
            onRevealSolution={handleRevealSolution}
          />

          <KnowledgeCheckQuiz
            key={`${practical.id}_quiz_${simulationKey}`}
            quiz={practical.knowledgeCheck}
            onQuizCompleted={handleQuizComplete}
          />

          <VulnerabilityDeepDive practical={practical} />
        </aside>
      </div>
    </div>
  );
}
