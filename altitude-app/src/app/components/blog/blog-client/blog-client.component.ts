import {
  Component,
  effect,
} from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ButtonModule } from 'primeng/button';
// import { InputTextarea } from  'primeng/inputtextarea';

import { TextareaModule } from 'primeng/textarea';

import {
  FormsModule,
} from '@angular/forms';
// import { QuillModule } from 'ngx-quill';
import { Router, RouterLink } from '@angular/router';

import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@Component({
  selector: 'app-blog-client',
  imports: [
    HeaderComponent,
    ButtonModule,
    CommonModule,
    SelectModule,
    OverlayPanelModule,
    TextareaModule,
    FormsModule,
  ],
  templateUrl: './blog-client.component.html',
  styleUrl: './blog-client.component.css',
})
export class BlogClientComponent {
  editorContentSocialMedia: any;
  imageUrl: any;
  imageContainerHeight = '0px';
  imageContainerWidth = '0px';
  imageHeight = '0px';
  imageWidth = '0px';
  ispublisLoaderDisabled = false;
  errorMessage: any;
  blogContent: any;
  seoTitle: any;
  seoDescription: any;
  blogstructure: string | undefined;

  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService
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
  blogTitle: any;
  metaDescription: any;

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

    this.blogstructure = this.blogGuideLines();

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
      console.log('Form data received:', this.formData);
    });

    // Subscribe to shared blog content from review screen (if coming from chat)
    this.aiContentGenerationService.getBlogContent().subscribe((blogData) => {
      if (blogData) {
        console.log('Received shared blog content:', blogData);

        // Use shared data if available (from chat flow)
        if (blogData.imageUrl) {
          this.imageUrl = blogData.imageUrl;
        }
        if (blogData.blogContent) {
          this.blogContent = blogData.blogContent;
          this.editorContentSocialMedia = blogData.blogContent;
        }
        if (blogData.blog_title) {
          this.blog_title = blogData.blog_title;
        }
        if (blogData.blogTitle) {
          this.blogTitle = blogData.blogTitle;
        }
        if (blogData.metaDescription) {
          this.metaDescription = blogData.metaDescription;
        }
        if (blogData.seoTitle) {
          this.seoTitle = blogData.seoTitle;
        }
        if (blogData.seoDescription) {
          this.seoDescription = blogData.seoDescription;
        }
      }
    });

    this.aiContentGenerationService.getBlogResponsetData().subscribe((data) => {
      // Only process if data exists to prevent overwriting shared blog content
      if (data?.result?.generation) {
        this.editorContentSocialMedia = data?.result?.generation.html;
        this.imageUrl = data?.result?.generation.image_url;
        this.blog_title = data?.result?.generation.blog_title;

        const cleanedString = this.editorContentSocialMedia
          .replace(/^```html/, '')
          .replace(/```$/, '');
        console.log('blog response data:', cleanedString);
        this.editorContentSocialMedia = cleanedString;
        // Remove head section from original HTML
        const titlePattern =
          /(?:<p><b>SEO Title:<\/b>|<b>SEO Title:<\/b>|<b>SEO Title:)(.*?)(?=<\/b>|\n|$)/;
        const descriptionPattern =
          /(?:<p><b>SEO Description:<\/b>|<b>SEO Description:<\/b>|<b>SEO Description:)(.*?)(?=<\/b>|\n|$)/;

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
      }
    });
  }

  async publishContent() {
    this.ispublisLoaderDisabled = true;
    const timestamp = Date.now();

    const titleMatch =
      this.editorContentSocialMedia.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const title = titleMatch ? titleMatch[1] : ''; // Get the title if matched
    console.log('tilte of blog', title);

    // const body = this.editorContentSocialMedia.replace(/<h1>.*?<\/h1>/, '').trim();
    const body = this.blogContent;
    console.log('content of blog', body);

    if (this.imageUrl) {
      console.log('Blog created image url:', this.imageUrl);
      this.aiContentGenerationService
        .createPost1(title, body, this.imageUrl)
        .subscribe(
          (response) => {
            console.log('Blog Created link : ', response.link);
            this.aiContentGenerationService.setpublish(response.link);
            console.log('Blog created:', response);
          },
          (error) => {
            console.error('Error creating post:', error);
          }
        );
    } else {
      this.aiContentGenerationService.createPost2(title, body).subscribe(
        (response) => {
          console.log('Blog Created link : ', response.link);
          this.aiContentGenerationService.setpublish(response.link);
          console.log('Blog created:', response);
        },
        (error) => {
          console.error('Error creating post:', error);
        }
      );
    }
    this.navigateToForm();
    this.ispublisLoaderDisabled = false;
    console.log('successfully');
  }
  navigateToDashboard(): void {
    this.route.navigateByUrl('dashboard');
  }
  navigateToForm(): void {
    this.route.navigateByUrl('success-page');
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

  // Process chat response data
  processChatResponse(generationData: any) {
    console.log('Processing chat response in blog client:', generationData);

    // Update component data based on chat response
    if (generationData.image_url) {
      this.imageUrl = generationData.image_url;
    }

    if (generationData.blog_title) {
      this.blog_title = generationData.blog_title;
      this.blogTitle = generationData.blog_title;
    }

    if (generationData.meta_description) {
      this.metaDescription = generationData.meta_description;
    }

    if (generationData.html || generationData.content) {
      let blogHtml = generationData.html || generationData.content;
      const cleanedString = blogHtml
        .replace(/^```html/, '')
        .replace(/```$/, '');
      this.editorContentSocialMedia = cleanedString;

      // Extract SEO title and description
      const titlePattern =
        /(?:<p><b>SEO Title:<\/b>|<b>SEO Title:<\/b>|<b>SEO Title:)(.*?)(?=<\/b>|\n|$)/;
      const descriptionPattern =
        /(?:<p><b>SEO Description:<\/b>|<b>SEO Description:<\/b>|<b>SEO Description:)(.*?)(?=<\/b>|\n|$)/;

      const titleMatch = this.editorContentSocialMedia.match(titlePattern);
      const descriptionMatch =
        this.editorContentSocialMedia.match(descriptionPattern);

      if (titleMatch) {
        this.seoTitle = titleMatch[1].trim();
      }

      if (descriptionMatch) {
        this.seoDescription = descriptionMatch[1].trim();
      }

      // Set blogContent by removing title and description patterns
      this.blogContent = this.editorContentSocialMedia
        .replace(/<title>.*?<\/title>/s, '')
        .replace(titlePattern, '')
        .replace(descriptionPattern, '')
        .trim();
    }

    // Clear chat response after processing
    setTimeout(() => {
      this.aiContentGenerationService.clearChatResponse();
    }, 1000);
  }

  navigateBack(): void {
    this.aiContentGenerationService.setIsBack(true);
    this.route.navigateByUrl('/blog-review');
  }
}
