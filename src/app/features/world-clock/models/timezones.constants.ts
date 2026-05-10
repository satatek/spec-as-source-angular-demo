/**
 * Timezone Configurations: Brazil, UK, China
 * 
 * Provides readonly configuration for the three supported regions.
 * Used to initialize WorldClockEntry instances.
 *
 * Reference: data-model.md, TimeZoneConfig interface
 */

import { TimeZoneConfig } from './world-clock.models';

/**
 * TIMEZONE_CONFIGS: Array of supported timezone configurations
 *
 * - Brazil: Brasília (UTC-3 / UTC-2 with DST)
 * - United Kingdom: London (UTC+0 / UTC+1 with DST)
 * - China: Shanghai (UTC+8, no DST)
 *
 * IANA timezone identifiers automatically handle DST transitions.
 * BCP 47 locale tags ensure locale-aware formatting.
 */
export const TIMEZONE_CONFIGS: ReadonlyArray<TimeZoneConfig> = [
  {
    id: 'brazil',
    region: 'Brazil',
    city: 'Brasília',
    timeZoneId: 'America/Sao_Paulo',
    locale: 'pt-BR',
  },
  {
    id: 'uk',
    region: 'United Kingdom',
    city: 'London',
    timeZoneId: 'Europe/London',
    locale: 'en-GB',
  },
  {
    id: 'china',
    region: 'China',
    city: 'Shanghai',
    timeZoneId: 'Asia/Shanghai',
    locale: 'zh-CN',
  },
];
