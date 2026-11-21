import type { ComponentType } from 'react';
import type { ProjectId } from '@/types';
import type { PreviewProps } from './PreviewFrame';
import { CsrdPreview } from './CsrdPreview';
import { ItineraryPreview } from './ItineraryPreview';
import { AndiPreview } from './AndiPreview';
import { RetailPreview } from './RetailPreview';
import { AiisPreview } from './AiisPreview';

export const previews: Record<ProjectId, ComponentType<PreviewProps>> = {
  csrd: CsrdPreview,
  itinerary: ItineraryPreview,
  andi: AndiPreview,
  retail: RetailPreview,
  aiis: AiisPreview,
};
