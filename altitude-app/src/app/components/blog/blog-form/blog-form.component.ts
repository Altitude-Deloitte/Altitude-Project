import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { DatePipe } from '@angular/common';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
// import { Select } from 'primeng/select';

@Component({
  selector: 'app-blog-form',
  imports: [
    CommonModule,
    SelectModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RadioButtonModule,
  ],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.css',
})
export class BlogFormComponent {
  taskForm!: FormGroup;
  socialwebsite!: FormGroup;
  toneOptions: string[] = [
    'Formal',
    'Informal',
    'Informative',
    'Persuasive',
    'Inspirational',
    'Narrative',
    'Analytical',
    'Descriptive',
    'Reflective',
    'Objective',
    'Argumentative',
  ];

  mediaType: string[] = [
    'Instagram',
    'Facebook',
    'WhatsApp',
    'X',
    'LinkedIn',
    'Pinterest',
  ];

  contentTypes = ['blog'];
  //campaignData: any;
  imageSize = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  uploadedImages: { file: File; preview: string }[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  readonly reactiveKeywords = signal([
    'Business Enthusiasts',
    'Working Professionals',
    'College Freshers',
  ]);
  toppingList = [
    'Young Gen Z',
    'Millenial',
    'Existing Customer',
    'New Customer',
    'Prospect',
    'Lead',
    'At-risk Customer',
  ];
  purposeArray = [
    'Awareness (brand/ product)',
    'Sales enablement',
    'Lead generation',
    'Thought leadership',
    'Training guides',
  ];

  languageArrays = [
    'English(US)',
    'English(UK)',
    // "Hindi",
    // "Korean",
    // "French",
    // "Spanish"
  ];
  englishArrays = ['US', 'UK'];
  vocabularyArrays = ['Simple', 'Complex'];

  imageOption: string = '';
  imageBox: string = '';

  formats = [
    "Listicle", "Post Event", "Topical", "Guide", "Blog", "Thought Leadership", "Initiative Awareness", "Trends Blog"
  ];
  selectedTone: any;
  selectedToppings: any;
  announcer = inject(LiveAnnouncer);
  imageUrl!: null;
  audianceData: any;
  constructor(
    private fb: FormBuilder,
    // private dialog: MatDialog,
    private route: Router,
    private aiContentGenerationService: ContentGenerationService
  ) { }

  urlImage: any;
  onCreateProject(): void {
    var formValues = { ...this.socialwebsite.getRawValue() };
    const { topic } = formValues;
    const { imgDesc } = formValues;
    this.addImageFromURL();
    this.imageUrl = null;

    if (this.uploadedImages.length == 0 && !this.urlImage) {
      console.log('image option :', formValues.imageOpt);
      if (formValues.imageOpt === 'N/A') {
        this.aiContentGenerationService.setImage(null);
        console.log('image option value :', formValues.imageOpt === 'N/A');
      } else {
        var topicPropmt: string;
        if (topic) {
          if (imgDesc) {
            topicPropmt = `Create an image based on this description "${imgDesc}"`;
          } else {
            topicPropmt = `Create an image on "${topic}" and image should have white or grey back ground`;
          }
          this.aiContentGenerationService
            .imageGeneration(topicPropmt)
            .subscribe({
              next: (data) => {
                console.log('data', data);
                if (this.uploadedImages.length == 0) {
                  this.aiContentGenerationService.setImage(data[0].url);
                }
              },
              error: (er) => {
                console.log('onCreateProject', er);
              },
            });
        }
      }
    }
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '574px',
    //   height: '346px',
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    // if (result) {
    if (this.socialwebsite.valid) {
      var formValues = { ...this.socialwebsite.getRawValue() };
      console.log('Form Values:', formValues);

      this.contentTypes.forEach((contentType) => {
        const prompt = this.constructPrompt(
          formValues,
          contentType,
          this.audianceData
        );
        console.log('blog request data:', prompt);
        this.aiContentGeneration(formValues, 'Blog Generation');
      });

      if (this.uploadedIamges) {
        this.aiContentGenerationService.setImage(this.uploadedIamges);
      }
      if (this.urlImage) {
        this.aiContentGenerationService.setImage(this.urlImage);
      }
      if (formValues.imageOpt === 'N/A') {
        this.aiContentGenerationService.setImage(null);
      }

      this.aiContentGenerationService.setData(formValues);
      this.navigateToForm();
    } else {
      console.log('Form is invalid');
    }
    // } else {
    //   console.log('Form submission cancelled');
    // }
    // });
  }

  navigateToForm(): void {
    this.route.navigateByUrl('blog-review');
  }

  aiContentGeneration(prompt: string, type: string): void {
    this.aiContentGenerationService.generateContent(prompt, type).subscribe({
      next: (data) => {
        if (type == 'Blog Generation') {
          this.aiContentGenerationService.setBlogResponseData(data);
        }
        console.log(`Response from API for ${type}:`, data);
      },
      error: (error) => {
        console.error(`Error occurred for ${type}:`, error);
      },
    });
  }

  uploadedIamges: any;
  previewImage(file: File): void {
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const preview = e.target.result;
        //this.uploadedIamges = e.target.result;
        this.uploadedImages.push({ file, preview });
        this.imageBox = 'uploaded';
        this.aiContentGenerationService.setImage(preview);
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Item to preview is not a File:', file);
    }
  }

