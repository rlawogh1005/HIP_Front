import { ProjectDocResponseData } from "../project_doc/project_doc-response.interface";

export interface ProjectDocTitleResponseData {
    project_doc_title_id: number;
    title: string;
    pa_title_id: number;
    project_docs: ProjectDocResponseData[];
    sub_titles: ProjectDocTitleResponseData[];
}