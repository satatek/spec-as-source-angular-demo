/**
 * Timezone Configurations: 9 key global regions
 *
 * Provides readonly configuration for supported regions.
 * Used to initialize WorldClockEntry instances.
 *
 * Reference: data-model.md, TimeZoneConfig interface
 */

import { TimeZoneConfig } from './world-clock.models';

/**
 * TIMEZONE_CONFIGS: Array of supported timezone configurations
 *
 * - Brazil: Brasília
 * - United Kingdom: London
 * - China: Shanghai
 * - United States: New York
 * - India: New Delhi
 * - Japan: Tokyo
 * - Germany: Berlin
 * - Australia: Sydney
 * - United Arab Emirates: Dubai
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
  {
    id: 'usa',
    region: 'United States',
    city: 'New York',
    timeZoneId: 'America/New_York',
    locale: 'en-US',
  },
  {
    id: 'india',
    region: 'India',
    city: 'New Delhi',
    timeZoneId: 'Asia/Kolkata',
    locale: 'en-IN',
  },
  {
    id: 'japan',
    region: 'Japan',
    city: 'Tokyo',
    timeZoneId: 'Asia/Tokyo',
    locale: 'ja-JP',
  },
  {
    id: 'germany',
    region: 'Germany',
    city: 'Berlin',
    timeZoneId: 'Europe/Berlin',
    locale: 'de-DE',
  },
  {
    id: 'australia',
    region: 'Australia',
    city: 'Sydney',
    timeZoneId: 'Australia/Sydney',
    locale: 'en-AU',
  },
  {
    id: 'uae',
    region: 'United Arab Emirates',
    city: 'Dubai',
    timeZoneId: 'Asia/Dubai',
    locale: 'en-AE',
  },
];
