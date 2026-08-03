import type { DurationUnit } from '../lib/api';

const UNITS: { value: DurationUnit; label: string }[] = [
  { value: 'MINUTE', label: 'Minutes' },
  { value: 'HOUR', label: 'Hours' },
  { value: 'DAY', label: 'Days' },
  { value: 'WEEK', label: 'Weeks' },
  { value: 'MONTH', label: 'Months' },
];

export function DurationFields({
  value,
  unit,
  onValueChange,
  onUnitChange,
}: {
  value: string;
  unit: DurationUnit;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: DurationUnit) => void;
}) {
  return (
    <div className="form-row duration-fields">
      <label>
        Duration
        <input
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="e.g. 2.5"
        />
      </label>
      <label>
        Unit
        <select value={unit} onChange={(e) => onUnitChange(e.target.value as DurationUnit)}>
          {UNITS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
