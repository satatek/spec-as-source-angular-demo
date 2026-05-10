# Contract: WorldClockEntry

## Purpose

Defines the interface contract for a single timezone region's clock entry. This contract ensures type safety and clear expectations between the time-resolution service and display components.

## TypeScript Interface

```typescript
// src/app/features/world-clock/models/world-clock.models.ts

export interface WorldClockEntry {
  readonly id: string;                    // Unique identifier: "brazil" | "uk" | "china"
  readonly region: string;                // Display name: "Brazil", "United Kingdom", "China"
  readonly city: string;                  // City name: "Brasília", "London", "Shanghai"
  readonly timeZoneId: string;            // IANA TZ ID: "America/Sao_Paulo", "Europe/London", "Asia/Shanghai"
  readonly locale: string;                // BCP 47 locale: "pt-BR", "en-GB", "zh-CN"
  readonly currentTime: Date;             // Current time in UTC (formatted on render)
  readonly utcOffset: number;             // Current UTC offset in minutes
}
```

## Contract Guarantees

### Immutability
- All fields are `readonly`
- No mutations after construction
- New times computed via new object creation (not mutation)

### Type Safety
- `id`, `region`, `city`, `locale`: Non-empty strings
- `timeZoneId`: Valid IANA timezone identifier
- `currentTime`: Valid JavaScript Date in UTC
- `utcOffset`: Integer in [-840, +840] (±14 hours)

### Validation
- Service validates timezone ID via `Intl.DateTimeFormat` before creating entry
- Invalid entry throws `Error` with diagnostic message
- Component never receives invalid entry

### Usage Pattern

**Creation (Service)**:
```typescript
const entry: WorldClockEntry = {
  id: 'brazil',
  region: 'Brazil',
  city: 'Brasília',
  timeZoneId: 'America/Sao_Paulo',
  locale: 'pt-BR',
  currentTime: new Date(),
  utcOffset: getCurrentUTCOffset('America/Sao_Paulo'),
};
```

**Display (Component)**:
```typescript
// entry is guaranteed valid and immutable
const formatted = formatTimeForDisplay(entry.currentTime, entry.locale, entry.timeZoneId);
const label = `${entry.region} (${entry.city})`;
```

## Breaking Changes

A breaking change occurs if:
1. Required field is removed (e.g., `currentTime` deleted)
2. Field type changes (e.g., `string` → `number`)
3. Field becomes mutable (loses `readonly`)
4. New required field added without default

Non-breaking changes:
- Adding optional field
- Adding validation constraint (if service enforces, not contract)
- Changing field order

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | May 9, 2026 | Initial contract definition |

## References

- **Data Model**: [data-model.md](../data-model.md)
- **Specification**: [spec.md](../spec.md) — FR-002, FR-003 (clear labels, region identity)
