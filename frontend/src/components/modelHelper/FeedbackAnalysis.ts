import vectorizerData from "../../model/vectorizer.json";
import lrModelData from "../../model/lr_model.json";

export function loadModelAndVectorizer() {
    return {
        vectorizerData,
        modelData: lrModelData
    };
}

export function preprocessText(text: string): string {
    text = text.toLowerCase();
    text = text.replace(/[\.,\/#!$%\^&\*;:{}=\-_~()]/g, "");
    text = text.replace(/\d+/g, "");
    text = text.trim().split(/\s+/).join(" ");
    return text;
}

export function tfidfVectorize(text: string, vectorizerData: { vocabulary: Record<string, number>; idf: number[] }): number[] {
    const { vocabulary, idf } = vectorizerData;
    const tf: Record<string, number> = {};
    const words = text.split(' ');

    words.forEach(word => {
        if (vocabulary[word] !== undefined) {
            tf[word] = (tf[word] || 0) + 1;
        }
    });

    const tfidf = new Array(Object.keys(vocabulary).length).fill(0);

    for (const word in tf) {
        if (vocabulary[word] !== undefined) {
            const tfValue = tf[word] / words.length;
            const idfValue = idf[vocabulary[word]];
            tfidf[vocabulary[word]] = tfValue * idfValue;
        }
    }

    return tfidf;
}

export function predictSentiment(tfidfVec: number[], modelData: { coef: number[]; intercept: number }): number {
    const { coef, intercept } = modelData;
    return tfidfVec.reduce((sum, val, index) => sum + val * coef[index], intercept);
}

export function mapScoreToScale(score: number): number {
    if (score >= 4.5) return 5;
    else if (score >= 3.5) return 4;
    else if (score >= 2.5) return 3;
    else if (score >= 1.5) return 2;
    else return 1;
}

export function mapToDescriptiveTerm(score: number): string {
    const descriptiveTerms: Record<number, string> = {
        1: "Needs Improvement",
        2: "Fair",
        3: "Good",
        4: "Very Good",
        5: "Outstanding"
    };
    return descriptiveTerms[score];
}

export function mapToFeedbackTone(score: number): string {
    const feedbackTones: Record<number, string> = {
        1: "Upset",
        2: "Okay",
        3: "Satisfied",
        4: "Happy",
        5: "Overjoyed"
    };
    return feedbackTones[score];
}

export function calculateAverageRating(surveyAnswers: Record<string, number>): number {
    const values = Object.values(surveyAnswers);
    if (values.length === 0) return 0;
    const total = values.reduce((sum, val) => sum + val, 0);
    return total / values.length;
}

export interface ScaleInfo {
    averageRating: number;
    feedbackScale: string;
    isMatching: string;
    descriptiveScale: string;
}

export function matchRatingWithSentiment(averageRating: number, sentimentScore: number): ScaleInfo {
    const scaledScore = mapScoreToScale(sentimentScore);
    const roundedAverage = Math.round(averageRating);

    return {
        averageRating,
        feedbackScale: mapToDescriptiveTerm(scaledScore),
        isMatching: scaledScore === roundedAverage ? "true" : "false",
        descriptiveScale: mapToDescriptiveTerm(roundedAverage),
    };
}

export interface SentenceAnalysisResult {
    bgColor: string;
    text: string;
    sentimentScore: number;
    tone: string;
}

export function analyzeSentence(
    sentence: string,
    vectorizerData: { vocabulary: Record<string, number>; idf: number[] },
    modelData: { coef: number[]; intercept: number }
): SentenceAnalysisResult {
    const preprocessed = preprocessText(sentence);
    const tfidfVec = tfidfVectorize(preprocessed, vectorizerData);
    const sentimentScore = predictSentiment(tfidfVec, modelData);
    const scaledScore = mapScoreToScale(sentimentScore);
    const tone = mapToFeedbackTone(scaledScore);

    let bgColor = "";
    if (scaledScore >= 4) bgColor = "lightgreen";
    else if (scaledScore >= 3) bgColor = "lightblue";
    else bgColor = "lightcoral";

    return { bgColor, text: sentence.trim(), sentimentScore, tone };
}