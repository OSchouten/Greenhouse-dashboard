import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Input() filters: { tags?: string[], sort_methods?: string[], radio_buttons?: { group: string, items: { name: string, icon?: string }[] }[] };
  @Output() searchEvent = new EventEmitter<{ query: string, tags?: string[], sort_method?: string, radio_button?: { group: string, item: string | null }[] }>();

  public searchQueries: { query: string, tags?: string[], sort_method?: string, radio_button?: { group: string, item: string | null }[] } =
    {query: "", tags: [], radio_button: []};

  public tags: string[] = [];
  public sort_methods: string[] = [];
  public radio_buttons: { group: string, items: { name: string, icon?: string }[] }[] = [];

  set searchQuery(query: string) {
    this.searchQueries.query = query;
    this.updateQuery();
  }

  get searchQuery(): string {
    return this.searchQueries.query;
  }

  constructor() {
  }

  ngOnInit(): void {
    if (this.filters.tags !== undefined) this.tags = this.filters.tags;
    if (this.filters.sort_methods !== undefined) {
      this.sort_methods = this.filters.sort_methods;
      if (this.sort_methods.length > 0) this.searchQueries.sort_method = this.sort_methods[0];
    }
    if (this.filters.radio_buttons !== undefined) this.radio_buttons = this.filters.radio_buttons;

    for (let radioGroup of this.radio_buttons)
      this.searchQueries.radio_button.push({group: radioGroup.group, item: null});

    this.updateQuery();
  }

  setSortingMethod(sort_method: string) {
    this.searchQueries.sort_method = sort_method;
    this.updateQuery()
  }

  addSelectedTag(tag: string) {
    this.searchQueries.tags.push(tag);
    this.updateQuery();
  }

  removeSelectedTag(tag: string) {
    for (let i = 0; i < this.searchQueries.tags.length; i++) {
      if (this.searchQueries.tags[i] === tag) {
        this.searchQueries.tags.splice(i, 1);
        this.updateQuery()
        return;
      }
    }
    console.error("Given tag was not found among selected tags.");
  }

  toggleSelectedTag(tag: string) {
    if (this.searchQueries.tags.includes(tag)) this.removeSelectedTag(tag);
    else this.addSelectedTag(tag);
    this.updateQuery()
  }

  toggleRadioButton(group: string, name: string) {
    for (let i = 0; i < this.searchQueries.radio_button.length; i++) {
      if (this.searchQueries.radio_button[i].group === group) {
        if (this.searchQueries.radio_button[i].item === name) this.searchQueries.radio_button[i].item = null;
        else this.searchQueries.radio_button[i].item = name;
        this.updateQuery();
        return;
      }
    }
    console.error("Given tag was not found among selected tags.");
  }

  getSelectedRadioGroupItem(group: string) {
    return this.searchQueries.radio_button.find(o => o.group === group)?.item;
  }

  updateQuery() {
    this.searchEvent.emit(this.searchQueries);
  }

}
