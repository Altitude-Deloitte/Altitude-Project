import { Component, inject } from '@angular/core';
import { ContentGenerationService } from '../../../services/content-generation.service';

import { map } from 'rxjs';
import { HeaderComponent } from '../../../shared/header/header.component';
import { RouterLink, Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meme-creation',
  imports: [
    HeaderComponent,
    RouterLink,
    SelectModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './meme-creation.component.html',
  styleUrl: './meme-creation.component.css',
})
export class MemeCreationComponent {
  fb = inject(FormBuilder);
  memeForm: any;
  toneOptions = ['Funky', 'Serious', 'Casual', 'Professional'];
  contentService = inject(ContentGenerationService);
  selectedImage: any;
  selectedHashtags: any;
  images: any;
  hashtags: any;

  constructor(private route: Router) {}
  // hashtags = {

  // trends: [
  //   '#workFromHome',
  //   '#RemoteWork',
  //   '#WorkLifeBalance',
  //   '#Telecommuting',
  //   '#FreelanceLife',
  //   '#VirtualCollaboration',
  //   '#DigitalNomad',
  //   '#WorkFromAnywhere',
  //   '#HomeOffice',
  //   '#StayProductive',
  // ],
  // }

  ngOnInit(): void {
    this.memeForm = this.fb.group({
      slogan: [''],
      desc: [''],
      tone: [''],
    });
    this.contentService
      .getMemeTemplates()
      .pipe(map((allPosts) => allPosts.slice(0, 12)))
      .subscribe({
        next: (data) => (this.images = data),
        error: (err) => console.log(err),
      });
    this.contentService.getTrendingHashtags().subscribe({
      next: (hash) => (
        (this.hashtags = hash?.data?.trends), console.log(this.hashtags)
      ),
      error: (err) => console.log(err),
    });
  }
  selectTemplate(template: any) {
    this.selectedImage = template;
  }
  selectHashtags(hashtag: any) {
    this.selectedHashtags = hashtag;
  }
  onGenerateMeme() {
    if (this.selectedImage !== null) {
      this.contentService.setTemplateId(this.selectedImage);
    }
    this.contentService.setMemeFormData(this.memeForm.value);

    this.contentService.setHashTags(this.selectedHashtags);
    this.route.navigateByUrl('meme-review');
  }
}
