export interface ICandidate {
  approved: boolean | null;
  cell: string;
  comments: IComment[];
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  uuid: string;
}

export interface IComment {
  userId: string;
  comment: string;
  timestamp: Date;
}

export class Candidate implements ICandidate {
  constructor(
    public cell: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    readonly uuid: string,
    public approved: boolean | null = null,
    public comments: IComment[] = []
  ) {}

  public approveCandidate(): void {
    this.approved = true;
  }

  public rejectCandidate(): void {
    this.approved = false;
  }

  public updateComment(comment: string, userId: string): void {
    const newComment: IComment = {
      userId,
      comment,
      timestamp: new Date(),
    };
    this.comments = [...this.comments, newComment];
  }

  public resetApproval(): void {
    this.approved = null;
  }
}

export interface ICandidateHttpResponse {
  name: {
    first: string;
    last: string;
  };
  email: string;
  login: {
    uuid: string;
    sha256: string;
  };
  phone: string;
  cell: string;
}
