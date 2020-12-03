import {Component, Input} from '@angular/core';
import {Group}            from '../models/group.model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})

export class SummaryComponent {
  @Input() expenseGroups: Group[];
}
