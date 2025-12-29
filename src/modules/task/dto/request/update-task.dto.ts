import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    @Length(1, 255)
    content?: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;
}
