import { PartialType } from "@nestjs/swagger";
import { CreateMatriculaAtividadeDto } from "./create-matriculaAtividade.dto";

export class UpdateMatriculaAtividadeDto extends PartialType(CreateMatriculaAtividadeDto) {}
