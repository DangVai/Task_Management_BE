import { IsEnum, IsOptional, IsString } from 'class-validator';

enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    content?: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;
}
