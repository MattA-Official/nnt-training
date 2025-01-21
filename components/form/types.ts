export interface FormField {
    name: string;
    value: any;
    groupPath?: string[];
}

export interface FormGroup {
    name?: string;
    fields: { [key: string]: any };
    groups: { [key: string]: FormGroup };
}
