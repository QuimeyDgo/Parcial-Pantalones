
export type Talle = 'XS' | 'S' | 'M' | 'L' | 'XL';

export type Corte =
  | 'Recto'
  | 'Slim'
  | 'Oxford'
  | 'Skinny'
  | 'Cargo'
  | 'Jogger';


export interface Pantalon {
  id: string;
  modelName: string;
  salePrice: number;
  isInStore: boolean;
  size: Talle;
  cut: Corte;
  notes?: string;
}

export interface PantalonFormulario {
  modelName: string;
  salePrice: number;
  isInStore: boolean;
  size: Talle;
  cut: Corte;
  notes: string;
}
