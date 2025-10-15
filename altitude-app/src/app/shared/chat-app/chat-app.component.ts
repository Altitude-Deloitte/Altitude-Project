import { Component, viewChild, ElementRef, inject, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from "primeng/inputtext";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { Router } from '@angular/router';
import { ContentGenerationService } from '../../services/content-generation.service';
import { ChatStore, ChatMessage } from '../../store/chat.store';

@Component({
  selector: 'app-chat-app',
  imports: [ButtonModule, InputTextModule, CommonModule, FormsModule, MenuModule, FileUploadModule],
  templateUrl: './chat-app.component.html',
  styleUrl: './chat-app.component.css'
})
export class ChatAppComponent implements OnDestroy {
  chatInput: string = '';
  menuItems: MenuItem[] = [];
  fileInput = viewChild<ElementRef>('fileInput');

  // Inject services
  private contentService = inject(ContentGenerationService);
  private router = inject(Router);
  protected chatStore = inject(ChatStore);

  // Get messages and data from store
  messages = this.chatStore.messages;
  isLoading = this.chatStore.isLoading;
  collectedData = this.chatStore.collectedData;
  missingFields = this.chatStore.missingFields;

  constructor() {
    this.menuItems = [
      {
        label: 'Upload File',
        icon: 'pi pi-upload',
        command: () => this.triggerFileUpload()
      },
    ];
  }

  sendMessage() {
    if (this.chatInput.trim()) {
      const userMessage = this.chatInput.trim();

      // Set user message in store and clear file content (only one at a time)
      this.chatStore.setUserMessage(userMessage);
      this.chatStore.setFileContent(null);

      // Add user message to chat
      this.chatStore.addMessage({
        text: userMessage,
        timestamp: new Date(),
        isUser: true
      });

      // Clear input
      this.chatInput = '';

      // Call API
      this.generateChatResponse();

      // Scroll to bottom after sending
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  private generateChatResponse() {
    // Get user message or file content (not combined)
    const userMessage = this.chatStore.currentUserMessage();
    const fileContent = this.chatStore.currentFileContent();

    // Use whichever is available (priority to user message)
    const messageToSend = userMessage || fileContent;

    if (!messageToSend) return;

    // Get current missing fields from last response
    const lastResponse = this.chatStore.lastResponse();
    const missingFields = lastResponse?.missing_fields || [];

    // Extract field values from message if there are missing fields
    if (missingFields.length > 0) {
      this.chatStore.extractAndUpdateFields(messageToSend, missingFields);
    }

    // Add loading message
    this.chatStore.addMessage({
      text: 'Analyzing...',
      timestamp: new Date(),
      isUser: false,
      isLoading: true
    });

    this.chatStore.setLoading(true);

    // Get collected data from store
    const collectedData = this.chatStore.collectedData();

    // Prepare API payload with collected data
    const payload = {
      collected: collectedData,
      message: messageToSend
    };

    console.log('Sending payload:', payload);

    // Call API
    this.contentService.generateChatContent(payload).subscribe({
      next: (response) => {
        this.handleChatResponse(response);
      },
      error: (error) => {
        this.handleChatError(error);
      }
    });
  }

  private handleChatResponse(response: any) {
    this.chatStore.setLoading(false);
    this.chatStore.setLastResponse(response);

    console.log('API Response:', response);

    // Check if status is incomplete (missing fields)
    if (response.status === 'incomplete' && response.missing_fields && response.missing_fields.length > 0) {
      // Update the loading message with the question from API
      this.chatStore.updateLastMessage(response.message, false);

      // Store the collected data from response
      if (response.collected) {
        this.chatStore.setCollectedData(response.collected);
        // Also set the collected data in content generation service

      }

      console.log('Missing fields:', response.missing_fields);
      console.log('Current collected data:', this.chatStore.collectedData());
    }
    // Check if content is generated successfully
    else if (response.result?.generation) {
      this.contentService.setData(response.collected);
      // Set chat response in ContentGenerationService for review screens
      this.contentService.setChatResponse(response);

      this.chatStore.updateLastMessage('Content generated successfully!', false);

      // Navigate to review screen based on campaign type or use_case
      setTimeout(() => {
        const campaignType = response.use_case || response.result?.generation?.use_case || response.campaign_type;
        this.navigateToReviewScreen(campaignType);
      }, 1000);

      // Reset collected data after successful generation
      setTimeout(() => {
        this.chatStore.resetCollectedData();
      }, 1500);
    }
    // Handle generic message responses
    else if (response.message) {
      this.chatStore.updateLastMessage(response.message, false);
    }

    // Clear temporary data (but keep collected data for next iteration)
    this.chatStore.setUserMessage(null);
    this.chatStore.setFileContent(null);

    setTimeout(() => this.scrollToBottom(), 100);
  }

  private handleChatError(error: any) {
    this.chatStore.setLoading(false);

    // Update loading message with error
    this.chatStore.updateLastMessage(
      'Sorry, I encountered an error while processing your request. Please try again.',
      false
    );

    console.error('Chat API Error:', error);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  private navigateToReviewScreen(campaignType: string) {
    if (!campaignType) return;

    const routeMap: { [key: string]: string } = {
      'email campaign': '/email-review',
      'email': '/email-review',
      'blog campaign': '/blog-review',
      'blog': '/blog-review',
      'social media campaign': '/social-review',
      'social media': '/social-review',
      'social': '/social-review',
      'image campaign': '/image-review',
      'image': '/image-review',
      'video campaign': '/video-review',
      'video': '/video-review',
      'meme campaign': '/meme-review',
      'meme': '/meme-review'
    };

    const route = routeMap[campaignType.toLowerCase()];

    if (route) {
      this.router.navigate([route]);
    } else {
      // Default to email review if no specific route found
      this.router.navigate(['/email-review']);
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  triggerFileUpload() {
    const fileInput = this.fileInput()?.nativeElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Check if file is a text file
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        this.readTextFile(file);
      } else {
        // Handle other file types or show error
        this.chatStore.addMessage({
          text: `File "${file.name}" uploaded. Only .txt files can be read automatically.`,
          timestamp: new Date(),
          isUser: true
        });
        setTimeout(() => this.scrollToBottom(), 100);
      }

      // Reset the input
      input.value = '';
    }
  }

  private readTextFile(file: File) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        // Store file content in the store and clear user message (only one at a time)
        this.chatStore.setFileContent(content);
        this.chatStore.setUserMessage(null);

        // Add the file content as a message
        this.chatStore.addMessage({
          text: `📄 Content from "${file.name}":\n\n${content}`,
          timestamp: new Date(),
          isUser: true
        });

        // Automatically send the file content to API
        this.generateChatResponse();

        setTimeout(() => this.scrollToBottom(), 100);
      }
    };

    reader.onerror = () => {
      this.chatStore.addMessage({
        text: `Error reading file "${file.name}". Please try again.`,
        timestamp: new Date(),
        isUser: false
      });
      setTimeout(() => this.scrollToBottom(), 100);
    };

    reader.readAsText(file);
  }

  private scrollToBottom() {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }
  ngOnDestroy() {
    // Clear chat store on component destroy
    this.chatStore.clearChat();
  }
}
