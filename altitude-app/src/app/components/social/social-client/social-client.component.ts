import {
  ChangeDetectorRef,
  Component,
  Input,
  input,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { TabsModule } from 'primeng/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { EditorModule } from '@tinymce/tinymce-angular';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
  selector: 'app-social-client',
  imports: [
    TabsModule,
    FormsModule,
    SelectModule,
    ReactiveFormsModule,
    CommonModule,
    CommonModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    AccordionModule,
    FormsModule,
    EditorModule,
    SelectModule,
    HeaderComponent,
    RouterLink,
    MenuModule,
    DialogModule,
    OverlayPanelModule,
  ],
  templateUrl: './social-client.component.html',
  styleUrl: './social-client.component.css',
})
export class SocialClientComponent {
  editorContentSocialMedia: any;
  imageUrl: any;
  brand: any;
  brandlogo!: string;
  imageContainerHeight = '0px';
  imageContainerWidth = '0px';
  imageHeight = '0px';
  imageWidth = '0px';
  ispublisLoaderDisabled = false;
  editorContentSocialMedia1: any;
  audianceData1: any;
  audianceData2: any;
  clickEvent?: MouseEvent;
  @ViewChild('commentPanel') commentPanel!: OverlayPanel;
  commentText: string = '';
  panelStyle: any = {};
  commentBox = '';
  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService
  ) {}

  formData: any;
  ngOnInit(): void {
    this.ispublisLoaderDisabled = false;
    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
      console.log('datadatadatadatadatadatadatadatadatadatadatadata', data);
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
      console.log('getImagegetImage', data);
      if (data) {
        this.imageUrl = data;
      }
    });

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
      console.log('Form data received:', this.formData);
    });

    this.aiContentGenerationService
      .getSocialResponsetData()
      .subscribe((data) => {
        this.editorContentSocialMedia = data?.content;
        // this.chnge.detectChanges();
      });

    this.aiContentGenerationService
      .getSocialResponsetData1()
      .subscribe((data) => {
        this.editorContentSocialMedia1 = data?.content;
        // this.chnge.detectChanges();
      });
    this.brand = this.formData?.brand.replace('.com', ' ');
    let brandName = this.formData?.brand?.trim();
    if (brandName) {
      brandName = brandName.replace(/\s+/g, '');
      this.brandlogo =
        'https://img.logo.dev/' +
        brandName +
        '?token=pk_SYZfwlzCQgO7up6SrPOrlw';
      console.log('logo:', this.brandlogo);
    }

    this.aiContentGenerationService
      .getAudianceResponseData1()
      .subscribe((data) => {
        this.audianceData1 = data?.content;
        console.log('audiance string1 : ', this.audianceData1);
        // this.chnge.detectChanges();
      });

    this.aiContentGenerationService
      .getAudianceResponseData2()
      .subscribe((data) => {
        this.audianceData2 = data?.content;
        console.log('audiance string 2: ', this.audianceData2);
        // this.chnge.detectChanges();
      });
  }

  async publishContent() {
    this.ispublisLoaderDisabled = true;
    const link = this.formData?.Hashtags;
    console.log(
      'Face psot api : image:',
      this.imageUrl,
      ' content : ',
      this.editorContentSocialMedia,
      ' link :',
      link
    );

    this.aiContentGenerationService.postFacebook(
      this.imageUrl,
      this.editorContentSocialMedia,
      link
    );
    this.navigateToSuccess();

    this.ispublisLoaderDisabled = false;
    console.log('successfully');
  }
  navigateToDashboard(): void {
    this.route.navigateByUrl('dashboard');
    // this.chnge.detectChanges();
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
