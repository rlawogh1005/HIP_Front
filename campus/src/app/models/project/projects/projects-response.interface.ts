export interface ProjectResponseData {
    project_id: number;
    className: string;
    topic: string;
    project_status: 'in_progress' | 'completed';
    team_name: string;
    generation: string;
}