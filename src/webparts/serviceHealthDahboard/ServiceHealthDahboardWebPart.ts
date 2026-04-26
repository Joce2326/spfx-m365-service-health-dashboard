import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart
} from '@microsoft/sp-webpart-base';

import ServiceHealthDashboard from './components/ServiceHealthDahboard';
import { IServiceHealthDashboardProps } from './components/IServiceHealthDahboardProps';

export interface IServiceHealthDashboardWebPartProps { }

export default class ServiceHealthDashboardWebPart extends BaseClientSideWebPart<IServiceHealthDashboardWebPartProps> {
  public render(): void {
    const element: React.ReactElement<IServiceHealthDashboardProps> = React.createElement(
      ServiceHealthDashboard,
      {
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}