  onFloatingButtonClick(): void { }

  // constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    const currentDate = new Date();
    this.socialwebsite = this.fb.group({
      taskId: [{ value: this.generateTaskId(), disabled: true }],
      dueDate: [currentDate.toISOString().split('T')[0]],
      topic: [''],
      wordLimit: [''],
      purpose: [''],
      campaign: [''],
      readers: [''],
      Type: [''],
      url: [''],
      imageSize: [''],
      uploadedImage: [''],
      language: [''],
      lang: ['English(US)'],
      additionDetails: [''],
      keywords: [''],
      brand: [''],
      outline: [''],
      format: [''],
      target: [this.audianceData],
      imageOpt: ['N/A'],
      imgDesc: [''],
    });
    this.aiContentGenerationService.setImage(null);
    this.aiContentGenerationService.setBlogResponseData(null);
  }

  generateTaskId(): string {
    const timestamp = Date.now();
    return `BL-2204-${timestamp}`;
  }

  constructPrompt(
    formValues: any,
    contentType: string,
    audianceData: string
  ): string {
    const {
      topic,
      purpose,
      readers,
      Type,
      wordLimit,
      mediaType,
      campaign,
      lang,
      additionDetails,
      keywords,
      format,
      target,
    } = formValues;
    switch (format) {
      case 'SEO-Optimised Longform':
        // return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles.  Body should have Title as <H1><b> and Introduction of Brief overview, keyword integration, sub-headings only as <H2> with 2% keyword density and sub-headings should not more than one in body and don't show the introduction and conclusion title just there body need to show.  Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Please create an SEO-optimized, long-form blog post in "${format}" format of exactly ${wordLimit} words on the topic "${topic}" in "${lang}" language, using a "${Type}" tone. The blog's purpose is "${purpose}" for a "${audianceData}" audience.

IMPORTANT:
1. The final output must have EXACTLY ${wordLimit} words. If you are under ${wordLimit} words, keep expanding with more explanations, examples, or details until you reach the required word count. If you go over ${wordLimit} words, revise or shorten to hit exactly ${wordLimit} words.
2. Do not include fillers or repeated sentences just to increase word count. Expand meaningfully with additional information, examples, or case studies.
3. Ensure natural keyword usage without stuffing. Use these keywords: "${keywords}".

Structure:
1. Title (H1): Write a catchy title with the main keyword.
2. Sub Title (optional <h2>): Provide an engaging subtitle with relevant keywords.
3. Table of Contents: List <h2> and <h3> headings clearly.
4. Introduction: A brief overview integrating the main keyword.
5. Body:
 - Follow the Table of Contents headings.
 - Use short paragraphs (2-3 sentences) for each sub-point.
 - Use bullet points or lists for key items.
 - Include relevant examples or case studies for added value.
 - Maintain proper sentence structure.
6. Conclusion: Summarize key points and include a clear call-to-action.
7. Output the entire blog in valid HTML format.
8. After the main content, include:
 - A <p> tag with "<b>SEO Title:</b> " followed by the main title.
 - A <p> tag with "<b>SEO Description:</b> " followed by a short description relevant to the purpose and audience.
9. Do NOT include headings like "Title," "Subtitle," "Introduction," "Body," or "Conclusion" as literal text. Just provide the content. 
10. Provide no additional commentary or explanation outside of the HTML blog content.

Remember, the text must total exactly ${wordLimit} words.`;

      case 'SEO-Optimised Listicle':
        //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b>, subheadings as <H2>   with Sequential numbering and 2% keyword density. Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create  a blog in ${format} format with exactly ${wordLimit} words on the topic "${topic}" in "${lang}" language, using a "${Type}" tone.The blog's purpose is "${purpose}" for a "${audianceData}" audience.

IMPORTANT:
1. The final output must have EXACTLY ${wordLimit} words. If you are under ${wordLimit} words, keep expanding with more explanations, examples, or details until you reach the required word count. If you go over ${wordLimit} words, revise or shorten to hit exactly ${wordLimit} words.
2. Do not include fillers or repeated sentences just to increase word count. Expand meaningfully with additional information, examples, or case studies.
3. Ensure natural keyword usage without stuffing. Use these keywords: "${keywords}".

Structure:
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
6. Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only.  Remember, the text must total exactly ${wordLimit} words.  `;

      case 'Case Study':
        // return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b> but, don't mansion "case study:", Background as <H2> Describe client, industry, challenges  with 2% keyword density. Approach and Solution as <H2> Solution strategy, steps taken, tools and techniques. Implementation process as <H2> Explain the execution Results and Outcome as <H2> Key metrics, outcome/success Client testimonial (optional) as <H2>. Conclusion as <H2>
        // Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create a blog in ${format} format of exactly ${wordLimit} words on the topic "${topic}" in "${lang}" language, using a "${Type}" tone. The blog's purpose is "${purpose}" for a "${audianceData}" audience.

IMPORTANT:
1. The final output must have EXACTLY ${wordLimit} words. If you are under ${wordLimit} words, keep expanding with more explanations, examples, or details until you reach the required word count. If you go over ${wordLimit} words, revise or shorten to hit exactly ${wordLimit} words.
2. Do not include fillers or repeated sentences just to increase word count. Expand meaningfully with additional information, examples, or case studies.
3. Ensure natural keyword usage without stuffing. Use these keywords: "${keywords}".

Structure:
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
11.Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only. Remember, the text must total exactly ${wordLimit} words.  `;

      case 'Fact Sheet':
        //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b> but, don't mansion "case study:", Key Facts and bullet points  as <H2>   with 2% keyword density. In-Depth detail (optional)  as <H2> .Conclusion as <H2> Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create a blog in ${format} format of exactly ${wordLimit} words on the topic "${topic}" in "${lang}" language, using a "${Type}" tone. The blog's purpose is "${purpose}" for a "${audianceData}" audience.

IMPORTANT:
1. The final output must have EXACTLY ${wordLimit} words. If you are under ${wordLimit} words, keep expanding with more explanations, examples, or details until you reach the required word count. If you go over ${wordLimit} words, revise or shorten to hit exactly ${wordLimit} words.
2. Do not include fillers or repeated sentences just to increase word count. Expand meaningfully with additional information, examples, or case studies.
3. Ensure natural keyword usage without stuffing. Use these keywords: "${keywords}".

Structure:
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
8.Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only.  Remember, the text must total exactly ${wordLimit} words.  `;

      case 'Guide':
        //return `Create a ${format} blog of exactly ${wordLimit} words on "${topic}" in "${lang}" with a "${Type}" tone. The blog's purpose is "${purpose}" for "${target}" audience. Ensure proper sentence closure, SEO optimization with keywords "${keywords}" . And  keywords  in titles and keywords variations  in subtitles. Body should have Title as <H1><b>, Sectioned Steps or Main Parts   as <H2>   with 2% keyword density. Detailed Explanation for Each Section  as <H2> .Additional Tips, Warnings, or Best Practices (Optional) as <H2>. Summary and Key Takeaways as <H2>
        //  Output in HTML format. After that inside <p> tag "SEO Title: " in <b> and title. Then inside <p> tag "SEO Description:" in<b> then description.`;
        return `Create a blog in ${format} format of exactly ${wordLimit} words on the topic "${topic}" in "${lang}" language, using a "${Type}" tone. The blog's purpose is "${purpose}" for a "${audianceData}" audience.

IMPORTANT:
1. The final output must have EXACTLY ${wordLimit} words. If you are under ${wordLimit} words, keep expanding with more explanations, examples, or details until you reach the required word count. If you go over ${wordLimit} words, revise or shorten to hit exactly ${wordLimit} words.
2. Do not include fillers or repeated sentences just to increase word count. Expand meaningfully with additional information, examples, or case studies.
3. Ensure natural keyword usage without stuffing. Use these keywords: "${keywords}".

Structure:
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
-Don,t add heading like Title, Subtitle,Body,  Introduction, Main Content and Conclusion. just write their body only.  Remember, the text must total exactly ${wordLimit} words.`;

      default:
        return '';
    }
  }

  resetForm(): void {
    this.taskForm.reset({
      taskId: { value: '1111', disabled: true },
      dueDate: new Date().toISOString().split('T')[0], // Reset date to current date
    });
    // You may also want to manually reset other fields if needed
    this.taskForm.get('facebook')?.setValue(false);
    this.taskForm.get('instagram')?.setValue(false);
    this.taskForm.get('whatsapp')?.setValue(false);
    this.taskForm.get('x')?.setValue(false);
    this.taskForm.get('linkedin')?.setValue(false);
    this.taskForm.get('pinterest')?.setValue(false);
  }

  triggerFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);

      if (files.length) {
        files.forEach((file) => {
          if (file instanceof File) {
            this.previewImage(file);
          } else {
            console.error('Selected item is not a File:', file);
          }
        });
      } else {
        alert('No files selected.');
      }
    }
  }
  deleteImage(index: number): void {
    this.imageBox = '';
    this.uploadedIamges.splice(index, 1);
  }

  addImageFromURL(): void {
    const url = this.socialwebsite.get('url')?.value;
    if (url) {
      this.validateImageURL(url).then((isValid) => {
        if (isValid) {
          this.socialwebsite.get('imageURL')?.reset();
        } else {
          // this.errorMessage = 'Invalid image URL. Please provide a direct image link.';
        }
      });
    }
  }
  validateImageURL(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      this.urlImage = url;
      this.aiContentGenerationService.setImage(img.src);
    });
  }
  onChange(event: { value: string }) {
    this.imageOption = event.value;
    console.log('image option :', this.imageOption);
  }

  updateFormFields(selectedCampaign: string) {
    if (
      selectedCampaign === 'Awareness (brand/ product)' ||
      selectedCampaign === 'Training guides'
    ) {
      this.socialwebsite.patchValue({
        Type: ['Informative', 'Informal'],
      });
    } else if (
      selectedCampaign === 'Sales enablement' ||
      selectedCampaign === 'Thought leadership'
    ) {
      this.socialwebsite.patchValue({
        Type: ['Informal'],
      });
    } else {
      this.socialwebsite.patchValue({
        Type: [],
      });
    }
    var formValues = { ...this.socialwebsite.getRawValue() };

    var audiancePrompt = `Generate 3 audiance name based on the topic "${formValues.topic}" and brand "${formValues.brand} , Consider the purpose "${formValues.purpose}" and the blog format "${formValues.format}". Output only the 3 audiance name in a single string, separated by semicolons (","). Do not include any additional text, explanations, or formatting—just the 4 audiance name for blog in the required format.`;
    this.aiContentGenerationService
      .generateContent(formValues, 'Blog Generation')
      .subscribe({
        next: (data) => {
          console.log(`email subject prompt :`, audiancePrompt);
          // this.aiContentGenerationService.setSubjectResponseData(data);
          this.aiContentGenerationService.setAudianceResponseData(data);
          console.log(`email subject from API for :`, data);
        },
        error: (error) => {
          console.error(`Error occurred for email subject:`, error);
        },
      });

    this.aiContentGenerationService
      .getAudianceResponseData()
      .subscribe((data) => {
        this.audianceData = data?.content;
        this.socialwebsite.patchValue({
          target: this.audianceData,
        });
        console.log('audiance string 0 : ', this.audianceData);
      });
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files);
      if (files.length) {
        files.forEach((file) => {
          if (file instanceof File) {
            this.previewImage(file);
          } else {
            console.error('Dropped item not a file');
          }
        });
      } else {
        alert('No files dropped');
      }
    }
  }
}
