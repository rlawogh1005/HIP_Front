import { ProjectDocResponseData } from "../project_doc/project_doc-response.interface";

export interface ProjectDocTitleResponseData {
    project_doc_title_id: number;
    project_doc_title: string;
    project_doc_title_pa_id?: number;
    project_docs?: ProjectDocResponseData[];
    sub_titles?: ProjectDocTitleResponseData[];
}