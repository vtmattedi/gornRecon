interface ImageMetadata {
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    date: string | null;
    author: string | null;
    uploaded: boolean | null;
}

interface ImageData {
    uri: string;
    metadata: ImageMetadata;
}


export  {ImageData, ImageMetadata}