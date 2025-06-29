import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { StepperModule } from 'primeng/stepper';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectModule } from 'primeng/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { sign } from 'crypto';
import { ContentGenerationService } from '../../services/content-generation.service';
import { Router, RouterLink } from '@angular/router';
import { SelectionStore } from '../../store/campaign.store';
import { EmailFormComponent } from '../email-form/email-form.component';
import { SocialFormComponent } from '../social-form/social-form.component';
import { BlogFormComponent } from '../blog-form/blog-form.component';
import { ImageFormComponent } from '../image-form/image-form.component';
import { VirtualFormComponent } from '../virtual-form/virtual-form.component';
@Component({
  selector: 'app-generate-request',
  imports: [
    HeaderComponent,
    StepperModule,
    RadioButtonModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    ReactiveFormsModule,
    SelectModule,
    RouterLink,
    EmailFormComponent,
    SocialFormComponent,
    BlogFormComponent,
    ImageFormComponent,
    VirtualFormComponent,
  ],
  templateUrl: './generate-request.component.html',
  styleUrl: './generate-request.component.css',
})
export class GenerateRequestComponent implements OnInit {
  selection: any;
  radiobtn = [
    {
      label: 'Input Details Manually',
      value: 'details',
      source: 'assets/images/Textbox.svg',
      description: 'Manually input your details through a form.',
    },
    {
      label: 'Upload Your Brief',
      value: 'upload',
      source: 'assets/images/FileArrowUp.svg',
      description: 'Upload your documents in pdf, doc, xsl.',
    },
    {
      label: 'Voice based input',
      value: 'voice',
      source: 'assets/images/Microphone.svg',
      description: 'Use voice based method to input your idea.',
    },
  ];

  details: any = 'details';
  store = inject(SelectionStore);
  currentDate: any = new Date();
  dueDate: any = this.currentDate.toISOString().split('T')[0];
  taskID: any = ''; // Initialize with an empty string
  generateTaskId(): string {
    const timestamp = Date.now();
    this.taskID = `EM-2203-${timestamp}`;
    return `EM-2203-${timestamp}`;
  }
  ngOnInit(): void {
    this.selection = this.store.campaignType();

    console.log('store: ', this.store.campaignType());
  }
}
