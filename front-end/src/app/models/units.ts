export enum Temperature {
  C = 0,
  F = 1
}

export enum Time {
  SECONDS = 2,
  MINUTES = 3,
  HOURS = 4,
  DAYS = 5
}

export const ReadableUnit = {
  0: 'C', TEMPERATURE: 'C',
  1: 'F',
  2: 'seconds',
  3: 'minutes',
  4: 'hours', TIME: 'hours',
  5: 'days',
  6: '%', PERCENTAGE: '%',
  7: 'ID', ID: 'ID',
  8: 'pH', ACIDITY: 'pH',
  9: '#', HEXADECIMAL: "#",
  10: 'PPM', PPM: 'PPM'
};

export const UnitNames = ['Degrees', 'Degrees', 'Time', 'Time', 'Time', 'Days', 'Percentage',
  'Mix IDs', 'Acidity', 'Hexadecimal', 'Parts per million'];
