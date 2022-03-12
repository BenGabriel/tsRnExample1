export interface comment {
    id: number;
    text: string;
    author: User;
    timeStamp: number;
    likes: number[]
}

export interface User {
    id: number;
    name: string;
    avatar?: string;
}
export interface post {
    id: number;
    text: string,
    timeStamp: number;
    likes: number[];
    author: number;
    comments: comment[];
    authorDetails?: User;

    likePost?: () => void;
    unLikePost?: () => void;
    makeComment?: () => void;
}