export interface MemoItem {
    id: number;
    title: string;
    created_at: string;
    content: string;
    checkbox?: boolean;
    is_done?: boolean;
}