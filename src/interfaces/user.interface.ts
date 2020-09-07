export interface User {
    id?: string;
    email: string;
    password?: string;
    diaryIds: string[] | null;
}