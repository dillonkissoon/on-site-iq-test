import HttpClient from "../../lib/http.config";
import { Candidate, ICandidateHttpResponse } from "./candidate.model";

export const isLoading = {
  getCandidates: false,
};

export async function getCandidates(): Promise<ICandidateHttpResponse[]> {
  try {
    if (isLoading.getCandidates) return [];
    isLoading.getCandidates = true;

    const { data } = await HttpClient.request({
      url: "https://randomuser.me/api?results=15",
    });

    return [...data.results];
  } catch (error: any) {
    throw new Error(error.message);
  } finally {
    isLoading.getCandidates = false;
  }
}

const storageKey = "reviewed";

export function persistReviewedCandidates(candidates: Candidate[]): void {
  try {
    const reviewedCandidates = candidates.filter(
      (c) => c.approved != null || c.comments.length > 0
    );

    // remove items from storage if none
    if (reviewedCandidates.length === 0)
      return sessionStorage.removeItem(storageKey);

    // store items in memory
    sessionStorage.setItem(storageKey, JSON.stringify(reviewedCandidates));
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export function getPersitedCandidateData(): Candidate[] {
  try {
    const savedCandidates = sessionStorage.getItem(storageKey);
    if (savedCandidates === null) return [];

    const parsed = JSON.parse(savedCandidates);
    const formatted = parsed.map(
      (candidate: any) =>
        new Candidate(
          candidate.cell,
          candidate.email,
          candidate.firstName,
          candidate.lastName,
          candidate.phone,
          candidate.uuid,
          candidate.approved,
          candidate.comments
        )
    );

    return formatted;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
