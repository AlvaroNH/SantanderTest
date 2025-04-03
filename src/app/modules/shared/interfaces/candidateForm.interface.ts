import { Seniority } from './seniority.enum';

export interface CandidateFormInterface extends ExcelCandidateDataInterface {
	name: string;
	surname: string;
}

export interface ExcelCandidateDataInterface {
  seniority: Seniority;
	yearsExperience: number;
	availability: boolean;
}
