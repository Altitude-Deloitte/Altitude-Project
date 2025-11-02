import { Component, Input, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { TabsModule } from 'primeng/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CommonModule, KeyValue } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { EditorModule } from '@tinymce/tinymce-angular';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { SocketConnectionService } from '../../../services/socket-connection.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogSuccessComponent } from '../../dialog-success/dialog-success.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-social-review',
  imports: [
    TabsModule,
    FormsModule,
    SelectModule,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    AccordionModule,
    EditorModule,
    HeaderComponent,
    RouterLink,
    MenuModule,
    DialogModule,
    ProgressSpinnerModule,
    ToastModule,
    LoaderComponent,
    DrawerModule,
  ],
  providers: [MessageService],
  templateUrl: './social-review.component.html',
  styleUrl: './social-review.component.css',
})
export class SocialReviewComponent {
  editorContentSocialMedia: any;
  characterCount: number = 0;
  imageUrl: any;
  imageFBUrlSocialmedia: any;
  imageInstaUrlSocialmedia: any;
  imageXUrlSocialmedia: any;
  imageLinkedInUrlSocialmedia: any;
  imageContainerHeight = '0px';
  imageContainerWidth = '0px';
  imageHeight = '0px';
  imageWidth = '0px';
  isContentLoaded = true;
  commonPrompt: any;
  commoImagePrompt: any;
  contentDisabled = false;
  isEMailPromptDisabled = false;
  commonPromptIsLoading = false;
  isImageRegenrateDisabled = false;
  isImageRefineDisabled = false;
  existingContent: any;
  totalWordCount: any;
  brandlogo!: string;
  editorContentSocialMedia1: any;
  contentXSocialMedia: any;
  contentLinkdInSocialMedia: any;
  audianceData1: any;
  audianceData2: any;
  hyperUrl: any;
  characterCount1: any;
  totalWordCount1: any;
  brand: any;
  fbLimit: number | null | undefined;
  inLimit: number | null | undefined;
  loading = true;
  @Input() activeTabIndex = 0;
  formData: any;
  currentDate: any = new Date();
  currentsDate: any = this.currentDate.toISOString().split('T')[0];
  activeTabIndexa: any = 0;
  showAgenticWorkflow = false;

