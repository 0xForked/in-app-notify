export interface Orbit {
    id?:string,
    title?: string,
    subtitle?:string,
    image_url?: string,
    is_earned?: string
}

export interface Honor {
    id?:string,
    image_url?: string,
    is_earned?: string
}

export interface ExpandData {
    type?: string,
    orbit: Orbit,
    honors: Honor[],
}

export interface NotifyData {
    title?:string,
    description?:string,
    type?:string,
    data?: ExpandData
}
