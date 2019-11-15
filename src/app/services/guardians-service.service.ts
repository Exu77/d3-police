import { Injectable } from '@angular/core';
import { IMurderCaseGuardian, ILink, INode } from './models';

@Injectable({
  providedIn: 'root'
})
export class GuardiansServiceService {
  private mainData: IMurderCaseGuardian[];
  private catGenderValues: string[] = [];
  private catArmedValues: string[] = [];
  private catRaceValues: string[] = [];
  private allLinks: ILink[] = [];


  private allNodes: INode[] = [];

  constructor() {
    const allData: IMurderCaseGuardian[] = require('src/assets/murder.guardian.json');
    this.mainData = [];
    this.allNodes = [];
    let idx = 0;
    const genderSet: Set<string> = new Set();
    const armedSet: Set<string> = new Set();
    const raceSet: Set<string> = new Set();
    allData.forEach(aMurder => {
      idx += 1;
      if (idx > 200) return; 
      aMurder.id = String(aMurder.uid);

      genderSet.add(aMurder.gender);
      armedSet.add(aMurder.armed);
      raceSet.add(aMurder.race);

      this.mainData.push(aMurder);

      this.allNodes.push({
        id: String(aMurder.uid), 
        name: aMurder.name,
        color: this.getRaceColor(aMurder.race),
        type: 'murder'});

      this.allLinks.push(
        {
          source: aMurder.id,
          target: 'race.' + aMurder.race,
          value: 5,
        }
      );

      this.allLinks.push(
        {
          source: aMurder.id,
          target: 'armed.' + aMurder.armed,
          value: 5,
        }
      );

      this.allLinks.push(
        {
          source: aMurder.id,
          target: 'gender.' + aMurder.gender,
          value: 5,
        }
      );
    });

    this.catGenderValues = [...genderSet];
    this.catArmedValues = [...armedSet];
    this.catRaceValues = [...raceSet];

    this.catArmedValues.forEach((val) => {
      this.allNodes.push({
        id: 'armed.' + val,
        name: val,
        color: 'white',
        x: 100,
        y: 100,
        type: 'armed'});
    });

    this.catRaceValues.forEach((val) => {
      this.allNodes.push({
        id: 'race.' + val,
        name: val,
        x: 900,
        y: 500,
        color: 'cyan',
        type: 'race'});
    });

    this.catGenderValues.forEach((val) => {
      this.allNodes.push({
        id: 'gender.' + val,
        name: val,
        color: 'brown',
        x: 500,
        y: 900,
        type: 'gender'});
    });
  }

  public getLinks(): ILink[]{
    return this.allLinks;
  }

  public getData(): IMurderCaseGuardian[] {
    return this.mainData;
  }

  public getAllNodes(): INode[] {
    return this.allNodes;
  }

  public getRaceColor(race: string): string {
    let color = 'pink';
    if (race === 'B') {
      color = 'black';
    } else if (race === 'A') {
      color = 'yellow';
    } else if (race === 'W') {
      color = 'pink';
    } else {
      color = 'blue';
    }

    return color;
  }
}
