import { Component } from "@angular/core";
import { FormComponent } from "./form-export/components/form/form.component";
import { NgxSpinnerModule } from "ngx-spinner";
@Component({
  selector: 'app-root',
  imports: [FormComponent, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent { }
