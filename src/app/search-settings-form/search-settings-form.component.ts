import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchSettingsViewModel } from '../vm/search-settings.view-model';

@Component({
  selector: 'app-search-settings-form',
  templateUrl: './search-settings-form.component.html',
  styleUrls: ['./search-settings-form.component.scss']
})
export class SearchSettingsFormComponent implements OnInit {
  @Input()
  searchSettingsInput:SearchSettingsViewModel = new SearchSettingsViewModel;
  searchSettingsForm:SearchSettingsViewModel = new SearchSettingsViewModel;
  @Output()
  settingsSubmit:EventEmitter<SearchSettingsViewModel> = new EventEmitter;
  onSubmit(): void{
    this.settingsSubmit.emit(this.searchSettingsForm); // We could directly set searchSettingsInput but better to delegate implementation to parent because it is an @Input property
  }
  onCancel(): void{
    this.searchSettingsForm = Object.assign({}, this.searchSettingsInput);
    this.settingsSubmit.emit(this.searchSettingsForm)
  }
  ngOnInit(): void {
    this.searchSettingsForm = Object.assign({}, this.searchSettingsInput);
  }
}
