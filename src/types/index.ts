export interface ExecutionStats {
  project: string;
  executions: number;
  avg_duration: number;
  pass_rate: number;
  date?: string;
}
