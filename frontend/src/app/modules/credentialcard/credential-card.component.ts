import {Component, Input} from '@angular/core';
import {Credential} from "../../core/models/saved-credential.model";

@Component({
  selector: 'app-credential-card',
  templateUrl: './credential-card.component.html',
  styleUrls: ['./credential-card.component.scss']
})
export class CredentialCardComponent {
  @Input() data?: Credential;

  constructor() { }

  ngOnInit(): void {
  }
}
