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

  constructor() {
    this.allData = data.default as IMurderCaseGuardian[];

    const genderSet: Set<string> = new Set();
    const armedSet: Set<string> = new Set();
    const raceSet: Set<string> = new Set();
    this.allData.forEach(aMurder => {
      genderSet.add(aMurder.gender);
      armedSet.add(aMurder.armed);
      raceSet.add(aMurder.race);

      this.allNodes.push({
        id: String(aMurder.uid),
        name: '',
        color: this.getRaceColor(aMurder.race),
        svgId: '#murderCircle',
        type: 'murder',
        border: false
      });
      this.allLinks.push({
        source: String(aMurder.uid),
        target: this.typeRace + '.' + aMurder.race,
        value: 1,
        type: this.typeRace
      });

      this.allLinks.push({
        source: String(aMurder.uid),
        target: this.typeArmed + '.' + aMurder.armed,
        type: this.typeArmed,
        value: 1
      });

      this.allLinks.push({
        source: String(aMurder.uid),
        target: this.typeGender + '.' + aMurder.gender,
        type: this.typeGender,
        value: 1
      });
    });

    const genderValues = [...genderSet];
    const armedValues = [...armedSet];
    const raceValues = [...raceSet];

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
    console.log('raceValues', raceValues);
    raceValues.forEach(val => {
      const raceKey = this.typeRace + '.' + val;
      this.allNodes.push({
        id: raceKey,
        name: this.getRaceName(val),
        x: 100,
        y: 100,
        color: this.getRaceColor(val),
        svgId: '#raceCircle',
        type: this.typeRace
      });
    });

    genderValues.forEach(val => {
      const genderKey = this.typeGender + '.' + val;
      this.allNodes.push({
        id: genderKey,
        name: '',
        color: 'brown',
        svgId: this.getGenderSvgId(val),
        type: this.typeGender
      });
    });
  }

  public getNodes(): INode[] {
    this.filteredNodes = [...this.allNodes];
    return this.filteredNodes;
  }

  public getLinks(): ILink[] {
    this.filterdLinks = [...this.allLinks];
    return this.filterdLinks;
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
}
