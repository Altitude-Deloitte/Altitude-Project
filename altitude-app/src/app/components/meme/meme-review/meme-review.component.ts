import { Component, inject } from '@angular/core';
import { ContentGenerationService } from '../../../services/content-generation.service';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-meme-review',
  imports: [
    AccordionModule,
    ButtonModule,
    SelectModule,
    HeaderComponent,
    CommonModule,
    RouterLink,
    LoaderComponent
  ],
  templateUrl: './meme-review.component.html',
  styleUrl: './meme-review.component.css',
})
export class MemeReviewComponent {
  contentService = inject(ContentGenerationService);
  selectedImage: any;
  formData: any;
  hashtags: any;
  textUrl: any;
  loading = true;
  ngOnInit(): void {
    this.selectedImage = this.contentService.getTemplateId();
    this.formData = this.contentService.getMemeFormData();
    this.hashtags = this.contentService.getHashTags();

    this.contentService
      .generateMeme(this.formData?.tone, this.selectedImage?.id, this.hashtags)
      .subscribe((response) => {
        this.textUrl = response.data;
        this.loading = false;
      });
  }
}
