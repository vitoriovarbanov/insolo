import { z } from 'astro/zod';

const processStepSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  panel: z.object({
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }),
});

const processStepsSchema = z.array(processStepSchema).min(1);

export interface ProcessStep {
  readonly id: string;
  readonly name: string;
  readonly summary: string;
  readonly panel: { readonly x: number; readonly y: number };
}

const content = [
  {
    id: 'consultation',
    name: 'Consultation',
    summary:
      'A qualified engineer walks the roof and the bill before you commit to anything.',
    panel: { x: 20, y: 26 },
  },
  {
    id: 'design',
    name: 'Project development',
    summary:
      'A system designed and sized around your roof and your own consumption.',
    panel: { x: 50, y: 16 },
  },
  {
    id: 'construction',
    name: 'Construction',
    summary:
      'Mounting, wiring and inverter install carried out end to end by our own crew.',
    panel: { x: 80, y: 32 },
  },
  {
    id: 'lightning',
    name: 'Lightning protection',
    summary:
      'Grounding and surge arrestors fitted alongside the array, not bolted on after.',
    panel: { x: 28, y: 76 },
  },
  {
    id: 'monitoring',
    name: 'Monitoring & maintenance',
    summary:
      'Live output tracking and scheduled servicing for the life of the system.',
    panel: { x: 78, y: 72 },
  },
] as const;

processStepsSchema.parse(content);

export const processSteps: readonly ProcessStep[] = content;