  // Regeneration fields
  contentFeedback: string = '';
  imageFeedback: string = '';
  isRegeneratingContent: boolean = false;
  isRegeneratingImage: boolean = false;
  socialPayload: FormData | null = null;

  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService,
    public socketConnection: SocketConnectionService,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {
    // Watch for chat response from AI chat
    effect(() => {
      const chatResponse = this.aiContentGenerationService.chatResponse();
      console.log('Effect triggered - Chat Response:', chatResponse);
      console.log('Has result?', !!chatResponse?.result);
      console.log('Has result.generation?', !!chatResponse?.result?.generation);
      console.log('Has result.facebook?', !!chatResponse?.result?.facebook);
      console.log('Loading state before processing:', this.loading);

      // Check for both structures: result.generation OR result.facebook/instagram/etc
      if (chatResponse?.result) {
        if (chatResponse.result.generation) {
          console.log('Processing chat response with result.generation structure');
          this.processChatResponse(chatResponse.result.generation);
        } else if (chatResponse.result.facebook || chatResponse.result.instagram || chatResponse.result.twitter || chatResponse.result.linkedin) {
          console.log('Processing chat response with nested platform structure');
          this.processChatResponse(chatResponse.result);
        }
        console.log('Loading state after processing:', this.loading);
      }
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit - Initial loading state:', this.loading);

    this.socketConnection.dataSignal.set({});
    this.imageUrl = null;
    this.imageFBUrlSocialmedia = null;
    this.imageInstaUrlSocialmedia = null;
    this.aiContentGenerationService.getImage().subscribe((data) => {
      if (data) {
        this.imageUrl = data;
      }
    });

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
      console.log('Form Data received:', this.formData);
      console.log('Campaign data:', this.formData?.campaign);

      // If campaign data is not present, try to extract from platform_campaign
      if (!this.formData?.campaign && this.formData?.platform_campaign) {
        this.formData.campaign = this.formData.platform_campaign;
        console.log('Extracted campaign from platform_campaign:', this.formData.campaign);
      }

      console.log('Active campaigns:', this.activeCampaigns);
      this.updateActiveTab();

      // Initialize payload for regeneration
      this.initializeSocialPayload();
    });

    this.contentDisabled = true;
    this.imageLinkedInUrlSocialmedia = null;
    this.editorContentSocialMedia = null;
    this.imageFBUrlSocialmedia = null;
    this.editorContentSocialMedia1 = null;
    this.imageInstaUrlSocialmedia = null;
    this.contentXSocialMedia = null;
    this.imageXUrlSocialmedia = null;
    this.contentLinkdInSocialMedia = null;
    this.aiContentGenerationService
      .getSocialResponsetData()
      .subscribe((data) => {
        console.log('Social Response Data:', data);
        console.log('Result structure:', data?.result);

        // Detect available platforms from response and update formData.campaign if needed
        const detectedPlatforms: string[] = [];

        // CHAT-APP STRUCTURE: data.result.facebook.generation.facebook
        if (data.result.facebook?.generation?.facebook) {
          const fbData = data.result.facebook.generation.facebook;
          console.log('Facebook data (chat-app structure):', fbData);
          this.editorContentSocialMedia = (fbData.content || fbData.text || '').replace(/"/g, '').trim();
          this.imageFBUrlSocialmedia = fbData.image_url;
          detectedPlatforms.push('Facebook');
          console.log('FB Content set:', this.editorContentSocialMedia);
          console.log('FB Image set:', this.imageFBUrlSocialmedia);
        }
        // FORM STRUCTURE (lowercase): data.result.generation.facebook
        else if (data.result.generation?.facebook) {
          const fbData = data.result.generation.facebook;
          console.log('Facebook data (form lowercase):', fbData);
          this.editorContentSocialMedia = (fbData.content || fbData.text || '').replace(/"/g, '').trim();
          this.imageFBUrlSocialmedia = fbData.image_url;
          detectedPlatforms.push('Facebook');
        }
        // FORM STRUCTURE (uppercase): data.result.generation.Facebook
        else if (data.result.generation?.Facebook) {
          const fbData = data.result.generation.Facebook;
          console.log('Facebook data (form uppercase):', fbData);
          this.editorContentSocialMedia = (fbData.content || fbData.text || '').replace(/"/g, '').trim();
          this.imageFBUrlSocialmedia = fbData.image_url;
          detectedPlatforms.push('Facebook');
        }

        // CHAT-APP STRUCTURE: data.result.instagram.generation.instagram
        if (data.result.instagram?.generation?.instagram) {
          const instaData = data.result.instagram.generation.instagram;
          console.log('Instagram data (chat-app structure):', instaData);
          this.editorContentSocialMedia1 = (instaData.content || instaData.text || '').replace(/"/g, '').trim();
          this.imageInstaUrlSocialmedia = instaData.image_url;
          detectedPlatforms.push('Instagram');
          console.log('Instagram Content set:', this.editorContentSocialMedia1);
          console.log('Instagram Image set:', this.imageInstaUrlSocialmedia);
        }
        // FORM STRUCTURE (lowercase): data.result.generation.instagram
        else if (data.result.generation?.instagram) {
          const instaData = data.result.generation.instagram;
          console.log('Instagram data (form lowercase):', instaData);
          this.editorContentSocialMedia1 = (instaData.content || instaData.text || '').replace(/"/g, '').trim();
          this.imageInstaUrlSocialmedia = instaData.image_url;
          detectedPlatforms.push('Instagram');
        }
        // FORM STRUCTURE (uppercase): data.result.generation.Instagram
        else if (data.result.generation?.Instagram) {
          const instaData = data.result.generation.Instagram;
          console.log('Instagram data (form uppercase):', instaData);
          this.editorContentSocialMedia1 = (instaData.content || instaData.text || '').replace(/"/g, '').trim();
          this.imageInstaUrlSocialmedia = instaData.image_url;
          detectedPlatforms.push('Instagram');
        }

        // If platforms were detected and formData.campaign is not set, set it
        if (detectedPlatforms.length > 0 && !this.formData?.campaign) {
          this.formData = this.formData || {};
          this.formData.campaign = detectedPlatforms;
          console.log('Auto-detected and set campaign platforms:', this.formData.campaign);
          this.updateActiveTab();
        }

        // Handle Twitter/X - new nested structure
        if (data.result.twitter?.generation?.twitter || data.result.x?.generation?.x) {
          const twitterData = data.result.twitter?.generation?.twitter || data.result.x?.generation?.x;
          console.log('Twitter/X data (new structure):', twitterData);
          this.contentXSocialMedia = (twitterData.content || twitterData.text || '').replace(/"/g, '').trim();
          this.imageXUrlSocialmedia = twitterData.image_url;
        }
        // Fallback: Check for direct generation.twitter/x structure
        else if (data.result.generation?.twitter || data.result.generation?.x) {
          const twitterData = data.result.generation.twitter || data.result.generation.x;
          this.contentXSocialMedia = (twitterData.content || twitterData.text || '').replace(/"/g, '').trim();
          this.imageXUrlSocialmedia = twitterData.image_url;
        }
        // Legacy structure
        else if (data.result.generation?.X) {
          this.contentXSocialMedia = data.result.generation.X.text;
          this.imageXUrlSocialmedia = data.result.generation.X.image_url;
        }

        // Handle LinkedIn - new nested structure
        if (data.result.linkedin?.generation?.linkedin) {
          const linkedinData = data.result.linkedin.generation.linkedin;
          console.log('LinkedIn data (new structure):', linkedinData);
          this.imageLinkedInUrlSocialmedia = linkedinData.image_url;
          this.contentLinkdInSocialMedia = (linkedinData.content || linkedinData.text || '').replace(/"/g, '').trim();
        }
        // Fallback: Check for direct generation.linkedin structure
        else if (data.result.generation?.linkedin) {
          const linkedinData = data.result.generation.linkedin;
          this.imageLinkedInUrlSocialmedia = linkedinData.image_url;
          this.contentLinkdInSocialMedia = (linkedinData.content || linkedinData.text || '').replace(/"/g, '').trim();
        }
        // Legacy structure
        else if (data.result.generation?.LinkedIn) {
          this.imageLinkedInUrlSocialmedia = data.result.generation.LinkedIn.image_url;
          this.contentLinkdInSocialMedia = data.result.generation.LinkedIn.text;
        }

        this.editorContentSocialMedia = this.editorContentSocialMedia
          ?.replace(/"/g, '')
          .trim();
        this.characterCount = this.editorContentSocialMedia?.length;
        this.existingContent = this.editorContentSocialMedia;

        const countWords = (emailContent: any) => {
          if (!emailContent) return 0;
          return emailContent?.trim().replace(/\s+/g, ' ').split(' ').length;
        };

        this.totalWordCount = countWords(this.editorContentSocialMedia);

        this.isEMailPromptDisabled = false;
        this.commonPromptIsLoading = false;
        this.isImageRegenrateDisabled = false;
        this.isImageRefineDisabled = false;

        this.hyperUrl = this.formData?.Hashtags;

        let brandName = this.formData?.brand?.trim();
        if (brandName) {
          brandName = brandName.replace(/\s+/g, '');
          this.brandlogo =
            'https://img.logo.dev/' +
            brandName +
            '?token=pk_SYZfwlzCQgO7up6SrPOrlw';
        }

        // Set loading to false immediately after content is extracted
        console.log('Setting loading = false in getSocialResponsetData subscription');
        this.contentDisabled = false;
        this.loading = false;
        console.log('Loading state after getSocialResponsetData:', this.loading);
        console.log('Content extracted - FB:', !!this.editorContentSocialMedia, 'Instagram:', !!this.editorContentSocialMedia1);
      });
    this.aiContentGenerationService
      .getSocialResponsetData1()
      .subscribe((data) => {
        if (data.result.generation.Facebook) {
          this.editorContentSocialMedia = data.result.generation.Facebook.text;
          this.imageFBUrlSocialmedia =
            data.result.generation.Facebook.image_url;
        } else if (data.result.generation.Instagram) {
          this.imageInstaUrlSocialmedia = data.result.generation.Instagram;
          this.editorContentSocialMedia1 =
            data.result.generation.Instagram.text;
        }
        this.editorContentSocialMedia = this.editorContentSocialMedia
          .replace(/"/g, '')
          .trim();
        this.characterCount1 = this.editorContentSocialMedia1.length;
        this.existingContent = this.editorContentSocialMedia1;
        this.contentDisabled = false;
        const countWords = (emailContent: any) => {
          if (!emailContent) return 0;
          return emailContent?.trim().replace(/\s+/g, ' ').split(' ').length;
        };
        this.totalWordCount1 = countWords(this.editorContentSocialMedia1);

        this.isEMailPromptDisabled = false;
        this.commonPromptIsLoading = false;
        this.isImageRegenrateDisabled = false;
        this.isImageRefineDisabled = false;

        console.log('Total word count:', this.totalWordCount1);
        this.brand = this.formData?.brand?.replace('.com', ' ');
        let brandName = this.formData?.brand?.trim();
        if (brandName) {
          brandName = brandName.replace(/\s+/g, '');
          this.brandlogo =
            'https://img.logo.dev/' +
            brandName +
            '?token=pk_SYZfwlzCQgO7up6SrPOrlw';
        }
      });

    this.aiContentGenerationService
      .getAudianceResponseData1()
      .subscribe((data) => {
        this.audianceData1 = data.result.generation.text;
      });

    this.aiContentGenerationService
      .getAudianceResponseData2()
      .subscribe((data) => {
        this.audianceData2 = data.result.generation.text;
      });
  }

  updateActiveTab() {
    if (!this.formData?.campaign) {
      this.activeTabIndexa = 0;
      return;
    }

    // Handle both array and single value
    const campaigns = Array.isArray(this.formData.campaign)
      ? this.formData.campaign
      : [this.formData.campaign];

    // Normalize campaign names to lowercase for comparison
    const normalizedCampaigns = campaigns.map((c: string) => c.toLowerCase());

    if (normalizedCampaigns.includes('facebook') && !normalizedCampaigns.includes('instagram')) {
      this.activeTabIndexa = 0; // Facebook tab
    } else if (
      !normalizedCampaigns.includes('facebook') &&
      normalizedCampaigns.includes('instagram')
    ) {
      this.activeTabIndexa = 1; // Instagram tab
    } else if (
      normalizedCampaigns.includes('facebook') &&
      normalizedCampaigns.includes('instagram')
    ) {
      this.activeTabIndexa = 0; // Default to first tab when both selected
    } else {
      this.activeTabIndexa = 0; // fallback default
    }
  }

  setImageDimensions(height: string, width: string) {
    this.imageContainerHeight = height;
    this.imageContainerWidth = width;
    this.imageHeight = height;
    this.imageWidth = width;
  }

  onCreateProject() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '400px';
    this.dialog.open(DialogSuccessComponent, dialogConfig);
  }

  inputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }

  navigateToForm(): void {
    this.route.navigateByUrl('social-client');
  }

  async postToSocialMedia() {
    await this.aiContentGenerationService.postFacebook(
      this.imageUrl,
      this.editorContentSocialMedia,
      this.formData?.Hashtags
    );
    await this.aiContentGenerationService.postInstagram(
      this.imageUrl,
      this.editorContentSocialMedia
    );
  }

  keepOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0; // Or implement custom sorting logic if needed
  };

  aiContentGeneration(prompt: string, type: string): void {
    const wordLimitValue = this.formData?.wordLimit;

    if (wordLimitValue) {
      const limitsArray = wordLimitValue.split(',');

      this.fbLimit = limitsArray[0] ? parseInt(limitsArray[0], 10) : null;
      this.inLimit = limitsArray[1] ? parseInt(limitsArray[1], 10) : null;
    }
    if (type === 'regenerate') {
      this.isEMailPromptDisabled = true;
      //  prompt = `Create a social media post for scocial media platform "${this.formData?.mediaType}" based on topic "${this.formData?.topic}" and should be of language "${this.formData?.lang}" . The intended tone of the post is "${this.formData?.Type}". Some more details to be considered for generating post content is  "${this.formData?.purpose}".The target audience is "${this.formData?.readers}".The content of post having upto "${this.formData?.wordLimit}" characters and all sentences closed properly. Also include socially relevant , trending tags amd emotion | emoji if required on the the post and in last add this link  "${this.formData?.Hashtags}" if link not provide don't show and don't pass into content. don't add additional details like notes or word count. `;
      console.log('FB limit: ', this.fbLimit);
      // var facebookPrompt = `Create a social media post for the platform "Facebook" based on the topic "${formValues.topic}" and in the language "${formValues.lang}". The tone of the post should be based on the media post as "${formValues.Type1}". The purpose of the post is "${formValues.purpose}". The intended target audience is "${formValues.target1}". The content should be detailed and informative, with a length of "${this.facebookLimit}" characters. Ensure that all sentences are properly structured and the post flows well. Include relevant, trending hashtags and emojis if appropriate for the context. This is the hyper link "${formValues.Hashtags}" add it at the end of the post which is shown as hyperlink and clickable if there is not link, don't include any links). Only return the post content, no additional notes, word count, or instructions.`;
      var facebookPrompt = `Generate a Facebook post on "${this.formData?.topic}" in "${this.formData?.lang}" with a "${this.formData?.Type1}" tone for "${this.formData?.target1}". The purpose is "${this.formData?.purpose}". Keep the post within "${this.fbLimit}" characters, ensuring clarity, engagement, and smooth flow. Use trending hashtags and emojis where relevant. Ensure the response does not exceed the character limit. Return only the post content—no extra text.`;
      this.aiContentGenerationService
        .generateContent(facebookPrompt)
        .subscribe({
          next: (data) => {
            this.aiContentGenerationService.setSocialResponseData(data);
          },
          error: (error) => {
            console.error(`Error occurred for :social_media`, error);
          },
        });

      console.log('Insta limit: ', this.inLimit);
      // var instaPrompt = `Create a social media post for the platform "Instagram" based on the topic "${formValues.topic}" and in the language "${formValues.lang}". The tone of the post should be based on the media post as "${formValues.Type2}" and intractive description and caption. The purpose of the post is "${formValues.purpose}". The intended target audience is "${formValues.target2}". The content should be detailed and informative, with a maximum length of "${this.facebookLimit}" characters. Ensure that all sentences are properly structured and the post flows well. Include relevant, trending hashtags and emojis if appropriate for the context. If a link "${formValues.Hashtags}" is provided, add it at the end of the post (otherwise, don't include any links). Only return the post content, no additional notes, word count, or instructions.`;
      var instaPrompt = `Generate a Instagram post on "${this.formData?.topic}" in "${this.formData?.lang}" with a "${this.formData?.Type2}" tone for "${this.formData?.target2}". The purpose is "${this.formData?.purpose}". Keep the post within "${this.inLimit}" characters, ensuring clarity, engagement, and smooth flow. Use trending hashtags and emojis where relevant.Ensure the response does not exceed the character limit. Return only the post content—no extra text.`;
      this.aiContentGenerationService.generateContent(instaPrompt).subscribe({
        next: (data) => {
          this.aiContentGenerationService.setSocialResponseData1(data);
        },
        error: (error) => {
          console.error(`Error occurred for :social_media`, error);
        },
      });
    } else if (type === 'common_prompt') {
      this.commonPromptIsLoading = true;
      prompt = `This is my existing post "${this.existingContent}" in that don't change whole content from my existing post, just add the new fact / content without removing existing post content based on user input or rephrase withput exced the word limit, The content of post should not exceed "${this.formData?.wordLimit}" words limit. and this is the prompt which user want to add in existing post " ${prompt} ". The content of post characters not exceeding "${this.formData?.wordLimit}" limit, with all sentences closed properly. Also include socially relevant tags for the post. Also include emotions if required. only show content and hastags not any type of additional details or notes `;

      this.aiContentGenerationService.generateContent(prompt).subscribe({
        next: (data) => {
          if (type === 'common_prompt') {
            this.aiContentGenerationService.setSocialResponseData(data);
            this.commonPromptIsLoading = false;
          }
        },
        error: (error) => {
          console.error(`Error occurred for ${type}:`, error);
        },
      });
    }
  }

  imageRegenrate() {
    this.isImageRegenrateDisabled = true;
    var topicPropmt = `Create an image on "${this.formData?.topic}" and image should have white or grey back ground`;
    this.aiContentGenerationService.imageGeneration(topicPropmt).subscribe({
      next: (data) => {
        this.aiContentGenerationService.setImage(data[0].url);
        this.isImageRegenrateDisabled = false;
      },
      error: (err) => {
        console.error('Error generating image:', err);
      },
    });
  }

  onImageRefine(prompt: string, type: string): void {
    this.isImageRefineDisabled = true;
    var topicPropmt = `This is the existing image url "${this.imageUrl}" and topic "${this.formData?.topic}". It should be refine image based on the user input in this propt "${prompt}". But , not change whole image and image should have white or grey back ground`;
    this.aiContentGenerationService.imageGeneration(topicPropmt).subscribe({
      next: (data) => {
        this.aiContentGenerationService.setImage(data[0].url);
        this.isImageRefineDisabled = false;
      },
      error: (er) => {
        console.log('Error refine image', er);
      },
    });
  }

  get activeCampaigns(): string[] {
    if (!this.formData?.campaign) return [];

    // Handle both array and single value
    const campaigns = Array.isArray(this.formData.campaign)
      ? this.formData.campaign
      : [this.formData.campaign];

    // Map lowercase platform names to proper case for display
    return campaigns.map((platform: string) => {
      const lowerPlatform = platform.toLowerCase();
      if (lowerPlatform === 'facebook') return 'Facebook';
      if (lowerPlatform === 'instagram') return 'Instagram';
      if (lowerPlatform === 'twitter' || lowerPlatform === 'x') return 'X';
      if (lowerPlatform === 'linkedin') return 'LinkedIn';
      return platform; // Return original if no match
    });
  }

  // Process chat response data for social media
  processChatResponse(generationData: any) {
    console.log('Processing social media chat response:', generationData);

    // CHAT-APP STRUCTURE: facebook.generation.facebook nested structure
    if (generationData.facebook?.generation?.facebook || generationData.instagram?.generation?.instagram) {
      console.log('Detected chat-app nested structure');

      // Process Facebook data from chat-app
      if (generationData.facebook?.generation?.facebook) {
        const fbData = generationData.facebook.generation.facebook;
        const fbContent = fbData.content || fbData.text;
        this.editorContentSocialMedia = fbContent.replace(/"/g, '').trim();
        this.imageFBUrlSocialmedia = fbData.image_url;
        this.characterCount = this.editorContentSocialMedia.length;

        const countWords = (content: any) => {
          if (!content) return 0;
          return content.trim().replace(/\s+/g, ' ').split(' ').length;
        };
        this.totalWordCount = countWords(this.editorContentSocialMedia);
      }

      // Process Instagram data from chat-app
      if (generationData.instagram?.generation?.instagram) {
        const instaData = generationData.instagram.generation.instagram;
        const instaContent = instaData.content || instaData.text;
        this.editorContentSocialMedia1 = instaContent.replace(/"/g, '').trim();
        this.imageInstaUrlSocialmedia = instaData.image_url;
        this.characterCount1 = this.editorContentSocialMedia1.length;
      }

      // Process Twitter/X data from chat-app
      if (generationData.twitter?.generation?.twitter || generationData.x?.generation?.x) {
        const twitterData = generationData.twitter?.generation?.twitter || generationData.x?.generation?.x;
        this.contentXSocialMedia = (twitterData.content || twitterData.text).replace(/"/g, '').trim();
        this.imageXUrlSocialmedia = twitterData.image_url;
      }

      // Process LinkedIn data from chat-app
      if (generationData.linkedin?.generation?.linkedin) {
        const linkedinData = generationData.linkedin.generation.linkedin;
        this.contentLinkdInSocialMedia = (linkedinData.content || linkedinData.text).replace(/"/g, '').trim();
        this.imageLinkedInUrlSocialmedia = linkedinData.image_url;
      }
    }
    // FORM STRUCTURE: Direct facebook/instagram objects
    else if (generationData.facebook || generationData.instagram || generationData.Facebook || generationData.Instagram) {
      console.log('Detected form direct structure');

      // Process Facebook data (lowercase or uppercase)
      const fbData = generationData.facebook || generationData.Facebook;
      if (fbData && (fbData.content || fbData.text)) {
        const fbContent = fbData.content || fbData.text;
        this.editorContentSocialMedia = fbContent.replace(/"/g, '').trim();
        this.imageFBUrlSocialmedia = fbData.image_url;
        this.characterCount = this.editorContentSocialMedia.length;

        const countWords = (content: any) => {
          if (!content) return 0;
          return content.trim().replace(/\s+/g, ' ').split(' ').length;
        };
        this.totalWordCount = countWords(this.editorContentSocialMedia);
      }

      // Process Instagram data (lowercase or uppercase)
      const instaData = generationData.instagram || generationData.Instagram;
      if (instaData && (instaData.content || instaData.text)) {
        const instaContent = instaData.content || instaData.text;
        this.editorContentSocialMedia1 = instaContent.replace(/"/g, '').trim();
        this.imageInstaUrlSocialmedia = instaData.image_url;
        this.characterCount1 = this.editorContentSocialMedia1.length;
      }

      // Process Twitter/X data
      const twitterData = generationData.twitter || generationData.x || generationData.X;
      if (twitterData) {
        this.contentXSocialMedia = (twitterData.content || twitterData.text).replace(/"/g, '').trim();
        this.imageXUrlSocialmedia = twitterData.image_url;
      }

      // Process LinkedIn data
      const linkedinData = generationData.linkedin || generationData.LinkedIn;
      if (linkedinData) {
        this.contentLinkdInSocialMedia = (linkedinData.content || linkedinData.text).replace(/"/g, '').trim();
        this.imageLinkedInUrlSocialmedia = linkedinData.image_url;
      }
    }
    // Handle legacy response structure
    else {
      // Update component data based on chat response
      if (generationData.image_url) {
        this.imageUrl = generationData.image_url;
      }

      if (generationData.facebook_image_url) {
        this.imageFBUrlSocialmedia = generationData.facebook_image_url;
      }

      if (generationData.instagram_image_url) {
        this.imageInstaUrlSocialmedia = generationData.instagram_image_url;
      }

      if (generationData.twitter_image_url || generationData.x_image_url) {
        this.imageXUrlSocialmedia = generationData.twitter_image_url || generationData.x_image_url;
      }

      if (generationData.html || generationData.content || generationData.social_media_content) {
        let socialContent = generationData.html || generationData.content || generationData.social_media_content;

        if (typeof socialContent !== 'string') {
          socialContent = JSON.stringify(socialContent);
        }

        socialContent = socialContent.replace(/"/g, '').trim();
        this.editorContentSocialMedia = socialContent.replace(/\\n\\n/g, '');
        this.existingContent = this.editorContentSocialMedia;

        // Update character count
        this.characterCount = this.editorContentSocialMedia.length;
      }
    }

    // Set loading states
    console.log('Setting loading = false in processChatResponse');
    this.loading = false;
    this.contentDisabled = false;
    this.isEMailPromptDisabled = false;
    this.commonPromptIsLoading = false;
    this.isImageRegenrateDisabled = false;
    this.isImageRefineDisabled = false;
    console.log('Loading state after setting false:', this.loading);

    // Clear chat response after processing
    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 300);
  }

  // Initialize social media payload from form data or collected data from chat-app
  initializeSocialPayload(): void {
    if (!this.formData) return;

    this.socialPayload = new FormData();

    // Use collected data structure (from chat-app) if available, otherwise use formData (from social-form)
    const useCase = this.formData?.use_case || 'Social Media Campaign';
    const purpose = this.formData?.purpose || '';
    const brand = this.formData?.brand || '';
    const tone = this.formData?.tone || this.formData?.Type || '';
    const topic = this.formData?.topic || '';
    const platform = this.formData?.platform_campaign || this.formData?.platform || this.formData?.socialPlatform || '';
    const targetReader = this.formData?.target_reader || this.formData?.targetAudience || this.formData?.readers || '';
    const imageDetails = this.formData?.image_details || this.formData?.imageOpt || '';
    const imageDescription = this.formData?.image_description || this.formData?.imgDesc || '';

    this.socialPayload.append('use_case', useCase);
    this.socialPayload.append('purpose', purpose);
    this.socialPayload.append('brand', brand);
    this.socialPayload.append('tone', tone);
    this.socialPayload.append('topic', topic);
    this.socialPayload.append('platform', platform);
    this.socialPayload.append('target_reader', targetReader);
    this.socialPayload.append('image_details', imageDetails);

    if (imageDescription && imageDescription.trim() !== '') {
      this.socialPayload.append('image_description', imageDescription);
    }
    if (this.formData?.additional && this.formData?.additional.trim() !== '') {
      this.socialPayload.append('additional_details', this.formData?.additional);
    }
  }

  // Validate content feedback input
  validateContentFeedback(feedback: string): boolean {
    const lowerFeedback = feedback.toLowerCase().trim();

    // Check if feedback mentions word count/limit
    const hasWordKeyword = lowerFeedback.includes('word count') || 
                          lowerFeedback.includes('word limit') || 
                          lowerFeedback.includes('words');

    // If word count/limit is mentioned, extract the number and validate it's >= 50
    if (hasWordKeyword) {
      const numbers = feedback.match(/\b\d+\b/g);
      if (numbers && numbers.length > 0) {
        const wordLimit = parseInt(numbers[0], 10);
        if (wordLimit < 50) {
          return false; // Invalid: word limit less than 50
        }
      }
    }

    return true; // Valid feedback
  }




  // Regenerate content based on feedback
  regenerateContent(): void {
    if (!this.contentFeedback || this.contentFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter feedback to regenerate content',
        life: 3000
      });
      return;
    }

    // Validate word limit is at least 50
    if (!this.validateContentFeedback(this.contentFeedback)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Word Limit',
        detail: 'Word limit should be more than 50 words.',
        life: 5000,
        icon: 'pi pi-exclamation-triangle'
      });
      return;
    }

    if (!this.socialPayload) {
      this.initializeSocialPayload();
    }

    // Add feedback and regenerate flag to payload
    this.socialPayload?.append('feedback', this.contentFeedback);
    this.socialPayload?.append('regenerate', 'true');

    this.isRegeneratingContent = true;
    // Don't set loading = true for regeneration (keep loader hidden)

    this.aiContentGenerationService.generateContent(this.socialPayload!).subscribe({
      next: (data) => {
        console.log('Content regenerated:', data);

        // Process the regenerated content
        if (data?.result?.generation) {
          this.processChatResponse(data.result.generation);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Content regenerated successfully',
          life: 3000,
          styleClass: 'custom-toast-success'
        });

        // Clear feedback input
        this.contentFeedback = '';

        // Reinitialize payload for next regeneration
        this.initializeSocialPayload();
      },
      error: (error) => {
        console.error('Error regenerating content:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate content. Please try again.',
          life: 3000
        });
        this.isRegeneratingContent = false;
      },
      complete: () => {
        this.isRegeneratingContent = false;
      }
    });
  }

  // Regenerate image based on feedback
  regenerateImage(): void {
    if (!this.imageFeedback || this.imageFeedback.trim() === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter image feedback to regenerate',
        life: 3000
      });
      return;
    }

    // Reinitialize payload to ensure all form data is fresh
    this.initializeSocialPayload();

    // Add image feedback and regenerate flag to payload
    this.socialPayload?.append('image_feedback', this.imageFeedback);
    this.socialPayload?.append('regenerate', 'true');

    this.isRegeneratingImage = true;
    // Don't set loading = true for regeneration (keep loader hidden)

    this.aiContentGenerationService.generateContent(this.socialPayload!).subscribe({
      next: (data) => {
        console.log('Image regenerated:', data);

        // Process the regenerated response using the same handler as content
        if (data?.result?.generation) {
          this.processChatResponse(data.result.generation);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image regenerated successfully',
          life: 3000,
          styleClass: 'custom-toast-success'
        });

        // Clear feedback input
        this.imageFeedback = '';

        // Reinitialize payload for next regeneration
        this.initializeSocialPayload();
      },
      error: (error) => {
        console.error('Error regenerating image:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to regenerate image. Please try again.',
          life: 3000
        });
        this.isRegeneratingImage = false;
        // Don't set loading = false (it wasn't set to true)
      },
      complete: () => {
        this.isRegeneratingImage = false;
        // Don't set loading = false (it wasn't set to true)
      }
    });
  }

  // Workflow visualization methods
  getWorkflowAgents(): Array<{ name: string; status: string; updatedAt: string }> {
    const socketData = this.socketConnection.dataSignal();

    // Define all agents in the correct order
    const agentOrder = [
      'Extraction Agent',
      'prompt generation agent',
      'content generation agent',
      'reviewer agent'
    ];

    // Map agents with their current status from socket data or default to 'PENDING'
    return agentOrder.map(agentName => {
      const agentData = socketData[agentName];
      return {
        name: agentName,
        status: agentData?.status || 'PENDING',
        updatedAt: agentData?.updatedAt || '--:--:--'
      };
    });
  }

  getLineColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#22c55e'; // Green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#eab308'; // Yellow
      case 'FAILED':
        return '#ef4444'; // Red
      case 'PENDING':
      default:
        return '#6b7280'; // Gray
    }
  }

  getMarkerUrl(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'url(#arrowGreen)';
      case 'IN_PROGRESS':
      case 'STARTED':
        return 'url(#arrowYellow)';
      case 'PENDING':
      default:
        return 'url(#arrowGray)';
    }
  }

  getNodeColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#1e3a2e'; // Dark green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#3a2e1e'; // Dark yellow/orange
      case 'FAILED':
        return '#3a1e1e'; // Dark red
      case 'PENDING':
      default:
        return '#1e1e1e'; // Dark gray
    }
  }

  getStatusIconColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#22c55e'; // Green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#eab308'; // Yellow
      case 'FAILED':
        return '#ef4444'; // Red
      case 'PENDING':
      default:
        return '#6b7280'; // Gray
    }
  }

  getStatusTextColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return '#86efac'; // Light green
      case 'IN_PROGRESS':
      case 'STARTED':
        return '#fde047'; // Light yellow
      case 'FAILED':
        return '#fca5a5'; // Light red
      case 'PENDING':
      default:
        return '#d1d5db'; // Light gray
    }
  }

  trackByIndex(index: number): number { return index; }

  appendToContentFeedback(text: string): void {
    if (this.contentFeedback) {
      this.contentFeedback += ' ' + text;
    } else {
      this.contentFeedback = text;
    }
  }
}
