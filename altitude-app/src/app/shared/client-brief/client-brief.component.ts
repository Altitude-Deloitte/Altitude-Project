import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-client-brief',
  imports: [CommonModule, FormsModule, ButtonModule, FileUploadModule, TextareaModule],
  templateUrl: './client-brief.component.html',
  styleUrl: './client-brief.component.scss'
})
export class ClientBriefComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedFile = signal<File | null>(null);
  briefText = signal<string>('');

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onBriefTextChange(value: string): void {
    this.briefText.set(value);
  }

  submitBrief(): void {
    const file = this.selectedFile();
    const text = this.briefText();

    if (!file && !text.trim()) {
      console.warn('Please upload a file or enter a brief');
      return;
    }

    console.log('Submitting brief:', { file, text });
    // TODO: Implement API call to submit the brief
  }
}
