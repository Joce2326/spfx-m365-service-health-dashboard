export interface IMessageItem {
    id: string;
    title?: string;
    category?: string;
    severity?: string;
    createdDateTime?: string;
    lastModifiedDateTime?: string;
    actionRequiredByDateTime?: string | null;
}