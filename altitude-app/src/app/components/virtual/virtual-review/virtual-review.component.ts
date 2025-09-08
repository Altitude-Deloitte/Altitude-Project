import { Component, Input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AccordionModule } from 'primeng/accordion';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-virtual-review',
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    AccordionModule,
    RouterLink,
    FormsModule,
    SliderModule,
    SkeletonModule,
  ],
  templateUrl: './virtual-review.component.html',
  styleUrl: './virtual-review.component.css',
})
export class VirtualReviewComponent {
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
  widthSlider = '1';
  heightSlider = '';
  positionSlider = '';
  constructor(
    private route: Router,
    private aiContentGenerationService: ContentGenerationService
  ) {}

  ngOnInit(): void {
    this.contentDisabled = true;

    this.aiContentGenerationService.getData().subscribe((data) => {
      this.formData = data; // Use the data received from the service
      console.log('Form data received:', this.formData);
    });

    this.aiContentGenerationService.getImage().subscribe((data) => {
      console.log('getImagegetImage', data);
      if (data) {
        this.imageUrl = data;
      }
      this.contentDisabled = false;
    });

    this.isImageRegenrateDisabled = false;
    this.contentDisabled = true;
  }
  necklaceWidthMultiplier: String | undefined;
  necklaceYOffset: String | undefined;
  necklaceLeftOffset: String | undefined;
  // Save function
  saveValues(widthMultiplier: string, yOffset: string, leftOffset: string) {
    this.isImageRegenrateDisabled = true;
    // Log and alert the saved values
    console.log('Saved Values:', {
      ulr2: this.formData?.url1,
      url2: this.formData?.url2,
      necklaceWidthMultiplier: widthMultiplier,
      necklaceYOffset: yOffset,
      necklaceLeftOffset: leftOffset,
    });
    this.necklaceWidthMultiplier = widthMultiplier;
    this.necklaceYOffset = yOffset;
    this.necklaceLeftOffset = leftOffset;

    this.aiContentGenerationService
      .saveForm(
        this.formData?.url1,
        this.formData?.url2,
        this.formData?.prompt1,
        this.necklaceWidthMultiplier,
        this.necklaceYOffset,
        this.necklaceLeftOffset,
        this.formData?.position
      )
      .subscribe(
        (response) => {
          console.log('Response banner:', response);
          this.imageUrl = response.imageUrl;
          console.log('banner image:', this.imageUrl);
          this.aiContentGenerationService.setImage(this.imageUrl);
          // Handle the response, maybe navigate to another component to display the image
          this.isImageRegenrateDisabled = false;
        },
        (error) => {
          console.error('Error:', error);
          this.isImageRegenrateDisabled = false;
        }
      );
  }
  navigateToForm(): void {
    this.route.navigateByUrl('virtual-client');
    // this.chnge.detectChanges();
  }
}
