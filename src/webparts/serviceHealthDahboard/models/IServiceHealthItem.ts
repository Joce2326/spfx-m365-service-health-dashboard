export interface IServiceHealthItem {
    id: string;
    service: string;
    status: string;
    statusDetails?: string;
}