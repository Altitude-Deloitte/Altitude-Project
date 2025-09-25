import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  standalone: true,
  selector: 'app-dialog-success',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog-success.component.html',
  styleUrl: './dialog-success.component.css'
})
export class DialogSuccessComponent {

}
