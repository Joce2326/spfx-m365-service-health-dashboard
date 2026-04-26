import { IServiceHealthItem } from '../models/IServiceHealthItem';
import { IServiceIssue } from '../models/IServiceIssue';
import { IMessageItem } from '../models/IMessageItem';

export class ApiService {
    constructor(private baseUrl: string) { }

    public async getServiceHealth(): Promise<IServiceHealthItem[]> {
        const response = await fetch(`${this.baseUrl}/health`);

        if (!response.ok) {
            throw new Error('Failed to load service health data.');
        }

        const data = await response.json();
        return Array.isArray(data) ? data : data.services || data.value || [];
    }

    public async getIssuesByService(serviceId: string): Promise<IServiceIssue[]> {
        const response = await fetch(`${this.baseUrl}/health/${serviceId}/issues`);

        if (!response.ok) {
            throw new Error('Failed to load issues.');
        }

        const data = await response.json();
        return Array.isArray(data) ? data : data.issues || data.value || [];
    }

    public async getMessages(): Promise<IMessageItem[]> {
        const response = await fetch(`${this.baseUrl}/health/messages`);

        if (!response.ok) {
            throw new Error('Failed to load messages.');
        }

        const data = await response.json();
        return Array.isArray(data) ? data : data.messages || data.value || [];
    }
}