import { Component, OnInit, Inject } from '@angular/core';
//import * as murderData from 'src/assets/murder.guardian.json';
import * as d3 from "d3";
import { GuardiansServiceService } from '../../services/guardians-service.service';

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

  @Inject
  constructor(  private guardiansService: GuardiansServiceService,) { 
    this.dataPost = require('src/assets/murder.guardian.json');
    console.warn('aaaaaaa')
    console.debug('blup', this.guardiansService.getData());
    console.debug('gender', this.guardiansService.getGenderValues, this.guardiansService.getGenderIds('M'));
    console.debug('armed', this.guardiansService.getArmedValues(), this.guardiansService.getArmedIds("No"));
  }


  ngOnInit() {
    d3.select('div.blup').append('span').text('blup')
  }

}
