import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  cardList = [
    {
      number: '100',
      description: 'All tasks',
      icon: '',
    },
    {
      title: '20',
      description: 'In progress',
      icon: 'assets/images/progress.svg',
    },
    {
      title: '30',
      description: 'For Review',
      icon: 'assets/images/time.svg',
    },
    {
      title: '20',
      description: 'Rework',
      icon: 'assets/images/rework.svg',
    },
    {
      title: '30',
      description: 'Approved',
      icon: 'assets/images/check.svg',
    },
  ];
}
