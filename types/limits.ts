export interface Limits {
  /** Hard cap on the rows per table page, whatever a table asks for. */
  maxPageSize: number;
  /** Rows a table will show at most, after filtering. */
  maxTableRows: number;
  maxPlanFeatures: number;
}
