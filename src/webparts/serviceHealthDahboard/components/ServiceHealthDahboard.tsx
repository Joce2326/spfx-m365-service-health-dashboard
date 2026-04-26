import * as React from 'react';
import { useEffect, useState } from 'react';
import { DefaultButton, PrimaryButton, Spinner, SpinnerSize, Text, TextField } from '@fluentui/react';


import { IServiceHealthDashboardProps } from './IServiceHealthDahboardProps';
import { IServiceHealthItem } from '../models/IServiceHealthItem';
import { ApiService } from '../services/APIService';

import { IServiceIssue } from '../models/IServiceIssue';

import { IMessageItem } from '../models/IMessageItem';


import { Icon } from '@fluentui/react/lib/Icon';

const formatStatus = (status?: string): string => {
  switch (status) {
    case 'serviceOperational':
      return 'Operational';
    case 'serviceDegradation':
      return 'Degraded';
    case 'investigating':
      return 'Investigating';
    case 'restoringService':
      return 'Restoring Service';
    case 'serviceRestored':
      return 'Service Restored';
    case 'falsePositive':
      return 'False Positive';
    default:
      return status || 'Unknown';
  }
};

const formatDate = (value?: string | null): string => {
  if (!value) return 'N/A';

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const formatSeverity = (severity?: string): string => {
  switch (severity) {
    case 'normal':
      return 'Normal';
    case 'high':
      return 'High';
    case 'critical':
      return 'Critical';
    default:
      return severity || 'N/A';
  }
};

const formatCategory = (category?: string): string => {
  switch (category) {
    case 'stayInformed':
      return 'Stay informed';
    case 'planForChange':
      return 'Plan for change';
    case 'preventOrFixIssues':
      return 'Prevent or fix issues';
    default:
      return category || 'N/A';
  }
};


const ServiceHealthDashboard: React.FC<IServiceHealthDashboardProps> = (_props) => {
  const [services, setServices] = useState<IServiceHealthItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
const [selectedServiceName, setSelectedServiceName] = useState<string>('');
const [issues, setIssues] = useState<IServiceIssue[]>([]);
const [issuesLoading, setIssuesLoading] = useState<boolean>(false);
const [issuesError, setIssuesError] = useState<string>('');

const [messages, setMessages] = useState<IMessageItem[]>([]);
const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
const [messagesError, setMessagesError] = useState<string>('');

const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

const [messageSearch, setMessageSearch] = useState<string>('');

  const loadData = async (): Promise<void> => {
  try {
    setLoading(true);
    setError('');

    const apiService = new ApiService('http://localhost:3001');
    //const data = await apiService.getServiceHealth();
const data = await apiService.getServiceHealth();
    setServices(data);
  } catch (err: any) {
    setError(err?.message || 'Failed to load service health data.');
  } finally {
    setLoading(false);
  }
};

  const summary = React.useMemo(() => {
  return {
    total: services.length,
    operational: services.filter(s => s.status === 'serviceOperational').length,
    degraded: services.filter(s => s.status === 'serviceDegradation').length,
    others: services.filter(
      s => s.status !== 'serviceOperational' && s.status !== 'serviceDegradation'
    ).length
  };
}, [services]);

const filteredServices = React.useMemo(() => {
  if (filter === 'all') return services;
  return services.filter(s => s.status === filter);
}, [services, filter]);

const filteredMessages = React.useMemo(() => {
  const term = messageSearch.trim().toLowerCase();

  if (!term) return messages;

  return messages.filter((message) => {
    const title = message.title?.toLowerCase() || '';
    const category = formatCategory(message.category).toLowerCase();
    const severity = formatSeverity(message.severity).toLowerCase();

    return (
      title.includes(term) ||
      category.includes(term) ||
      severity.includes(term)
    );
  });
}, [messages, messageSearch]);



const loadMessages = async (): Promise<void> => {
  try {
    setMessagesLoading(true);
    setMessagesError('');
    setMessages([]);

    const apiService = new ApiService('http://localhost:3001');
    const data = await apiService.getMessages();

    setMessages(data);
  } catch (err: any) {
    setMessagesError(err?.message || 'Failed to load messages.');
  } finally {
    setMessagesLoading(false);
  }
};



  useEffect(() => {
  void loadData();
  void loadMessages();
}, []);

const loadIssuesForService = async (serviceId: string, serviceName: string): Promise<void> => {
  try {
    setSelectedServiceId(serviceId);
    setSelectedServiceName(serviceName);
    setIssuesLoading(true);
    setIssuesError('');
    setIssues([]);

    const apiService = new ApiService('http://localhost:3001');
    const data = await apiService.getIssuesByService(serviceId);

    setIssues(data);
  } catch (err: any) {
    setIssuesError(err?.message || 'Failed to load issues.');
  } finally {
    setIssuesLoading(false);
  }
};



const getStatusBadgeStyle = (status?: string): React.CSSProperties => {
  switch (status) {
    case 'serviceOperational':
      return {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '12px',
        background: '#dff6dd',
        color: '#107c10',
        fontSize: '12px',
        fontWeight: 600
      };
    case 'serviceDegradation':
      return {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '12px',
        background: '#fff4ce',
        color: '#8a6d1f',
        fontSize: '12px',
        fontWeight: 600
      };
    default:
      return {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '12px',
        background: '#f3f2f1',
        color: '#605e5c',
        fontSize: '12px',
        fontWeight: 600
      };
  }
};

const getSeverityBadgeStyle = (severity?: string): React.CSSProperties => {
  switch (severity) {
    case 'normal':
      return {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '12px',
        background: '#f3f2f1',
        color: '#605e5c',
        fontSize: '12px',
        fontWeight: 600
      };
    case 'high':
      return {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '12px',
        background: '#fff4ce',
        color: '#8a6d1f',
        fontSize: '12px',
        fontWeight: 600
      };
    case 'critical':
      return {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '12px',
        background: '#fde7e9',
        color: '#a4262c',
        fontSize: '12px',
        fontWeight: 600
      };
    default:
      return {
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '12px',
        background: '#f3f2f1',
        color: '#605e5c',
        fontSize: '12px',
        fontWeight: 600
      };
  }
};

  return (
    <div>
      <Text variant="xxLarge">Service Health Dashboard</Text>
      <br />
      <br />

      <PrimaryButton text="Refresh" onClick={() => void loadData()} />
      {!loading && !error && (
  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
    <div><strong>Total:</strong> {summary.total}</div>
    <div><strong>Operational:</strong> {summary.operational}</div>
    <div><strong>Degraded:</strong> {summary.degraded}</div>
    <div><strong>Others:</strong> {summary.others}</div>
  </div>
)}
      <br />
      <br />
<div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
  <DefaultButton text="All" onClick={() => setFilter('all')} />
  <DefaultButton text="Operational" onClick={() => setFilter('serviceOperational')} />
  <DefaultButton text="Degraded" onClick={() => setFilter('serviceDegradation')} />
</div>
      {loading && <Spinner size={SpinnerSize.medium} label="Loading service health..." />}

      {!loading && error && (
        <>
          <Text variant="medium" styles={{ root: { color: 'red' } }}>
            {error}
          </Text>
          <br />
          <br />
          <DefaultButton text="Try Again" onClick={() => void loadData()} />
        </>
      )}

      {!loading && !error && services.length === 0 && (
        <Text>No service health items found.</Text>
      )}

      {!loading && !error && services.length > 0 && (
        <div>
        {filteredServices.map((item) => (
  <div
    key={item.id}
    onClick={() => void loadIssuesForService(item.id, item.service)}
    style={{
  borderLeft:
    item.status === 'serviceOperational'
      ? '6px solid green'
      : item.status === 'serviceDegradation'
      ? '6px solid orange'
      : '6px solid gray',
  background: selectedServiceId === item.id ? '#f3f9ff' : '#fafafa',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '12px',
  boxShadow:
    selectedServiceId === item.id
      ? '0 0 0 2px #0078d4, 0 2px 6px rgba(0, 0, 0, 0.12)'
      : '0 1px 3px rgba(0, 0, 0, 0.08)',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}}
  >
    <Text variant="large">{item.service}</Text>

     <span style={getStatusBadgeStyle(item.status)}> {formatStatus(item.status)} </span>


{selectedServiceId === item.id && (
  <>
    <br />
    <Text variant="small" styles={{ root: { color: '#0078d4', fontWeight: 600 } }}>
      Selected
    </Text>

   
  </>
)}
 
  </div>
))} </div>
)}
  


  {selectedServiceId && (
  <div style={{ marginTop: '24px' }}>
    <Text variant="xLarge">Issues for {selectedServiceName}</Text>
    <br />
    <br />

    {issuesLoading && <Spinner size={SpinnerSize.medium} label="Loading issues..." />}

    {!issuesLoading && issuesError && (
      <Text variant="medium" styles={{ root: { color: 'red' } }}>
        {issuesError}
      </Text>
    )}

    {!issuesLoading && !issuesError && issues.length === 0 && (
      <Text>No issues found for this service.</Text>
    )}

    {!issuesLoading && !issuesError && issues.length > 0 && (
      <div>
        {issues.map((issue) => (
          <div
            key={issue.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '12px',
              background: '#fff'
            }}
          >
            <Text variant="large">{issue.title || 'Untitled issue'}</Text>
            <br />
            <Text>Status: {formatStatus(issue.status)}</Text>
            <br />
            <Text>Classification: {issue.classification || 'N/A'}</Text>

            {issue.feature && (
              <>
                <br />
                <Text>Feature: {issue.feature}</Text>
              </>
            )}

            {issue.impactDescription && (
              <>
                <br />
                <Text>Impact: {issue.impactDescription}</Text>
              </>
            )}
          </div>
        ))}
      </div>
    )}
  </div>

  
)}


   <div style={{ marginTop: '32px' }}>
  <Text variant="xLarge">Message Center</Text>
  <br />
  <br />

<TextField
  label="Search messages"
  value={messageSearch}
  onChange={(_, newValue) => setMessageSearch(newValue || '')}
  placeholder="Search by title, category, or severity"
/>

<br />

  {messagesLoading && <Spinner size={SpinnerSize.medium} label="Loading messages..." />}

  {!messagesLoading && messagesError && (
    <Text variant="medium" styles={{ root: { color: 'red' } }}>
      {messagesError}
    </Text>
  )}

 {!messagesLoading && !messagesError && filteredMessages.length === 0 && (
  <Text>No messages match your search.</Text>
)}

  {!messagesLoading && !messagesError && messages.length > 0 && (
    <div>
      {filteredMessages.map((message) => (
  <div
    key={message.id}
    onClick={() => {
  if (selectedMessageId === message.id) {
    setSelectedMessageId(null);
    //setSelectedMessage(null);
  } else {
    setSelectedMessageId(message.id);
    //setSelectedMessage(message);
  }
}}
    style={{
      border: selectedMessageId === message.id ? '2px solid #0078d4' : '1px solid #ddd',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '12px',
      background: selectedMessageId === message.id ? '#f3f9ff' : '#fff',
      boxShadow:
        selectedMessageId === message.id
          ? '0 2px 6px rgba(0, 0, 0, 0.12)'
          : 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
 
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <Icon iconName={selectedMessageId === message.id ? 'ChevronDown' : 'ChevronRight'} />
  <Text variant="large">{message.title || 'Untitled message'}</Text>
</div>

<br />
<Text>Category: {formatCategory(message.category)}</Text>
<br />
<span style={getSeverityBadgeStyle(message.severity)}>
  {formatSeverity(message.severity)}
</span>

{selectedMessageId === message.id && (
  <>
    <br />
    <Text>Created: {formatDate(message.createdDateTime)}</Text>
    <br />
    <Text>Last Updated: {formatDate(message.lastModifiedDateTime)}</Text>

    {message.actionRequiredByDateTime && (
      <>
        <br />
        <Text>Action Required By: {formatDate(message.actionRequiredByDateTime)}</Text>
      </>
    )}
  </>
)}

          
          
        </div>
      ))}
    </div>
  )}
</div>           
            
    
        
      
    </div>

    
  );
  
};



export default ServiceHealthDashboard;
