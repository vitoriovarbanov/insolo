import { z } from 'astro/zod';
import boyanaImage from '@/assets/images/projects/boyana.webp';
import lozenetsImage from '@/assets/images/projects/lozenets.webp';
import simeonovoImage from '@/assets/images/projects/simeonovo.webp';

const markerSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  corner: z.enum(['tl', 'tr', 'bl', 'br']),
});

const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  locality: z.string().min(1),
  capacityKwp: z.number().positive(),
  strings: z.number().int().positive(),
  fitted: z.string().min(1),
  summary: z.string().min(1),
  image: z.custom<ImageMetadata>(),
  imageAlt: z.string().min(1),
  imagePosition: z.string().min(1),
  marker: markerSchema,
});

const projectsSchema = z.array(projectSchema).min(1);

export interface Marker {
  readonly x: number;
  readonly y: number;
  readonly corner: 'tl' | 'tr' | 'bl' | 'br';
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly locality: string;
  readonly capacityKwp: number;
  readonly strings: number;
  readonly fitted: string;
  readonly summary: string;
  readonly image: ImageMetadata;
  readonly imageAlt: string;
  readonly imagePosition: string;
  readonly marker: Marker;
}

const content = [
  {
    id: 'boyana',
    name: 'Boyana Residence',
    locality: 'Boyana, Sofia',
    capacityKwp: 8.4,
    strings: 2,
    fitted: 'Mar 2025',
    summary:
      'In-roof array replacing the original slate on a steep gable, keeping the roofline unbroken.',
    image: boyanaImage,
    imageAlt: 'In-roof solar panels on a dark gabled house.',
    imagePosition: 'center 80%',
    marker: { x: 68, y: 22, corner: 'tr' },
  },
  {
    id: 'lozenets',
    name: 'Lozenets Retrofit',
    locality: 'Lozenets, Sofia',
    capacityKwp: 5.2,
    strings: 2,
    fitted: 'Jul 2024',
    summary:
      'Shingle roof fitted around an existing chimney stack, split into two strings to clear the shading.',
    image: lozenetsImage,
    imageAlt: 'Rooftop solar panels around a brick chimney.',
    imagePosition: 'center 75%',
    marker: { x: 22, y: 30, corner: 'tl' },
  },
  {
    id: 'simeonovo',
    name: 'Simeonovo Family Home',
    locality: 'Simeonovo, Sofia',
    capacityKwp: 6.8,
    strings: 3,
    fitted: 'Nov 2024',
    summary:
      'Hip roof with limited south face, split across two pitches to hold a full-size system anyway.',
    image: simeonovoImage,
    imageAlt: 'Solar panels fitted into a hip roof above a stucco house.',
    imagePosition: 'center 50%',
    marker: { x: 78, y: 68, corner: 'br' },
  },
] as const;

projectsSchema.parse(content);

export const projects: readonly Project[] = content;
