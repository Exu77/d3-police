import { Injectable, ɵConsole } from '@angular/core';
import { IMurderCaseGuardian, INode, ILink } from './models';
import * as data from 'src/assets/murder.guardian.json';

@Injectable({
  providedIn: 'root'
})
export class GuardiansStructService {
  private allData: IMurderCaseGuardian[] = [];
  private mainData: IMurderCaseGuardian[] = [];
  private mainNodes: INode[];

  private genderNodes: INode[];
  private genderValues: string[] = [];
  private genderLinks: ILink[];
  private armedNodes: INode[];
  private armedValues: string[] = [];
  private armedLinks: ILink[];
  private raceNodes: INode[] = [];
  private raceValues: string[] = [];
  private raceLinks: ILink[];
  private mainCatNodes: INode[];
  private mainCatLinks: ILink[];

  constructor() {
    this.allData = data.default as IMurderCaseGuardian[];
    this.mainData = [];
    this.raceLinks = [];
    this.raceNodes = [];
    this.armedLinks = [];
    this.armedNodes = [];
    this.genderLinks = [];
    this.genderNodes = [];
    this.mainNodes = [];
    this.mainCatNodes = [
      {
        id: 'gender',
        name: 'gender',
        color: null,
        type: 'invisible'
      },
      {
        id: 'race',
        name: 'race',
        color: null,
        type: 'invisible'
      },
      {
        id: 'armed',
        name: 'armed',
        color: null,
        type: 'invisible'
      }
    ];
    this.mainCatLinks = [];
    let idx = 0;
    const genderSet: Set<string> = new Set();
    const armedSet: Set<string> = new Set();
    const raceSet: Set<string> = new Set();

    this.allData.forEach(aMurder => {
      idx += 1;
      // if (idx > 100) return;
      aMurder.id = String(aMurder.uid);

      genderSet.add(aMurder.gender);
      armedSet.add(aMurder.armed);
      raceSet.add(aMurder.race);

      this.mainData.push(aMurder);

      this.mainNodes.push({
        id: String(aMurder.uid),
        name: aMurder.name,
        color: this.getRaceColor(aMurder.race),
        type: 'murder'
      });

      this.raceLinks.push({
        source: aMurder.id,
        target: 'race.' + aMurder.race,
        value: 1
      });

      this.armedLinks.push({
        source: aMurder.id,
        target: 'armed.' + aMurder.armed,
        value: 1
      });

      this.genderLinks.push({
        source: aMurder.id,
        target: 'gender.' + aMurder.gender,
        value: 1
      });
    });

    this.genderValues = [...genderSet];
    this.armedValues = [...armedSet];
    this.raceValues = [...raceSet];

    this.armedValues.forEach(val => {
      const armedKey = 'armed.' + val;
      this.armedNodes.push({
        id: armedKey,
        name: val,
        color: 'magenta',
        type: 'armed'
      });
      this.mainCatLinks.push({
        source: armedKey,
        target: 'armed',
        value: 1
      });
    });

    console.log('race', this.raceValues);
    this.raceValues.forEach(val => {
      const raceKey = 'race.' + val;
      this.raceNodes.push({
        id: raceKey,
        name: val,
        color: 'cyan',
        type: 'race'
      });
      this.mainCatLinks.push({
        source: raceKey,
        target: 'race',
        value: 1
      });
    });

    this.genderValues.forEach(val => {
      const genderKey = 'gender.' + val;
      this.genderNodes.push({
        id: genderKey,
        name: val,
        color: 'brown',
        type: 'gender'
      });
      /*
      this.mainCatLinks.push({
          source: genderKey,
          target: 'gender',
          value: 5,
        });
        */
    });
  }

  public getMurderNodes(): INode[] {
    return this.mainNodes;
  }

  public getArmedNodes(): INode[] {
    return this.armedNodes;
  }

  public getRaceNodes(): INode[] {
    return this.raceNodes;
  }

  public getArmedLinks(): ILink[] {
    return this.armedLinks;
  }

  public getRaceLinks(): ILink[] {
    return this.raceLinks;
  }

  public getMainCatNodes(): INode[] {
    return this.mainCatNodes;
  }

  public getMainCatLinks(): ILink[] {
    return this.mainCatLinks;
  }

  public getRaceColor(race: string): string {
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
    } else {
      color = 'magenta';
    }

    return color;
  }
}
