import { Component, Input } from '@angular/core';
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
@Component({
  selector: 'app-social-review',
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
  ],
  templateUrl: './social-review.component.html',
  styleUrl: './social-review.component.css',
})
export class SocialReviewComponent {
  editorContentSocialMedia: any;
  characterCount: number = 0;
  imageUrl: any;
  imageFBUrlSocialmedia: any;
  imageInstaUrlSocialmedia: any;
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

  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService
  ) { }

  ngOnInit(): void {
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
    });

    this.contentDisabled = true;
    this.aiContentGenerationService
      .getSocialResponsetData()
      .subscribe((data) => {
        if (data.result.generation) {
          if (data.result.generation.Facebook)
            this.editorContentSocialMedia = data.result.generation.Facebook.text;
          this.imageFBUrlSocialmedia =
            data.result.generation.Facebook.image_url;
        }
        if (data.result.generation.Instagram) {
          this.imageInstaUrlSocialmedia =
            data.result.generation.Instagram.image_url;
          this.editorContentSocialMedia1 =
            data.result.generation.Instagram.text;

        }

        this.editorContentSocialMedia = this.editorContentSocialMedia
          ?.replace(/"/g, '')
          .trim();
        this.characterCount = this.editorContentSocialMedia?.length;
        this.existingContent = this.editorContentSocialMedia;
        this.contentDisabled = false;
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
        this.loading = false;
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

  setImageDimensions(height: string, width: string) {
    this.imageContainerHeight = height;
    this.imageContainerWidth = width;
    this.imageHeight = height;
    this.imageWidth = width;
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
        .generateContent(facebookPrompt, 'social_media')
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
      this.aiContentGenerationService
        .generateContent(instaPrompt, 'social_media')
        .subscribe({
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

      this.aiContentGenerationService
        .generateContent(prompt, 'social_media')
        .subscribe({
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
}
