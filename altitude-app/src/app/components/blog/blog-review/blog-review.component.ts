import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule, KeyValue } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AccordionModule } from 'primeng/accordion';
import { SocketConnectionService } from '../../../services/socket-connection.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogSuccessComponent } from '../../dialog-success/dialog-success.component';

@Component({
  selector: 'app-blog-review',
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    AccordionModule,
    RouterLink,
    ProgressSpinnerModule,
  ],
  templateUrl: './blog-review.component.html',
  styleUrl: './blog-review.component.css',
})
export class BlogReviewComponent {
  dashArrayDesk: number = 314; // Total circumference of the circle (2 * PI * radius)
  dashOffsetDesk: number = 314;

  dashArrayDeskMobile: number = 314;
  dashOffsetDeskMobile: number = 314;

  editorContentSocialMedia: any;
  imageUrl: any;
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
  blogTitle: any;
  metaDescription: any;
  blogContent: any;
  loading = true;
  metaTitle: any;
  seoTitle: string = '';
  seoDescription: string = '';
  blogstructure: string | undefined;
  plagiarismCount: string | undefined;
  plagrismCheck: any;
  issLoading = false;
  error: any;
  performanceData: any;
  percent: number = 100;
  percent2: number = 100;
  mobileScore: any;
  destokpScore: any;
  perfUrl: any;
  audianceData: string | undefined;
  socketData: any;
  currentDate: any = new Date();
  currentsDate: any = this.currentDate.toISOString().split('T')[0];

  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService,
    public socketConnection: SocketConnectionService,
    private chnge: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    // Watch for chat response from AI chat
    effect(() => {
      const chatResponse = this.aiContentGenerationService.chatResponse();
      if (chatResponse?.result?.generation) {
        this.processChatResponse(chatResponse.result.generation);
      }
    });
  }

  formData: any;
  blog_title: any;
  private dataLoaded = false; // Track if data is already loaded from shared content

  ngOnInit(): void {
    this.socketConnection.dataSignal.set({});
    this.loading = true;
    this.dataLoaded = false; // Reset flag

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data;
    });

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
    });

    // Check if we already have blog content shared (when coming back from client)
    this.aiContentGenerationService.getBlogContent().subscribe((blogData) => {
      if (blogData && blogData.blogContent) {
        console.log('Using existing shared blog content:', blogData);

        // Restore from shared data
        this.imageUrl = blogData.imageUrl;
        this.blogContent = blogData.blogContent;
        this.blog_title = blogData.blog_title;
        this.blogTitle = blogData.blogTitle;
        this.metaDescription = blogData.metaDescription;
        this.seoTitle = blogData.seoTitle;
        this.seoDescription = blogData.seoDescription;
        this.totalWordCount = blogData.totalWordCount;
        this.editorContentSocialMedia = blogData.blogContent;
        this.existingContent = blogData.blogContent;

        // Set loading to false since we have data
        this.loading = false;
        this.contentDisabled = false;
        this.dataLoaded = true; // Mark data as loaded
        this.chnge.detectChanges();
      } else {
        // No existing data, initialize as null
        this.contentDisabled = true;
        this.editorContentSocialMedia = null;
        this.imageUrl = null;
        this.blog_title = null;
        this.blogContent = null;
      }
    });

    this.aiContentGenerationService
      .getAudianceResponseData()
      .subscribe((data) => {
        this.audianceData = data?.content;
        this.chnge.detectChanges();
      });
    this.aiContentGenerationService.getBlogResponsetData().subscribe((data) => {
      // Only process if data exists AND data hasn't been loaded from shared content
      if (data?.result?.generation && !this.dataLoaded) {
        setTimeout(() => {
          this.editorContentSocialMedia = data?.result?.generation.html;
          this.imageUrl = data?.result?.generation.image_url;
          this.blog_title = data?.result?.generation?.blog_title;
          const cleanedString = this.editorContentSocialMedia
            .replace(/^```html/, '')
            .replace(/```$/, '');

          this.editorContentSocialMedia = cleanedString.replace(/"/g, '').trim();

          const titlePattern =
            /(?:<p><b>SEO Title:\s*<\/b>|<b>SEO Title:\s*<\/b>)(.*?)(?=<\/b>|<\/p>|\n|$)/;
          const descriptionPattern =
            /(?:<p><b>SEO Description:\s*<\/b>|<b>SEO Description:\s*<\/b>)(.*?)(?=<\/b>|<\/p>|\n|$)/;

          const titleMatch = this.editorContentSocialMedia.match(titlePattern);
          const descriptionMatch =
            this.editorContentSocialMedia.match(descriptionPattern);

          if (titleMatch) {
            this.seoTitle = titleMatch[1].trim();
          }

          if (descriptionMatch) {
            this.seoDescription = descriptionMatch[1].trim();
          }

          this.blogContent = this.editorContentSocialMedia
            .replace(/<title>.*?<\/title>/s, '')
            .replace(titlePattern, '')
            .replace(descriptionPattern, '')
            .trim();

          this.loading = false;
          this.existingContent = this.editorContentSocialMedia;
          this.contentDisabled = false;

          const countWords = (content: string) => {
            if (!content) return 0;
            return content.trim().replace(/\s+/g, ' ').split(' ').length;
          };

          this.totalWordCount = countWords(this.editorContentSocialMedia);

          this.isEMailPromptDisabled = false;
          this.commonPromptIsLoading = false;
          this.isImageRegenrateDisabled = false;
          this.isImageRefineDisabled = false;

          console.log('Total word count:', this.totalWordCount);

          this.chnge.detectChanges(); // Trigger view update
        }, 8000);
      }
    });

    this.getPerformanceData();
  }

  // ngAfterViewInit() {
  //   const img = new Image();
  //   img.src = this.imageUrl;
  //   this.loadImage(img.src);
  // }
  keepOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0; // Or implement custom sorting logic if needed
  };
  loadImage(url: any) {
    const img = new Image();
    img.src = url;
    console.log('Image load : ', img.src);
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      if (width === height) {
        this.setImageDimensions('640px', '640px');
      } else if (height > width) {
        this.setImageDimensions('640px', '240px');
      }
    };
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
    this.route.navigateByUrl('blog-client');
    this.chnge.detectChanges();
  }

  navigateToSave(): void {
    // const dialogRef = this.dialog.open(ReviewDialogComponent, {
    //   width: '574px',
    //   height: '346px',
    // });
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
    console.log('Successfully posted to Instagram | Facebook');
  }
  aiContentGeneration(prompt: string, type: string): void {
    if (type === 'regenerate') {
      this.isEMailPromptDisabled = true;
    } else if (type === 'common_prompt') {
      this.commonPromptIsLoading = true;
      prompt = `This is my existing blog "${this.existingContent}" in that don't change whole content from my existing blog, just add the new fact / content without removing existing post blog based on user input and this is the prompt which user want to add in existing blog " ${prompt} ". just directly show blog content only don't show addition details.`;
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
        console.log('image:', data);

        this.aiContentGenerationService.setImage(data[0].url);
        this.isImageRefineDisabled = false;
        //this.loadImage(data[0].url);
      },
      error: (er) => {
        console.log('Error refine image', er);
      },
    });
  }


  async plagrismContent() {
    this.aiContentGenerationService.checkPlagiarism(this.blogContent).subscribe(
      (result) => {
        this.plagiarismCount = result;
        const regex = /<title>(.*?)<\/title>/i;
        const match = this.plagiarismCount.match(regex);

        // If a match is found, return the content inside the <title> tag, otherwise return a default message
        if (match && match[1]) {
          this.plagiarismCount = match[1].trim();
        } else {
          this.plagiarismCount = '0'; // Default if no title tag is found
        }

        this.aiContentGenerationService.setplagrism(this.plagiarismCount);
        console.log('Plagris value :', this.plagiarismCount);
      },
      (error) => {
        console.error('Error checking plagiarism', error);
      }
    );

    this.aiContentGenerationService.getplagrism().subscribe((data) => {
      this.plagrismCheck = data; // Use the data received from the service
      console.log('plagrism data received:', this.plagrismCheck);
    });

    // const dialogRef = this.dialog.open(PlagrismComponent, {
    //   width: '494px',
    //   height: '280px',
    // });
  }
  getPerformanceData() {
    this.issLoading = true;
    this.aiContentGenerationService.getPerformanceData().subscribe({
      next: (data) => {
        console.log('get performace data :', data);
        this.performanceData = data;
        this.issLoading = false;
        this.perfUrl = this.performanceData.url;
        this.destokpScore = this.performanceData.scores.desktop;
        this.mobileScore = this.performanceData.scores.mobile;
        //desk
        this.percent = this.percent - this.performanceData.scores.desktop;
        this.dashOffsetDesk = this.dashOffsetDesk - this.percent;
        //mobile
        this.percent2 = this.percent2 - this.performanceData.scores.mobile;
        this.dashOffsetDeskMobile = this.dashOffsetDeskMobile - this.percent2;

        this.perfUrl = this.performanceData.url || 'https://contentadda.in'; // Set default URL
        this.destokpScore = this.performanceData.scores?.desktop || 95; // Default desktop score
        this.mobileScore = this.performanceData.scores?.mobile || 98; // Default mobile score
      },
      error: (err) => {
        this.error = err.message;
        this.issLoading = false;
      },
    });
  }



  // Process chat response data for blog
  processChatResponse(generationData: any) {
    console.log('Processing blog chat response:', generationData);

    // Update component data based on chat response
    if (generationData.image_url) {
      this.imageUrl = generationData.image_url;
    }

    if (generationData.blog_title) {
      this.blogTitle = generationData.blog_title;
      this.blog_title = generationData.blog_title;
    }

    if (generationData.meta_description) {
      this.metaDescription = generationData.meta_description;
    }

    if (generationData.html || generationData.content) {
      let blogContent = generationData.html || generationData.content;

      if (typeof blogContent !== 'string') {
        blogContent = JSON.stringify(blogContent);
      }

      blogContent = blogContent.replace(/"/g, '').trim();
      this.editorContentSocialMedia = blogContent.replace(/\\n\\n/g, '');
      this.blogContent = this.editorContentSocialMedia; // Set blogContent for template
      this.existingContent = this.editorContentSocialMedia;

      // Calculate word count
      const countWords = (content: any) => {
        if (!content) return 0;
        return content?.trim().replace(/\s+/g, ' ').split(' ').length;
      };

      this.totalWordCount = countWords(this.editorContentSocialMedia);
    }

    // Set loading states
    this.loading = false;
    this.contentDisabled = false;
    this.isContentLoaded = true;
    this.isEMailPromptDisabled = false;
    this.commonPromptIsLoading = false;
    this.isImageRegenrateDisabled = false;
    this.isImageRefineDisabled = false;

    // Share blog content with blog-client screen
    this.aiContentGenerationService.setBlogContent({
      imageUrl: this.imageUrl,
      blogContent: this.blogContent,
      blog_title: this.blog_title,
      blogTitle: this.blogTitle,
      metaDescription: this.metaDescription,
      seoTitle: this.seoTitle,
      seoDescription: this.seoDescription,
      totalWordCount: this.totalWordCount
    });

    // Trigger change detection
    this.chnge.detectChanges();

    // Clear chat response after processing - Don't clear, just reset the flag
    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 1000);
  }
}
