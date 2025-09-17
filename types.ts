export enum ToolTab {
  Worldview = 'Worldview',
  NPC = 'NPC-on-the-Fly',
  Monster = 'Monster Menagerie',
  Armoury = 'The Armoury',
  Canvas = 'The Canvas',
}

export interface GeneratedAsset {
  id: string;
  text?: string;
  imageUrl?: string;
  jsonData?: Record<string, any>;
}

export interface StoredCharacter {
  id: string;
  description: string;
  imageUrl: string;
}