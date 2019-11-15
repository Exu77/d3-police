import { Injectable } from '@angular/core';
import * as data from 'src/assets/murder.guardian.json';
import { IMurderCaseGuardian, ILink, INode } from './models';
import { race } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardiansFilterService {
  private allData: IMurderCaseGuardian[] = [];
  private allNodes: INode[] = [];
  private filteredNodes: INode[] = [];
  private allLinks: ILink[] = [];
  private filterdLinks: ILink[] = [];

  public readonly typeRace = 'race';
  public readonly typeArmed = 'armed';
  public readonly typeGender = 'gender';
  public readonly typeClassif = 'classif';
  public readonly typeAge = 'age';

  constructor() {
    this.allData = data.default as IMurderCaseGuardian[];
  }

  public load() {
    this.getData(this.allData);
  }

  public getNodes(): INode[] {
    this.filteredNodes = [...this.allNodes];
    return this.filteredNodes;
  }

  public getLinks(): ILink[] {
    this.filterdLinks = [...this.allLinks];
    return this.filterdLinks;
  }

  public loadRaceNormalized() {
    const us = this.getUsRacePerc();
    const actual = this.getThisRacePerc();
    let allCount = 0;

    const factors: Map<string, number> = new Map();
    const murderMap: Map<string, IMurderCaseGuardian[]> = new Map();
    for (const aKey of us.keys()) {
      const aVal = actual.get(aKey);
      const uVal = us.get(aKey);
      const factor = (50 / uVal);
      const newPerc = actual.get(aKey) + (actual.get(aKey) * factor)
      console.log(aKey, us.get(aKey), actual.get(aKey), aVal * factor, uVal * factor);
      factors.set(aKey, aVal * factor / 100);
    }

    const resultData: IMurderCaseGuardian[] = [];
    const noMurders = 500;
    const uid = 0;
    for (const aKey of factors.keys()) {
      
      const cnt = noMurders * factors.get(aKey);
      for (let i = 0; i < cnt; i++) {
        uid += 1;
        resultData.push({
          race: aKey,
          uid: 'murderClone.' + uid,
          armed: 'NO',
        });
      }
    }
    console.log('consData', resultData)
    this.getData(resultData);
  }

  private getData(posList: IMurderCaseGuardian[]) {
    this.allNodes = [];
    this.allLinks = [];
    const genderSet: Set<string> = new Set();
    const armedSet: Set<string> = new Set();
    const raceSet: Set<string> = new Set();
    const ageSet: Set<string> = new Set();
    const classifSet: Set<string> = new Set();
    let idx = 0;
    posList.forEach((aMurder: IMurderCaseGuardian) => {
      this.allNodes.push({
        id: String(aMurder.uid),
        name: '',
        color: this.getRaceColor(aMurder.race),
        svgId: '#murderCircle',
        type: 'murder'
      });
      
      if (aMurder.race) {
        raceSet.add(aMurder.race);
        this.allLinks.push({
          source: String(aMurder.uid),
          target: this.typeRace + '.' + aMurder.race,
          value: 1,
          type: this.typeRace
        });
      }

      if (aMurder.armed) {
        armedSet.add(aMurder.armed);
        this.allLinks.push({
          source: String(aMurder.uid),
          target: this.typeArmed + '.' + aMurder.armed,
          type: this.typeArmed,
          value: 1
        });
      }

      if (aMurder.gender) {
        genderSet.add(aMurder.gender);
        this.allLinks.push({
          source: String(aMurder.uid),
          target: this.typeGender + '.' + aMurder.gender,
          type: this.typeGender,
          value: 1
        });
      }

      if (aMurder.classification) {
        classifSet.add(aMurder.classification);
        this.allLinks.push({
          source: String(aMurder.uid),
          target: this.typeClassif + '.' + aMurder.classification,
          type: this.typeClassif,
          value: 1
        });
      }

      if (aMurder.age) {
        ageSet.add(this.getAgeGroup(aMurder.age));
        this.allLinks.push({
          source: String(aMurder.uid),
          target: this.typeAge + '.' + this.getAgeGroup(aMurder.age),
          type: this.typeAge,
          value: 1
        });
      }
    });

    const genderValues = [...genderSet];
    const armedValues = [...armedSet];
    const raceValues = [...raceSet];
    const classifValues = [...classifSet];
    const ageValues = [...ageSet];

    armedValues.forEach(val => {
      const armedKey = this.typeArmed + '.' + val;
      this.allNodes.push({
        id: armedKey,
        name: '',
        x: 900,
        y: 900,
        color: 'magenta',
        svgId: this.getArmedSvgId(val),
        type: this.typeArmed
      });
    });

    raceValues.forEach(val => {
      const raceKey = this.typeRace + '.' + val;
      this.allNodes.push({
        id: raceKey,
        name: this.getRaceName(val),
        x: 100,
        y: 100,
        color: 'orange',
        svgId: '#raceCircle',
        type: this.typeRace
      });
    });

    genderValues.forEach(val => {
      const genderKey = this.typeGender + '.' + val;
      this.allNodes.push({
        id: genderKey,
        name: '',
        color: 'blue',
        svgId: this.getGenderSvgId(val),
        type: this.typeGender
      });
    });

    classifValues.forEach(val => {
      const key = this.typeClassif + '.' + val;
      this.allNodes.push({
        id: key,
        name: val,
        color: 'green',
        svgId: '#raceCircle',
        type: this.typeClassif
      });
    });

    ageValues.forEach(val => {
      const key = this.typeAge + '.' + val;
      this.allNodes.push({
        id: key,
        name: val,
        color: 'cyan',
        svgId: '#raceCircle',
        type: this.typeAge
      });
    });
  }

  private getRaceColor(race: string): string {
    let color = 'pink';
    if (race === 'B') {
      color = 'black';
    } else if (race === 'A') {
      color = 'yellow';
    } else if (race === 'W') {
      color = 'pink';
    } else if (race === 'H') {
      color = 'brown';
    } else if (race === 'N') {
      color = 'red';
    } else if (race === 'O') {
      color = 'gray';
    } else if (race === 'U') {
      color = 'orange';
    } else {
      color = 'magenta';
    }

    return color;
  }

  private getGenderSvgId(gender: string): string {
    if (gender === 'F') {
      return '#female';
    }
    if (gender === 'M') {
      return '#male';
    }
    if (gender === 'N') {
      return '#questionMark';
    }
  }

  private getArmedSvgId(armed): string {
    if (armed === 'Knife') {
      return '#knife';
    }
    if (armed === 'Non-lethal firearm') {
      return '#waterpistol';
    }
    if (armed === 'Firearm') {
      return '#pistol';
    }
    if (armed === 'Vehicle') {
      return '#vehicle';
    }
    if (armed === 'No') {
      return '#fist';
    }
    if (armed === 'Disputed') {
      return '#hammer';
    }
    if (armed === 'Other') {
      return '#magicWand';
    }
    if (armed === 'Unknown') {
      return '#questionMark';
    }

    return '';
  }
  private getRaceName(race: string): string {
    if (race === 'B') {
      return 'BLACK';
    }
    if (race === 'W') {
      return 'WHITE';
    }
    if (race === 'H') {
      return 'HISPANIC';
    }
    if (race === 'A') {
      return 'ASIAN';
    }
    if (race === 'U') {
      return 'UNKNOWN';
    }
    if (race === 'N') {
      return 'NATIVE';
    }
    if (race === 'O') {
      return 'OTHER';
    }
    return race;
  }

  private getThisRacePerc() {
    let total = 0;
    const raceMap: Map<string, number> = new Map();
    this.allData.forEach(aMurder => {
      total += 1;
      if (!raceMap.has(aMurder.race)) {
        raceMap.set(aMurder.race, 0);
      }
      raceMap.set(aMurder.race, (raceMap.get(aMurder.race) + 1));
    });

    const result: Map<string, number> = new Map();
    for (const aKey of raceMap.keys()) {
      result.set(aKey, raceMap.get(aKey) / (total / 100));
    }

    return result;
  }

  private getUsRacePerc() {
    const result: Map<string, number> = new Map();
    result.set('W', 60.4);
    result.set('B', 13.4);
    result.set('N', 1.3);
    result.set('A', 5.9);
    result.set('O', 0.7);
    result.set('H', 18.3);
    return result;
/*
PEOPLE
Race and Hispanic Origin	
White alone, percent	76.5%
Black or African American alone, percent(a)	13.4%
American Indian and Alaska Native alone, percent(a)	1.3%
Asian alone, percent(a)	5.9%
Native Hawaiian and Other Pacific Islander alone, percent(a)	0.2%
Two or More Races, percent	2.7%
Hispanic or Latino, percent(b)	18.3%
White alone, not Hispanic or Latino, percent	60.4%
*/
  }

public getAgeGroup(age: number): string {
    if (age < 16) {
      return '<16';
    }  else if (age < 25) {
      return '<26';
    } else if (age < 35) {
      return '<36';
    } else if (age < 45) {
      return '<46';
    }

    return '>45';
  }
}
