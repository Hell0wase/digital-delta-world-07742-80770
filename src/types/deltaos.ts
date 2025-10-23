export interface User {
  name: string;
  password: string;
  timezone: string;
  theme: {
    primary: string;
    secondary: string;
  };
  settings: {
    fontSize: number;
    fontFamily: string;
    zoom: number;
    roundedCorners: boolean;
    backgroundImage?: string;
    backgroundColor: string;
    pinEnabled: boolean;
    pin?: string;
    pinLength: 4 | 6;
    themeMode: 'dark' | 'light';
    taskbarColor: string;
  };
}

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  component: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  component: string;
}

export interface CustomGame {
  id: string;
  name: string;
  htmlCode: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
}

export interface OSData {
  user: User;
  customGames: CustomGame[];
  chatHistory: ChatMessage[];
  files: any[];
}
