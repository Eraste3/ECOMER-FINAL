import { formatArea as baseFormatArea } from '../../utils/format';
import { formatCoord } from '../../data/mock-geo';

export const formatArea = baseFormatArea;

export function formatCoordSafe(lat: number, lng: number): string {
  return `${formatCoord(lat, 'lat')} · ${formatCoord(lng, 'lng')}`;
}