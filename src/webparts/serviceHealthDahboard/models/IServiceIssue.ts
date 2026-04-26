export interface IServiceIssue {
    id: string;
    title?: string;
    classification?: string;
    status?: string;
    feature?: string;
    impactDescription?: string;
    startDateTime?: string;
    endDateTime?: string | null;
    origin?: string;
    service?: string[];
}