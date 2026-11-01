import { SqlInjectionSimulation } from './SqlInjectionSimulation';
import { XssSimulation } from './XssSimulation';
import { PhishingSimulation } from './PhishingSimulation';
import { PasswordCrackingSimulation } from './PasswordCrackingSimulation';
import { FirewallSimulation } from './FirewallSimulation';
import { NetworkScanSimulation } from './NetworkScanSimulation';
import { CryptoSimulation } from './CryptoSimulation';
import { MitmSimulation } from './MitmSimulation';
import { OsintSimulation } from './OsintSimulation';
import { MalwareAnalysisSimulation } from './MalwareAnalysisSimulation';
import { DdosSimulation } from './DdosSimulation';
import { IdorSimulation } from './IdorSimulation';
import { CloudSecuritySimulation } from './CloudSecuritySimulation';
import { IotMqttSimulation } from './IotMqttSimulation';
import type { PracticalExercise } from '../../../data/practicals/types';

interface InteractiveSimulationContainerProps {
  practical: PracticalExercise;
  onStepComplete?: (stepNumber: number) => void;
  onSimulationSuccess?: () => void;
}

export function InteractiveSimulationContainer({
  practical,
  onStepComplete,
  onSimulationSuccess,
}: InteractiveSimulationContainerProps) {
  switch (practical.simulationType) {
    case 'sqli':
      return (
        <SqlInjectionSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'xss':
      return (
        <XssSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'phishing':
      return (
        <PhishingSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'password-cracking':
      return (
        <PasswordCrackingSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'firewall':
      return (
        <FirewallSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'network-scan':
      return (
        <NetworkScanSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'crypto':
      return (
        <CryptoSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'mitm':
      return (
        <MitmSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'osint':
      return (
        <OsintSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'malware-analysis':
      return (
        <MalwareAnalysisSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'ddos':
      return (
        <DdosSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'idor':
      return (
        <IdorSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'cloud-security':
      return (
        <CloudSecuritySimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    case 'iot-mqtt':
      return (
        <IotMqttSimulation
          onStepComplete={onStepComplete}
          onSimulationSuccess={onSimulationSuccess}
        />
      );
    default:
      return (
        <div className="simulation-fallback">
          <h3>Simulation Engine Initializing...</h3>
          <p>Interactive laboratory simulation for {practical.title} is loading.</p>
        </div>
      );
  }
}

