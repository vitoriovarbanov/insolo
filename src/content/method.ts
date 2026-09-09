import { z } from 'astro/zod';

const figureSchema = z.object({
  value: z.string().min(1),
  unit: z.string(),
  caption: z.string().min(1),
});

const methodLayerSchema = z.object({
  id: z.string().min(1),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  detail: z.string().min(1),
  figure: figureSchema,
});

const methodLayersSchema = z.array(methodLayerSchema).min(1);

export interface MethodFigure {
  readonly value: string;
  readonly unit: string;
  readonly caption: string;
}

export interface MethodLayer {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly detail: string;
  readonly figure: MethodFigure;
}

const content = [
  {
    id: 'deck',
    eyebrow: 'Substrate',
    title: 'Roof deck',
    summary: 'The structure is checked before anything is fixed to it.',
    detail:
      'Rafter positions, spacing and condition are surveyed from inside the roof space, and the additional dead load is checked against the existing structure. Where a rafter is undersized or damaged it is reinforced before the array is designed around it, not after.',
    figure: { value: '600', unit: 'MM', caption: 'Typical rafter centres' },
  },
  {
    id: 'flashing',
    eyebrow: 'Weatherproofing',
    title: 'Flashing',
    summary: 'Every penetration is sealed into the roof covering, not onto it.',
    detail:
      'Each fixing passes through a flashing dressed under the course above and over the course below, so water is shed by the roof covering itself. Sealant is a secondary defence, never the primary one — a joint that depends on it has a service life measured in years rather than decades.',
    figure: {
      value: '0',
      unit: '',
      caption: 'Penetrations sealed by mastic alone',
    },
  },
  {
    id: 'rail',
    eyebrow: 'Substructure',
    title: 'Mounting rail',
    summary: 'Anodised aluminium rail, spanning between fixed brackets.',
    detail:
      'Rail spans are set from the wind and snow loading for the site and the roof pitch, then rounded down to land every bracket on a rafter. Aluminium and stainless fixings throughout, so nothing in the assembly corrodes against anything else.',
    figure: {
      value: '1.2',
      unit: 'M',
      caption: 'Maximum span between brackets',
    },
  },
  {
    id: 'array',
    eyebrow: 'Array',
    title: 'Panels and clamps',
    summary: 'Modules clamped at the manufacturer’s specified points.',
    detail:
      'Clamp positions come from the module datasheet, not from where the rail happens to fall — clamping outside those points voids the panel warranty and is a common cause of micro-cracking. Edge clearances are set so wind uplift is carried by the rail rather than the glass.',
    figure: { value: '2.4', unit: 'KPA', caption: 'Design wind uplift' },
  },
  {
    id: 'electrical',
    eyebrow: 'Electrical',
    title: 'DC, earthing and inverter',
    summary: 'Strings bonded and protected before they reach the inverter.',
    detail:
      'The array frame is bonded to the building’s earthing system and surge protection is fitted on both DC and AC sides. DC cabling is routed in UV-stable containment with no exposed runs, and the inverter is sited for airflow and for access at service time rather than for the shortest cable.',
    figure: {
      value: 'II',
      unit: 'TYPE',
      caption: 'Surge protection, both sides',
    },
  },
] as const;

methodLayersSchema.parse(content);

export const methodLayers: readonly MethodLayer[] = content;
