import { Check, Pencil, X } from 'lucide-react';
import type { ComponentType } from 'react';

import type { Decision } from '../../shared/types';

export interface DecisionPresentation {
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  tone: 'reject' | 'keep' | 'edit';
}

export const DECISION_PRESENTATION: Record<Decision, DecisionPresentation> = {
  edit: {
    Icon: Pencil,
    label: 'Edit',
    tone: 'edit',
  },
  keep: {
    Icon: Check,
    label: 'Keep',
    tone: 'keep',
  },
  reject: {
    Icon: X,
    label: 'Reject',
    tone: 'reject',
  },
};
