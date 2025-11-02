import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
  viewChild,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
import { EmailFormComponent } from '../email/email-form/email-form.component';
import { SocialFormComponent } from '../social/social-form/social-form.component';
import { BlogFormComponent } from '../blog/blog-form/blog-form.component';
import { ImageFormComponent } from '../image-generation/image-form/image-form.component';
import { VirtualFormComponent } from '../virtual/virtual-form/virtual-form.component';
import { ProductDescComponent } from '../product/product-desc/product-desc.component';
import { VideoFormComponent } from '../video/video-form/video-form.component';
import { CombinedFormComponent } from '../Combined/combined-form/combined-form.component';
import { InputTextModule } from 'primeng/inputtext';
import { ChatAppComponent } from '../../shared/chat-app/chat-app.component';
import { SocketConnectionService } from '../../services/socket-connection.service';

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
    ProductDescComponent,
    VideoFormComponent,
    CombinedFormComponent,
    InputTextModule,
    ChatAppComponent
  ],
  templateUrl: './generate-request.component.html',
  styleUrl: './generate-request.component.css',
})
export class GenerateRequestComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private socketConnection = inject(SocketConnectionService);
  selection: any = null; // Initialize with null to prevent undefined errors
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
  dueDate: any = '';
  taskID: any = ''; // Initialize with an empty string

  generateTaskId(): string {
    if (isPlatformBrowser(this.platformId)) {
      const timestamp = Date.now();
      this.taskID = `EM-2203-${timestamp}`;
      return `EM-2203-${timestamp}`;
    }
    // Default value for SSR
    this.taskID = `EM-2203-PENDING`;
    return `EM-2203-PENDING`;
  }

  ngOnInit(): void {
    // Only execute browser-specific code in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.generateTaskId();
      this.dueDate = this.currentDate.toISOString().split('T')[0];
      this.selection = this.store.campaignType();
      console.log('store: ', this.store.campaignType());

      // Ensure socket connection is established when entering this page
      // this.socketConnection.ensureConnection();
    } else {
      // Set default values for SSR
      this.taskID = 'EM-2203-PENDING';
      this.dueDate = '----/--/--';
      this.selection = null;
    }
  }
}