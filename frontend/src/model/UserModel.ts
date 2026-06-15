export type EvaluatorFormData = {
    email: string;
    name: string;
    section: string;
    semester: string;
    faculty: string;
    subject: string;
    date: string;
}

export type FeedbackData = {
    feedback: string;
    feedback_analysis: string;
    feedback_tone: string;
    descriptive_scale: string;
    student_grade: string;
    average_rating: number;
    feedback_rating: number;
    evaluation_matching: string;
}


export type SentenceResult = {
    text: string;
    tone: string;
    score: number;
    bgColor: string;
}

export type AnalysisResult = {
    feedbackRating: number;
    descriptiveScale: string;
    feedbackTone: string;
    sentiment: string;
    averageRating: number;
    isMatching: string;
    sentences: SentenceResult[];
}

export type Props = {
    onNext: (data: FeedbackData) => void;
    onBack: () => void;
    surveyAnswers: Record<string, number>;
    initialData?: { feedback: string; student_grade: string };
    evaluatorData: EvaluatorFormData;
}


export type Question = {
    id: string;
    text: string;
}

export type QuestionProps = {
    section: string;
    title: string;
    questions: Question[];
    onNext: (answers: Record<string, number>) => void;
    onBack: () => void;
    initialAnswers?: Record<string, number>;
}

type SectionCount = {
    section: string;
    count: number;
}

type FacultyCount = {
    faculty: string;
    count: number;
}

export type DashboardData = {
    currentSemester: string;
    totalRespondents: SectionCount[];
    totalFaculties: FacultyCount[];
}

export type Faculty = {
    id: number;
    faculty: string;
    academic_rank: string;
    status: string;
    section_handle: any[];
    subject_handle: any[];

}

export type PaginationProps = {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export type Section = {
    id: number;
    sections: string;
    category: string;
}


export type EvaluationResult = {
    id: number;
    email: string;
    name: string;
    section: string;
    date: string;
    semester: string;
    faculty: string;
    subject: string;
    feedback: string;
    feedback_analysis: string;
    feedback_tone: string;
    descriptive_scale: string;
    student_grade: string;
    average_rating: number;
    feedback_rating: number;
    evaluation_matching: string;
}