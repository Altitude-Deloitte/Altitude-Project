import {
  Component,
  ViewChild,
  effect,
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
  imageUrlSocialmedia: any;
  imageFBUrlSocialmedia: any;
  imageInstaUrlSocialmedia: any;
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
  ) {
    // Watch for chat response from AI chat
    effect(() => {
      const chatResponse = this.aiContentGenerationService.chatResponse();
      console.log('Effect triggered in social-client - Chat Response:', chatResponse);

      // Check for both structures: result.generation OR result.facebook/instagram/etc
      if (chatResponse?.result) {
        if (chatResponse.result.generation) {
          console.log('Processing chat response with result.generation structure in social-client');
          this.processChatResponse(chatResponse.result.generation);
        } else if (chatResponse.result.facebook || chatResponse.result.instagram || chatResponse.result.twitter || chatResponse.result.linkedin) {
          console.log('Processing chat response with nested platform structure in social-client');
          this.processChatResponse(chatResponse.result);
        }
      }
    });
  }

  formData: any;
  currentDate: any = new Date();
  currentsDate: any = this.currentDate.toISOString().split('T')[0];
  ngOnInit(): void {
    this.ispublisLoaderDisabled = false;
    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
      if (data) {
        this.imageUrl = data;
      }
    });

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
    });

    this.aiContentGenerationService
      .getSocialResponsetData()
      .subscribe((data) => {
        console.log('Social-client Response Data:', data);

        // CHAT-APP STRUCTURE: data.result.facebook.generation.facebook
        if (data.result.facebook?.generation?.facebook) {
          const fbData = data.result.facebook.generation.facebook;
          console.log('Facebook data (chat-app structure) in social-client:', fbData);
          this.editorContentSocialMedia = (fbData.content || fbData.text || '').replace(/"/g, '').trim();
          this.imageFBUrlSocialmedia = fbData.image_url;
        }
        // FORM STRUCTURE (lowercase): data.result.generation.facebook
        else if (data.result.generation?.facebook) {
          const fbData = data.result.generation.facebook;
          console.log('Facebook data (form lowercase) in social-client:', fbData);
          this.editorContentSocialMedia = (fbData.content || fbData.text || '').replace(/"/g, '').trim();
          this.imageFBUrlSocialmedia = fbData.image_url;
        }
        // FORM STRUCTURE (uppercase): data.result.generation.Facebook
        else if (data.result.generation?.Facebook) {
          const fbData = data.result.generation.Facebook;
          console.log('Facebook data (form uppercase) in social-client:', fbData);
          this.editorContentSocialMedia = fbData.text;
          this.imageFBUrlSocialmedia = fbData.image_url;
        }

        // CHAT-APP STRUCTURE: data.result.instagram.generation.instagram
        if (data.result.instagram?.generation?.instagram) {
          const instaData = data.result.instagram.generation.instagram;
          console.log('Instagram data (chat-app structure) in social-client:', instaData);
          this.editorContentSocialMedia1 = (instaData.content || instaData.text || '').replace(/"/g, '').trim();
          this.imageInstaUrlSocialmedia = instaData.image_url;
        }
        // FORM STRUCTURE (lowercase): data.result.generation.instagram
        else if (data.result.generation?.instagram) {
          const instaData = data.result.generation.instagram;
          console.log('Instagram data (form lowercase) in social-client:', instaData);
          this.imageInstaUrlSocialmedia = instaData.image_url;
          this.editorContentSocialMedia1 = (instaData.content || instaData.text || '').replace(/"/g, '').trim();
        }
        // FORM STRUCTURE (uppercase): data.result.generation.Instagram
        else if (data.result.generation?.Instagram) {
          const instaData = data.result.generation.Instagram;
          console.log('Instagram data (form uppercase) in social-client:', instaData);
          this.imageInstaUrlSocialmedia = instaData.image_url;
          this.editorContentSocialMedia1 = instaData.text;
        }

        console.log('Social-client content after subscription - FB:', !!this.editorContentSocialMedia, 'Instagram:', !!this.editorContentSocialMedia1);
      });

    this.aiContentGenerationService
      .getSocialResponsetData1()
      .subscribe((data) => {
        // Handle new nested structure (lowercase keys)
        if (data.result.generation.facebook) {
          const fbData = data.result.generation.facebook;
          this.editorContentSocialMedia = (fbData.content || fbData.text || '').replace(/"/g, '').trim();
          this.imageFBUrlSocialmedia = fbData.image_url;
        } else if (data.result.generation.Facebook) {
          // Fallback to legacy uppercase structure
          this.editorContentSocialMedia = data.result.generation.Facebook.text;
          this.imageFBUrlSocialmedia = data.result.generation.Facebook.image_url;
        }

        if (data.result.generation.instagram) {
          const instaData = data.result.generation.instagram;
          this.imageInstaUrlSocialmedia = instaData.image_url;
          this.editorContentSocialMedia1 = (instaData.content || instaData.text || '').replace(/"/g, '').trim();
        } else if (data.result.generation.Instagram) {
          // Fallback to legacy uppercase structure
          this.imageInstaUrlSocialmedia = data.result.generation.Instagram.image_url;
          this.editorContentSocialMedia1 = data.result.generation.Instagram.text;
        }
      });
    this.brand = this.formData?.brand.replace('.com', ' ');
    let brandName = this.formData?.brand?.trim();
    if (brandName) {
      brandName = brandName.replace(/\s+/g, '');
      this.brandlogo =
        'https://img.logo.dev/' +
        brandName +
        '?token=pk_SYZfwlzCQgO7up6SrPOrlw';
    }

    this.aiContentGenerationService
      .getAudianceResponseData1()
      .subscribe((data) => {

        this.audianceData1 = data.result.generation.text;
      });

    this.aiContentGenerationService
      .getAudianceResponseData2()
      .subscribe((data) => {
        this.audianceData2 = data?.content;
      });
  }

  async publishContent() {
    this.ispublisLoaderDisabled = true;
    const link = this.formData?.Hashtags;
    this.aiContentGenerationService.postFacebook(
      this.imageUrl,
      this.editorContentSocialMedia,
      link
    );
    this.navigateToSuccess();
    this.ispublisLoaderDisabled = false;
  }

  navigateToDashboard(): void {
    this.route.navigateByUrl('dashboard');
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

  // Process chat response data
  processChatResponse(generationData: any) {
    console.log('Processing chat response in social client:', generationData);

    // CHAT-APP STRUCTURE: facebook.generation.facebook nested structure
    if (generationData.facebook?.generation?.facebook || generationData.instagram?.generation?.instagram) {
      console.log('Detected chat-app nested structure in social-client');

      // Process Facebook data from chat-app
      if (generationData.facebook?.generation?.facebook) {
        const fbData = generationData.facebook.generation.facebook;
        const fbContent = fbData.content || fbData.text;
        this.editorContentSocialMedia = fbContent.replace(/"/g, '').trim();
        this.imageFBUrlSocialmedia = fbData.image_url;
      }

      // Process Instagram data from chat-app
      if (generationData.instagram?.generation?.instagram) {
        const instaData = generationData.instagram.generation.instagram;
        const instaContent = instaData.content || instaData.text;
        this.editorContentSocialMedia1 = instaContent.replace(/"/g, '').trim();
        this.imageInstaUrlSocialmedia = instaData.image_url;
      }
    }
    // FORM STRUCTURE: Direct facebook/instagram objects
    else if (generationData.facebook || generationData.instagram || generationData.Facebook || generationData.Instagram) {
      console.log('Detected form direct structure in social-client');

      // Process Facebook data (lowercase or uppercase)
      const fbData = generationData.facebook || generationData.Facebook;
      if (fbData && (fbData.content || fbData.text)) {
        const fbContent = fbData.content || fbData.text;
        this.editorContentSocialMedia = fbContent.replace(/"/g, '').trim();
        this.imageFBUrlSocialmedia = fbData.image_url;
      }

      // Process Instagram data (lowercase or uppercase)
      const instaData = generationData.instagram || generationData.Instagram;
      if (instaData && (instaData.content || instaData.text)) {
        const instaContent = instaData.content || instaData.text;
        this.editorContentSocialMedia1 = instaContent.replace(/"/g, '').trim();
        this.imageInstaUrlSocialmedia = instaData.image_url;
      }
    }

    if (generationData.image_url) {
      this.imageUrl = generationData.image_url;
    }

    console.log('Social-client content set - FB:', !!this.editorContentSocialMedia, 'Instagram:', !!this.editorContentSocialMedia1);

    // Clear chat response after processing
    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 1000);
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
  saveComment() { }
}
