import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review',
  imports: [
    HeaderComponent,
    SelectModule,
    InputTextModule,
    ButtonModule,
    AccordionModule,
    FormsModule,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent {
  typographyOptions = [
    { label: 'Inter', value: 'Inter' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Montserrat', value: 'Montserrat' },
  ];
  fontSizeOptions = [
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
  ];
  selectedTypography = 'Inter';
  selectedFontSize = '16px';

  onTypographyChange(event: any) {
    this.selectedTypography = event.value;
    this.applyChanges();
  }

  onFontSizeChange(event: any) {
    this.selectedFontSize = event.value;
    this.applyChanges();
  }

  applyChanges() {
    const body = document.body;
    body.style.fontFamily = this.selectedTypography;
    body.style.fontSize = this.selectedFontSize;
  }
}
