import { Component, OnInit } from '@angular/core';
//import * as murderData from 'src/assets/murder.guardian.json';

@Component({
  selector: 'app-murder',
  templateUrl: './murder.component.html',
  styleUrls: ['./murder.component.scss']
})
export class MurderComponent implements OnInit {
  public dataPost: any;
  public dataGuard: any;
  
  // https://www.theguardian.com/us-news/ng-interactive/2015/jun/01/the-counted-police-killings-us-database
  // https://data.census.gov/cedsci/table?q=race&hidePreview=false&table=C02003&tid=ACSDT1Y2018.C02003&lastDisplayedRow=18
  // https://github.com/washingtonpost/data-police-shootings
  constructor() { 
    //this.dataPost = require('src/assets/murder.guardian.json');
    console.warn('aaaaaaa')
    console.debug('blup', this.dataPost);
  }

  ngOnInit() {
    d3.select('#murderComp').append('span').text('blup')
  }

}
