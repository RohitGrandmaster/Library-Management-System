export interface Library {
  id: string;
  name: string;
  location: string;
  seats: number;
  occupied: number;
  status: string;
  plan: string;
  owner: string;
  phone: string;
  joined: string;
}

export type LibraryPanelMode = 'view' | 'edit';
