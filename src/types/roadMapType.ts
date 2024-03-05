import { Document } from 'mongoose'

export default interface RoadmapInterface extends Document{
    date: string;
    title: string;
    description: string;
    product: number;
}


