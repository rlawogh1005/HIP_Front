import { ProjectStatus } from '../../enums/role.enums';

export interface CreateProjectRequest {
    topic: string;
    className: string;
    team_name: string;
    generation: string;
}

export interface UpdateProjectRequest {
    topic?: string;
    className?: string;
    status?: ProjectStatus;
    team_name?: string;
    generation?: string;
}