import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ButtonModule } from 'primeng/button';
// import { InputTextarea } from  'primeng/inputtextarea';

import { TextareaModule } from 'primeng/textarea';

import { FormsModule } from '@angular/forms';
// import { QuillModule } from 'ngx-quill';
import { Router, RouterLink } from '@angular/router';

import { EditorComponent, EditorModule } from '@tinymce/tinymce-angular';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { AccordionModule } from 'primeng/accordion';
@Component({
  selector: 'app-virtual-client',
  imports: [
    HeaderComponent,
    ButtonModule,
    CommonModule,
    SelectModule,
    RouterLink,
    OverlayPanelModule,
    TextareaModule,
    FormsModule,
    AccordionModule,
  ],
  templateUrl: './virtual-client.component.html',
  styleUrl: './virtual-client.component.css',
})
export class VirtualClientComponent {
  @ViewChild('commentPanel') commentPanel!: OverlayPanel;
  commentText: string = '';
  panelStyle: any = {};
  clickEvent?: MouseEvent;
  commentBox = '';
  imageUrl: any;
  formData: any;
  contentDisabled = false;
  //silder
  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  isImageRegenrateDisabled = false;
  constructor(
    private aiContentGenerationService: ContentGenerationService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.contentDisabled = true;

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
      console.log(' client Form data received:', this.formData);
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
      console.log('client getImagegetImage', data);
      if (data) {
        this.imageUrl = data;
      }
      this.contentDisabled = false;
    });

    this.isImageRegenrateDisabled = false;
    this.contentDisabled = true;
  }

  navigateToDashboard(): void {
    this.route.navigateByUrl('dashboard');
  }

  downloadImage() {
    if (!this.imageUrl) {
      console.error('No image URL available.');
      return;
    }

    const a = document.createElement('a');
    a.href = this.imageUrl;
    a.target = '_blank'; // Opens the image in a new tab (optional)
    a.download = 'downloaded-image.png'; // Triggers download with the specified name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  navigateToSuccess(): void {
    this.route
      .navigate(['/success-page'])
      .then(() => {
        console.log('Navigation to success page completed');
      })
      .catch((error) => {
        console.error('Navigation error:', error);
      });
  }
  onPanelClick(event: MouseEvent) {
    this.clickEvent = event;
    this.commentPanel.show(event);
  }
  positionPanel(event: any) {
    if (this.clickEvent) {
      this.panelStyle = {
        'left.px': this.clickEvent.clientX,
        'top.px': this.clickEvent.clientY,
      };
    }
  }
  saveComment() {}
}
