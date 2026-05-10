/**
 * World Clock Page Data Models
 *
 * Defines strict TypeScript types for clock entries, page state, and format options.
 * All entities use readonly fields to enforce immutability.
 *
 * Reference: data-model.md, contracts/
 */

/**
 * ClockFormat: Enumeration of supported display formats
 * - 'digital': Time as text (HH:MM:SS) with seconds always visible
 * - 'analog': Clock face with hour, minute, second hands; seconds always visible
 */
export type ClockFormat = 'digital' | 'analog';

/**
 * TimeZoneConfig: Internal configuration for a supported timezone region
 * Used to initialize WorldClockEntry instances from TIMEZONE_CONFIGS constant
 */
export interface TimeZoneConfig {
  readonly id: string;           // Unique identifier: "brazil" | "uk" | "china"
  readonly region: string;       // Display name: "Brazil", "United Kingdom", "China"
  readonly city: string;         // City: "Brasília", "London", "Shanghai"
  readonly timeZoneId: string;   // IANA TZ ID: "America/Sao_Paulo", "Europe/London", "Asia/Shanghai"
  readonly locale: string;       // BCP 47 locale: "pt-BR", "en-GB", "zh-CN"
}

/**
 * WorldClockEntry: Represents state and metadata for one timezone region's clock
 * Immutable interface; new times computed via new object creation
 *
 * Validation rules:
 * - id: Non-empty, lowercase alphanumeric
 * - region, city: Non-empty strings, max 50 chars
 * - timeZoneId: Valid IANA identifier (Intl API validates at runtime)
 * - locale: Valid BCP 47 tag
 * - currentTime: Valid Date in UTC (formatted on render)
 * - utcOffset: Integer in [-840, +840] (UTC±14 max)
 */
export interface WorldClockEntry extends TimeZoneConfig {
  readonly currentTime: Date;    // Current time in UTC (formatted per locale/timeZoneId on display)
  readonly utcOffset: number;    // Current UTC offset in minutes (informational)
}

/**
 * WorldClockPageState: Aggregated state of the World Clock page
 * Encompasses all three region entries and display preferences
 *
 * Validation rules:
 * - entries: Exactly 3 items, each a valid WorldClockEntry
 * - currentFormat: One of 'digital' | 'analog'
 * - isLoading: Boolean, true only during initial load (<100ms)
 * - error: Null or non-empty string (max 200 chars)
 * - lastUpdated: Valid Date, monotonically increasing (≥ previous value)
 */
export interface WorldClockPageState {
  readonly entries: ReadonlyArray<WorldClockEntry>;  // Always exactly 3 entries
  readonly currentFormat: ClockFormat;               // Current display format (applies to all)
  readonly isLoading: boolean;                       // True during initial time resolution
  readonly error: string | null;                     // Error message if any entry fails
  readonly lastUpdated: Date;                        // Timestamp of last state mutation
}

/**
 * State transition diagrams:
 *
 * INITIALIZATION:
 *   {entries: [Brazil, UK, China], currentFormat: 'digital', isLoading: true, error: null, lastUpdated: now}
 *
 * LOAD COMPLETE:
 *   isLoading: false, error: null (or set if partial load)
 *
 * LIVE UPDATE (every 1000ms):
 *   entries: Each entry's currentTime refreshed
 *
 * FORMAT TOGGLE:
 *   currentFormat: 'digital' ↔ 'analog'
 *
 * ERROR STATE:
 *   entries: Partial (e.g., Brazil + UK visible, China failed)
 *   error: "Failed to resolve timezone: Asia/Shanghai"
 */
