import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, MultiSelectModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  requestOptions = [
    { name: 'Email Request', code: 'email' },
    { name: 'Social Post', code: 'social' },
    { name: 'Blog Article', code: 'blog' },
    // Add more options as needed
  ];
  selectedRequests: any[] = [];
}
