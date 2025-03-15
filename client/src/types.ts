export interface ISurvivor {
  age: number;
  gender: Gender;
  id: number;
  is_infected: boolean;
  latitude: number;
  longitude: number;
  name: string;
  inventory: IInventory[];
}

export interface IInventory {
  item_id: number;
  item_name: string;
  quantity: number;
}

export interface IInventoryCreate {
  item_id: number;
  quantity: number;
}

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other',
}

export interface ISurvivorCreate {
  name: string;
  age: number;
  gender: Gender;
  latitude: number;
  longitude: number;
  inventory: IInventoryCreate[];
}

export interface IItem {
  id: number;
  name: string;
}
