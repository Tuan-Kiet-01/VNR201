export interface ChronoEvent {
  title: string;
  date: string;
  desc: string;
}

export interface Milestone {
  id: string;
  year: string;
  title: string;
  subTitle?: string;
  brief: string;
  content: string;
  details?: {
    narrative?: string;
    points?: string[];
    interactiveType?: "ballot" | "limitations4" | "breakthroughs" | "borderMap" | "limitations5" | "couponBook" | "politburo";
    chronoEvents?: ChronoEvent[];
    extraNarrative?: string;
  };
}

export interface DragItem {
  id: string;
  text: string;
  correctChest: "bao_cap" | "hach_toan";
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CollaborativeTask {
  role: "ai" | "human";
  title: string;
  details: string[];
}
