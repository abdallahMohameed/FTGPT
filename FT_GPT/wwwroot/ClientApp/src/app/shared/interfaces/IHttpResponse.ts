export interface IHttpResponse<T> {
    isSuccess: string;
    statusCode: string;
    errorMessage: string | null;
    errors: any[] | null;
    content: T;
}