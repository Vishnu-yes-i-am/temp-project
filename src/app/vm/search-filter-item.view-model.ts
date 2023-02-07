export class SearchFilterItem{
    public criteriaID:number;
    public operation: 0 | 1 | 2 | 3;
    public value:string;
    public nextItemLink?: 'x' | '+';
    constructor(criteriaID: number = 0, operation: 0 | 1 | 2 | 3 = 0, value: string = '', nextItemLink?: 'x' | '+') {
        this.criteriaID = criteriaID;
        this.operation = operation;
        this.value = value;
        this.nextItemLink = nextItemLink;
    }
}