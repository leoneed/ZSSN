export interface ISurvivor {
  age: number;
  gender: string;
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
