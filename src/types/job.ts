export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE'

export type Job = {
  id: number
  title: string
  description?: string
  location?: string
  jobType?: JobType
  salaryMin?: number | string | null
  salaryMax?: number | string | null
  salaryCurrency?: string | null
  experienceLevel?: string | null
  requiredSkills?: string | null
  preferredSkills?: string | null
  benefits?: string | null
  applicationDeadline?: string | null
  isRemote?: boolean | null
  vacancies?: number | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  employerId?: number
  employerName?: string
  employerEmail?: string
  companyName?: string
  companyIndustry?: string
}
