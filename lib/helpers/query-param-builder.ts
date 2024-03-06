export class QueryParamBuilder {
    private params: { [key: string]: string };

    constructor() {
        this.params = {};
    }

    addParam(key: string, value: any): QueryParamBuilder {
        if (value === undefined || value === null) return this;
        this.params[key] = value.toString();
        return this;
    }

    build(): string {
        const queryParams = Object.entries(this.params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        return queryParams ? `?${queryParams}` : '';
    }
}