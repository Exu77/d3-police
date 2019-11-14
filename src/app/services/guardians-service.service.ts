import { Injectable } from '@angular/core';
import { IMurderCaseGuardian } from './models';

@Injectable({
  providedIn: 'root'
})
export class GuardiansServiceService {
  private mainData: IMurderCaseGuardian[];
  private catGenderValues: String[] = [];
  private catGenderIds: Map<String, number[]> = new Map();

  private catArmedValues: String[] = [];
  private catArmedIds: Map<String, number[]> = new Map();
  prviate 

  constructor() { 
    this.mainData = require('src/assets/murder.guardian.json');
    this.mainData.forEach(aMurder => {
      
      if (!this.catGenderIds.get(aMurder.gender)) {
        this.catGenderIds.set(aMurder.gender, []);
      }
      this.catGenderIds.get(aMurder.gender).push(aMurder.uid);

      if (!this.catArmedIds.get(aMurder.armed)) {
        this.catArmedIds.set(aMurder.armed, []);
      }
      this.catArmedIds.get(aMurder.armed).push(aMurder.uid);
    });

    this.catGenderValues = Array.from(this.catGenderIds.keys());
    this.catArmedValues = Array.from(this.catArmedIds.keys());
  }

  public getData(): IMurderCaseGuardian[] {
    return this.mainData;
  }

  public getGenderValues(): String[] {
    return this.catGenderValues;
  }

  public getGenderIds(aKey: String): number[] {
    return this.catGenderIds.get(aKey);
  }

  public getArmedValues(): String[] {
    return this.catArmedValues;
  }

  public getArmedIds(aKey: String): number[] {
    return this.catArmedIds.get(aKey);
  }
}
