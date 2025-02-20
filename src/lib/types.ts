// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  preferences: {
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, metadata?: Record<string, any>) => Promise<void>;
}

// Search types
export interface SearchResult {
  id: string;
  type: 'patent' | 'trademark';
  title: string;
  number: string;
  date: string;
  status: string;
}

export interface ImageSearchResult extends SearchResult {
  similarityScore: number;
  imageUrl: string;
  companyName: string;
  patentDetails: {
    filingDate: string;
    expiryDate: string;
    inventors: string[];
    description: string;
    purchasePrice?: number;
    licenseOptions?: string[];
  };
}

export interface SearchFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  jurisdiction?: string;
  category?: string;
  status?: string;
  imageSearch?: boolean;
  saveSearch?: boolean;
}

// Upload types
export interface ImageUploadResponse {
  url: string;
  similarPatents: ImageSearchResult[];
}

// User Dashboard types
export interface SavedSearch {
  id: string;
  query: string;
  type: 'patent' | 'trademark';
  filters: SearchFilters;
  createdAt: string;
}

export interface UserActivity {
  id: string;
  type: 'search' | 'view' | 'purchase';
  description: string;
  timestamp: string;
}

export interface WatchlistItem {
  id: string;
  type: 'patent' | 'trademark';
  title: string;
  number: string;
  status: string;
  lastUpdated: string;
  notifications: boolean;
}