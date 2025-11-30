export enum TipoAtividade {
  RODA_TERAPEUTICA = "roda_terapeutica",
  JIU_JITSU = "jiu_jitsu",
  AULA_REFORCO = "aula_reforco",
  PSICOPEDAGOGIA = "psicopedagogia",
  ALFABETIZACAO_ADULTOS = "alfabetizacao_adultos",
  AULA_MUSICA = "aula_musica",
  OUTRA = "outra",
}

export const tipoAtividadeLabels: { [key in TipoAtividade]: string } = {
  [TipoAtividade.RODA_TERAPEUTICA]: "Roda Terapêutica",
  [TipoAtividade.JIU_JITSU]: "Jiu-Jitsu",
  [TipoAtividade.AULA_REFORCO]: "Aula de Reforço",
  [TipoAtividade.PSICOPEDAGOGIA]: "Psicopedagogia",
  [TipoAtividade.ALFABETIZACAO_ADULTOS]: "Alfabetização de Adultos",
  [TipoAtividade.AULA_MUSICA]: "Aula de Música",
  [TipoAtividade.OUTRA]: "Outra",
};
