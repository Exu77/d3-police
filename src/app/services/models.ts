export interface IMurderCaseGuardian {
    age: number;
    armed: string;
    city: string;
    classification: string;
    date: string;
    gender: string;
    hasimage: boolean;
    large: boolean;
    lat: number;
    long: number;
    name: string;
    race: string;
    slug: string;
    state: string;
    uid: number;
    id: string;
}

export interface IMurderGraph {
    x: number;
    y: number;
}

export interface ILink {
    source: string;
    target: string;
    value: number;
    type?: string;
  }

export interface INode {
    id: string;
    name: string;   
    color: string;
    type: string;
    x?: number;
    y?: number;
}