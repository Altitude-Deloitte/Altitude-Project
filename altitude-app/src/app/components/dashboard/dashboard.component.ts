import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

interface Task {
  id: string;
  channel: string;
  platform: string;
  campaign: string;
  status: string;
  statusDot: string;
  version: string;
  impact: string;
  ctrBefore: string;
  ctrAfter: string;
  beforeTitle: string;
  beforeBody: string;
  beforeCta: string;
  afterTitle: string;
  afterBody: string;
  afterCta: string;
  aiWhy: string[];
  visible?: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, CommonModule, FormsModule, Select],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  cardList = [
    {
      number: '100',
      description: 'All tasks',
      icon: '',
      filter: 'all'
    },
    {
      title: '20',
      description: 'In progress',
      icon: 'assets/images/progress.svg',
      filter: 'progress'
    },
    {
      title: '30',
      description: 'For Review',
      icon: 'assets/images/time.svg',
      filter: 'review'
    },
    {
      title: '20',
      description: 'Rework',
      icon: 'assets/images/rework.svg',
      filter: 'rework'
    },
    {
      title: '30',
      description: 'Approved',
      icon: 'assets/images/check.svg',
      filter: 'approved'
    },
  ];

  // Dropdown Options
  channelOptions = [
    { label: 'All', value: 'all' },
    { label: 'Ads', value: 'Ads' },
    { label: 'Social', value: 'Social' },
    { label: 'Email', value: 'Email' }
  ];

  platformOptions = [
    { label: 'All Platforms', value: 'all' },
    { label: 'Google Ads', value: 'Google Ads' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Marketo', value: 'Marketo' }
  ];

  windowOptions = [
    { label: 'Last 14 Days', value: '14' },
    { label: 'Last 7 Days', value: '7' },
    { label: 'Last 30 Days', value: '30' }
  ];

  impactViewOptions = [
    { label: 'Ad Campaigns', value: 'ads' },
    { label: 'Social Campaigns', value: 'social' }
  ];

  impactCampaignOptions = [
    { label: 'Tata EV', value: 'Tata EV' },
    { label: 'ICICI Festive', value: 'ICICI Festive' }
  ];

  metricsChannelOptions = [
    { label: 'Ad Campaigns', value: 'Ad Campaigns' },
    { label: 'Social Campaigns', value: 'Social Campaigns' },
    { label: 'Email', value: 'Email' }
  ];

  metricsScopeOptions = [
    { label: 'All', value: 'All' },
    { label: 'Tata EV', value: 'Tata EV' },
    { label: 'ICICI Festive', value: 'ICICI Festive' }
  ];

  metricsVersionOptions = [
    { label: 'All Versions', value: 'All Versions' },
    { label: 'V1 → V2', value: 'V1 → V2' },
    { label: 'V2 → V3', value: 'V2 → V3' }
  ];

  // Filters
  channelFilter = 'all';
  platformFilter = 'all';
  windowFilter = '14';
  impactOnly = false;

  // Metrics Filters
  metricsChannel = 'Ad Campaigns';
  metricsScope = 'All';
  metricsVersion = 'All Versions';

  // Campaign Impact
  activeTab = 'ads';
  impactView = 'ads';
  impactCampaign = 'Tata EV';

  // Drawer
  drawerOpen = false;
  selectedTask: Task | null = null;
  lastSelectedTask: Task | null = null;

  // Task Data
  tasks: Task[] = [
    {
      id: 'ALT-112',
      channel: 'Ads',
      platform: 'Google Ads',
      campaign: 'Tata EV',
      status: 'Live',
      statusDot: 'green',
      version: 'V3',
      impact: '+31%',
      ctrBefore: '1.8%',
      ctrAfter: '2.4%',
      beforeTitle: 'Say Goodbye to Petrol Expenses with Tata\'s New EV!',
      beforeBody: 'Switch to Tata\'s electric vehicle and save money with zero emissions. Order now!',
      beforeCta: 'Order Now',
      afterTitle: 'Last Chance to Drive Green! Tata EV Offers Ending Soon',
      afterBody: 'Switch to Tata\'s electric and save big with zero emissions. Limited-time offer — Order now!',
      afterCta: 'Learn More',
      aiWhy: [
        'Headline optimized for urgency ("Last chance")',
        'Emphasized limited-time benefits to drive clicks',
        'Aligned CTA with user intent (Order Now → Learn More)'
      ],
      visible: true
    },
    {
      id: 'ALT-134',
      channel: 'Social',
      platform: 'Instagram',
      campaign: 'ICICI Festive',
      status: 'Reviewing',
      statusDot: 'yellow',
      version: 'V2',
      impact: '+22%',
      ctrBefore: '2.1%',
      ctrAfter: '2.7%',
      beforeTitle: 'Festive savings are here',
      beforeBody: 'Celebrate with exclusive deals and cashback offers. Tap to explore.',
      beforeCta: 'Explore',
      afterTitle: 'Deals Ending Soon — Grab ICICI Cashback Today',
      afterBody: 'Limited-time festive cashback. Tap now and don\'t miss out!',
      afterCta: 'Shop Now',
      aiWhy: [
        'CTA strengthened for action (Explore → Shop Now)',
        'Urgency added to improve swipe-through',
        'Shorter copy optimized for mobile feed'
      ],
      visible: true
    },
    {
      id: 'ALT-158',
      channel: 'Email',
      platform: 'Marketo',
      campaign: 'UL ESG',
      status: 'For Review',
      statusDot: 'yellow',
      version: 'V1',
      impact: 'NA',
      ctrBefore: '—',
      ctrAfter: '—',
      beforeTitle: 'UL ESG Update',
      beforeBody: 'Here\'s a quick update on ESG initiatives and what\'s next.',
      beforeCta: 'Read More',
      afterTitle: '',
      afterBody: '',
      afterCta: '',
      aiWhy: ['Awaiting performance data (email not deployed)'],
      visible: true
    }
  ];

  ngOnInit() {
    // Open first task by default
    if (this.tasks.length > 0) {
      this.openDrawer(this.tasks[0]);
    }
  }

  openDrawer(task: Task) {
    this.selectedTask = task;
    this.lastSelectedTask = task;
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }

  openLastTask() {
    if (this.lastSelectedTask) {
      this.openDrawer(this.lastSelectedTask);
    }
  }

  toggleImpactOnly() {
    this.impactOnly = !this.impactOnly;
    this.applyFilters();
  }

  applyFilters() {
    this.tasks.forEach(task => {
      const matchChannel = this.channelFilter === 'all' || task.channel === this.channelFilter;
      const matchPlatform = this.platformFilter === 'all' || task.platform === this.platformFilter;
      const impact = (task.impact || '').toUpperCase();
      const isNA = impact === 'NA' || impact === '' || impact === '—';
      const matchImpact = !this.impactOnly || !isNA;

      task.visible = matchChannel && matchPlatform && matchImpact;
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.impactView = tab;
  }

  filterByStatus(filter: string) {
    this.tasks.forEach(task => {
      const status = (task.status || '').toLowerCase();
      let show = true;

      if (filter === 'progress') show = status.includes('progress');
      if (filter === 'review') show = status.includes('review');
      if (filter === 'rework') show = status.includes('rework');
      if (filter === 'approved') show = status.includes('approved');
      if (filter === 'all') show = true;

      task.visible = show;
    });

    // Re-apply other filters
    this.applyFilters();
  }

  getAiSummary(task: Task): string {
    return task.aiWhy && task.aiWhy[0] ? task.aiWhy[0] : 'Awaiting performance data.';
  }
}
