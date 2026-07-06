import { SeederService } from './seeder.service';
export declare class SeederController {
    private readonly seederService;
    constructor(seederService: SeederService);
    seedCore(): Promise<{
        message: string;
    }>;
    seedAdmin(): Promise<{
        message: string;
    }>;
}
