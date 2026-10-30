export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePostDTO {
    title: string;
    content: string;
    author: string;
}

export interface UpdatePostDTO {
    title?: string;
    content?: string
}