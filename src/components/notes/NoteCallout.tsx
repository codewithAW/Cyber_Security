import type { ReactNode } from 'react';
import type { CalloutType } from '../../data/notes/types';

interface NoteCalloutProps {
  type?: CalloutType;
  title?: string;
  badge?: string;
  children: ReactNode;
}

export function NoteCallout({
  type = 'concept',
  title,
  badge,
  children,
}: NoteCalloutProps) {
  const getIcon = () => {
    switch (type) {
      case 'definition':
        return (
          <svg className="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
      case 'example':
        return (
          <svg className="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'formula':
        return (
          <svg className="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="7" y1="8" x2="17" y2="8" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="7" y1="16" x2="12" y2="16" />
          </svg>
        );
      case 'exam':
        return (
          <svg className="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 6 12 12 16 14" />
          </svg>
        );
      case 'concept':
      default:
        return (
          <svg className="callout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
    }
  };

  const defaultBadge = () => {
    switch (type) {
      case 'definition':
        return 'CORE DEFINITION';
      case 'example':
        return 'PRACTICAL SCENARIO';
      case 'warning':
        return 'SECURITY VULNERABILITY';
      case 'formula':
        return 'SECURITY PRINCIPLE';
      case 'exam':
        return 'EXAM FOCUS';
      case 'concept':
      default:
        return 'KEY CONCEPT';
    }
  };

  return (
    <div className={`note-callout note-callout-${type}`}>
      <div className="note-callout-header">
        <div className="note-callout-title-wrap">
          {getIcon()}
          <span className="note-callout-badge">{badge || defaultBadge()}</span>
          {title && <span className="note-callout-title">{title}</span>}
        </div>
      </div>
      <div className="note-callout-body">{children}</div>
    </div>
  );
}
