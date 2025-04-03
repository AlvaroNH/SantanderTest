import { Seniority } from './seniority.enum';

export interface CandidateTable {
	id: number;
	created_at: Date;
	name: string;
	surname: string;
	seniority: Seniority;
	yearsExperience: number;
	availability: boolean;
	excelfile: string;
}
