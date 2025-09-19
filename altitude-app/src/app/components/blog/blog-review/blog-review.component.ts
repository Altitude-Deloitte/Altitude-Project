import { ChangeDetectorRef, Component, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule, KeyValue } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AccordionModule } from 'primeng/accordion';
import { SocketConnectionService } from '../../../services/socket-connection.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-blog-review',
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    AccordionModule,
    RouterLink,
    ProgressSpinnerModule
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
  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService,
    // private dialog: MatDialog,
    public socketConnection: SocketConnectionService,
    private chnge: ChangeDetectorRef
  ) {
  }

  formData: any;
  ngOnInit(): void {
    this.loading = true;
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

    this.blogstructure = this.blogGuideLines();

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
      console.log('Form data received:', this.formData);
    });

    this.contentDisabled = true;

    this.aiContentGenerationService
      .getAudianceResponseData()
      .subscribe((data) => {
        this.audianceData = data?.content;
        console.log('audiance string : ', this.audianceData);
        this.chnge.detectChanges();
      });
    this.aiContentGenerationService.getBlogResponsetData().subscribe((data) => {
      this.editorContentSocialMedia = data?.result?.generation.content;
      const cleanedString = this.editorContentSocialMedia
        .replace(/^```html/, '')
        .replace(/```$/, '');
      console.log('blog response data:', cleanedString);
      this.editorContentSocialMedia = cleanedString;
      this.editorContentSocialMedia = this.editorContentSocialMedia
        .replace(/"/g, '')
        .trim();

      // const titlePattern = /(?:<p><b>SEO Title:<\/b>|<b>SEO Title:<\/b>|<b>SEO Title:)(.*?)(?=<\/b>|\n|$)/;
      // const descriptionPattern = /(?:<p><b>SEO Description:<\/b>|<b>SEO Description:<\/b>|<b>SEO Description:)(.*?)(?=<\/b>|\n|$)/;

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

      // Remove head section from original HTML
      this.blogContent = this.editorContentSocialMedia
        .replace(/<title>.*?<\/title>/s, '')
        .trim();
      //this.blogContent = this.blogContent .replace(/<p><b>SEO Title:<\/b>.*?<\/p>/, '').replace(/<p><b>SEO Description:<\/b>.*?<\/p>/, '').trim();
      this.blogContent = this.blogContent
        .replace(titlePattern, '')
        .replace(descriptionPattern, '')
        .trim();
      this.loading = false;
      //refine content
      this.existingContent = this.editorContentSocialMedia;
      this.contentDisabled = false;
      // Function to count words in a string
      const countWords = (emailContent: any) => {
        if (!emailContent) return 0;
        // Normalize spaces and split by space to get words
        return emailContent?.trim().replace(/\s+/g, ' ').split(' ').length;
      };
      // Count words in different parts of the email content
      this.totalWordCount = countWords(this.editorContentSocialMedia);

      //this.isContentLoaded= false;
      this.isEMailPromptDisabled = false;
      this.commonPromptIsLoading = false;
      this.isImageRegenrateDisabled = false;
      this.isImageRefineDisabled = false;

      console.log('Total word count:', this.totalWordCount);
      this.chnge.detectChanges();

      this.chnge.detectChanges();
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
  }
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

  // onCreateProject() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.width = '400px';
  //   this.dialog.open(SuccessDialogComponent, dialogConfig);
  // }

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
      prompt = this.constructPrompt();
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

  blogGuideLines(): string {
    switch (this.formData?.format) {
      case 'SEO-Optimised Longform':
        return `<em><b>Title (H1) – </b>Catchy and Should have keywords </em><br>

<em><b>Introduction – </b>Brief overview, keyword integration </em><br>

<em ><b>Table of contents </b></em><br>

<em ><b>Sub-Titles (H2 onwards) – </b>Should have variations of keywords (each should be in Table of Contents) </em><br>

<em ">Body  - content for each sub-title </em><br>

<em >Content Guidelines for Body </em><br>

<em > <b>•</b>Write in Short Paragraphs: Use 2-3 sentence paragraphs to improve readability, especially on mobile devices.</em><br> 

<em> <b>•</b>Use Lists and Bullet Points: Highlight key information with bullets or numbered lists. </em><br>

<em> <b>•</b>Examples and Real-Life Scenarios: Provide relevant examples or case studies for added value.</em> <br>

<em> <b>•</b>Keyword Density: Maintain natural keyword usage without stuffing; aim to include the primary keyword in each main section without overuse.</em> <br>

<em><b>Conclusion<b/></em> <br>

<em><b>Social Sharing buttons -</b> Place social sharing buttons at the beginning or end of the post, and prompt readers to share.</em><br> `;
      //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  subtitles. Body should have Title as <H1><b>, subheadings as <H2> with 2% keyword density. Output in HTML format.`;
      // return `Create a ${format} blog of exact and equal "${wordLimit}" words on topic "${topic}" in language "${lang}" with this tone  "${Type}". The purpose of blog is  "${purpose}" and  target audience is "${readers}" . All sentences closed properly. Blog should be seo optimised of these  “${keywords}”  with keyword also it should have seo title and meta description. Structure the blog first section Title should be <H1> tag and inside <b> tag and then next line <br>, Second section all sub title should be <H2> Tag and have variation of keywords and Keywords density  2% for each keyword. Third  section is body in <p> tag then next line <br> tag then last section conclusion in <p> tag . just directly show blog content only don't show addition details.`;
      // return `Create a website blog for scocial media platform "${mediaType}" based on topic "${topic}" and should be of language "${lang}" . The intended tone of the post is "${Type}". Some more details to be considered for generating post content is  "${purpose}".The target audience is "${readers}" .The content of post should not exceed "${wordLimit}" words , with all sentences closed properly. Also include socially relevant tags for the post. Also include emoticons if required. URL to be included or additional details to be quoted directly in the post are as following "${Hashtags}". do not include any note, want to directly comsume the output.`;
      case 'SEO-Optimised Listicle':
        return `<em><b>Title (H1) –</b> Catchy and Should have keywords </em><br>

<em> <b>Introduction –</b> Brief overview, keyword integration </em><br>

<em> <b>Main List Items (H2 for Each List Item and body) –</b> Sequential numbering, keyword variations - H should have variations of keywords and body should have keywords </em><br>

<em> <b>Conclusion </b> </em><br>

<em> <b>Social Sharing buttons -</b> Place social sharing buttons at the beginning or end of the post, and prompt readers to share. </em><br>

<em>Note – 1. The heading does not have to be worded exactly as above. It could change as per context/topic </em><br>

<em>2. Body should have keywords/variation of keywords </em> `;

      case 'Case Study':
        return `<em> <b>Title (H1) – </b>Catchy and should have keywords </em><br>

<em> <b>Introduction – </b>Brief overview </em><br>

<em> <b>Client/Project Background (H2 and Body) – </b>Describe client, industry, challenges – H should have variations of keywords and body should have keywords </em><br>

<em> <b>Approach and Solution (H3 and Body) – </b> Solution strategy, steps taken, tools and techniques </em> <br>

<em> <b>Implementation process (H4 and Body) –</b> Explain the execution </em><br>

<em> <b>Results and Outcome (H5 and Body) – </b>Key metrics, outcome/success </em><br>

<em> <b>Client testimonial (optional) </b></em><br>

<em> <b>Conclusion</b> </em> <br>

<em>Note – 1. The heading does not have to be worded exactly as above. It could change as per context/topic </em> <br>

<em>2. Body should have keywords/variation of keywords </em>`;
      case 'Fact Sheet':
        return `<em><b>Title (H1) –</b> Catchy and Should have keywords </em> <br>

<em> <b>Introduction – </b>Brief overview, keyword integration </em> <br>

<em> <b>Key Facts and bullet points (H2 and body) -</b> H should have variations of keywords and body should have keywords </em> <br>

<em> <b>In-Depth detail (optional) (H3 and Body) -</b> H should have variations of keywords and body should have keywords </em> <br>

<em> <b>Conclusion </b> </em> <br>

<em>Note –  

1. The heading does not have to be worded exactly as above. It could change as per context/topic</em> <br>

<em>2. Body should have keywords/variation of keywords</em> `;
      case 'Guide':
        return `<em> <b>Title (H1) –</b> Catchy and Should have keywords </em><br>

<em> <b>Introduction – </b>Brief overview, keyword integration </em><br>

<em> <b>Table of contents</b> </em> <br>

<em> <b>Sectioned Steps or Main Parts (H2 and Body) - </b>H should have variations of keywords and body should have keywords </em> <br>

<em> <b>Detailed Explanation for Each Section (H3 and Body) - </b>H should have variations of keywords and body should have keywords </em><br>

<em> <b>Additional Tips, Warnings, or Best Practices (Optional) </b> </em> <br>

<em> <b>Summary and Key Takeaways </b> </em><br>

<em> <b>Social Sharing buttons - </b>Place social sharing buttons at the beginning or end of the post, and prompt readers to share. </em><br>

 

<em>Note –  

1. The heading does not have to be worded exactly as above. It could change as per context/topic </em><br>

<em>2. Body should have keywords/variation of keywords</em> `;
      default:
        return '';
    }
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

  constructPrompt(): string {
    switch (this.formData?.format) {
      case 'SEO-Optimised Longform':
        // return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles.  Body should have Title as <H1><b> and Introduction of Brief overview, keyword integration, sub-headings only as <H2> with 2% keyword density and sub-headings should not more than one in body and don't show the introduction and conclusion title just there body need to show.  Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create an SEO-optimized, long-form blog post in ${this.formData?.format} format of exactly ${this.formData?.wordLimit} words on the topic "${this.formData?.topic}" in "${this.formData?.lang}" language, using a "${this.formData?.Type}" tone. The blog's purpose is "${this.formData?.purpose}" for a "${this.formData?.target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${this.formData?.keywords}". using the following structure:
1.  Title (H1):  Catchy title with the main keyword.
2.  Sub Title:  Engaging subtitle with relevant keywords.
3.  Table of Contents:  List H2 and H3 headings.
4.  Introduction:  Brief overview with main keyword integration.
5.  Body: 
   - Use Table of Contents H2/H3 headings points with keyword variations.
   - Write in short paragraphs for Table of Contents list points (2-3 sentences each).
   - Use bullet points or lists for key points.
   - Include examples or case studies for added value.
   - Ensure natural keyword usage without stuffing.
6.  Conclusion:  Summarize key points with a call-to-action.
7. Output the entire blog in HTML format.
8. Additionally, after the main content, include:
    - A <p> tag with "<b>SEO Title:</b> " followed by the main title.
    - A <p> tag with "<b>SEO Description:</b> " followed by a description relevant to the purpose and audience.
9.Don,t add heading like Title, Subtitle,Body, Introduction, Main Content and Conclusion. just write their body only.    `;

      case 'SEO-Optimised Listicle':
        //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b>, subheadings as <H2>   with Sequential numbering and 2% keyword density. Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create  a blog in ${this.formData?.format} format with exactly ${this.formData?.wordLimit} words on the topic "${this.formData?.topic}" in "${this.formData?.lang}" language, using a "${this.formData?.Type}" tone. The blog's purpose is "${this.formData?.purpose}" for a "${this.formData?.target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${this.formData?.keywords}".. Use the following structure:
1.  Title (H1):  Include catchy phrasing with main keywords.
2.  Subtitle:  Integrate keyword variations.
3.  Table of Contents:  Provide a structured overview.
 Introduction:  Write a brief introduction, including the main keywords naturally.
 Main Content:  Create a numbered list with H2 headings for each item. Use keyword variations in H2 headings and incorporate main keywords in the body of each item.
 Conclusion:  Summarize the blog with a strong call-to-action, using keyword variations.
4. Output the entire blog in HTML format.
5. Additionally, after the main content, include:
    - A <p> tag with "<b>SEO Title:</b> " followed by the main title.
    - A <p> tag with "<b>SEO Description:</b> " followed by a description relevant to the purpose and audience.
6. Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only.    `;

      case 'Case Study':
        // return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b> but, don't mansion "case study:", Background as <H2> Describe client, industry, challenges  with 2% keyword density. Approach and Solution as <H2> Solution strategy, steps taken, tools and techniques. Implementation process as <H2> Explain the execution Results and Outcome as <H2> Key metrics, outcome/success Client testimonial (optional) as <H2>. Conclusion as <H2>
        // Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create a blog in ${this.formData?.format} format of exactly ${this.formData?.wordLimit} words on the topic "${this.formData?.topic}" in "${this.formData?.lang}" language, using a "${this.formData?.Type}" tone. The blog's purpose is "${this.formData?.purpose}" for a "${this.formData?.target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${this.formData?.keywords}". Follow this structure:
1.  Title (H1):  Craft a catchy, keyword-rich title.
2.  Sub Title:  Include a relevant sub title with keywords.
3.  Introduction:  Write a brief overview of the topic.
4.  Client/Project Background (H2):  Describe the client, industry, and challenges faced. Use variations of the topic keywords.
5.  Approach and Solution (H3):  Outline the strategy, steps taken, and tools used.
6.  Implementation Process (H4):  Provide a detailed explanation of the execution process.
7.  Results and Outcome (H5):  Highlight key metrics and successful outcomes.
8.  Conclusion:  Summarize the case study and its impact.
 Note:  Use variations of the topic keywords naturally throughout the blog.
9. Output the entire blog in HTML format.
10. Additionally, after the main content, include:
    - A <p> tag with "<b>SEO Title:</b> " followed by the main title.
    - A <p> tag with "<b>SEO Description:</b> " followed by a description relevant to the purpose and audience.
 11.Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only.   `;

      case 'Fact Sheet':
        //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b> but, don't mansion "case study:", Key Facts and bullet points  as <H2>   with 2% keyword density. In-Depth detail (optional)  as <H2> .Conclusion as <H2> Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create a blog in ${this.formData?.format} format of exactly ${this.formData?.wordLimit} words on the topic "${this.formData?.topic}" in "${this.formData?.lang}" language, using a "${this.formData?.Type}" tone. The blog's purpose is "${this.formData?.purpose}" for a "${this.formData?.target}" audience. Ensure proper sentence closure and SEO optimization using the keywords: "${this.formData?.keywords}".. Follow this structure:  
1. Create a  catchy title (H1)  that includes the main keyword(s).
2. Write a  brief introduction  providing an overview of the topic with keyword integration.
3. Include a section of  key facts and bullet points (H2)  with variations of the main keyword(s). Use bullets and short sentences.
4. Add an  in-depth detail section (H3)  for more comprehensive information. Use keyword variations.
5. Write a  conclusion  summarizing the key points.
Ensure keyword integration throughout, use variations where applicable, and maintain an engaging and informative tone.
6. Output the entire blog in HTML format.
7. Additionally, after the main content, include:
    - A <p> tag with "<b>SEO Title:</b> " followed by the main title.
    - A <p> tag with "<b>SEO Description:</b> " followed by a description relevant to the purpose and audience.
8.Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only.    `;

      case 'Guide':
        //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b>, Sectioned Steps or Main Parts   as <H2>   with 2% keyword density. Detailed Explanation for Each Section  as <H2> .Additional Tips, Warnings, or Best Practices (Optional) as <H2>. Summary and Key Takeaways as <H2>
        //  Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create a blog in ${this.formData?.format} format of exactly ${this.formData?.wordLimit} words on the topic "${this.formData?.topic}" in "${this.formData?.lang}" language, using a "${this.formData?.Type}" tone. The blog's purpose is "${this.formData?.purpose}" for a "${this.formData?.target}" audience. Ensure proper sentence closure and SEO optimization with the specified keywords: "${this.formData?.keywords}". Follow this structure: 
- Title (H1): Create a catchy title with primary keywords.
- Subtitle: Include a relevant keyword variation.
-  Table of Contents:  Provide a clear outline.
-  Introduction:  Brief overview using main keywords.
-  Main Sections (H2 & Body):  Use H2 headings with keyword variations. Provide detailed content, integrating keywords naturally.
-  Detailed Explanations (H3 & Body):  Include H3 subheadings with keyword variations. Add in-depth content using keywords.
-  Additional Tips & Best Practices:  (Optional)
-  Summary & Key Takeaways:  Provide a concise wrap-up.
-  Hyperlink Keywords:  Link relevant keywords to landing pages or related blogs.
-  Call-to-Action (CTA):  Suggest related blogs or additional resources.
-  Social Sharing Prompt:  Add social sharing buttons at the beginning or end.
Ensure keyword integration feels natural, and content is engaging and informative.
Output the entire blog in HTML format, followed by:
 - A <p> tag containing "<b>SEO Title:</b> " with the blog's main title.
 - A <p> tag containing "<b>SEO Description:</b> " with a description relevant to the blog's purpose and target audience.
-Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only. `;

      default:
        return '';
    }
  }
}
