const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta - 1);
});

test('Testando get_pergunta com pergunta inexistente', () => {
  const pergunta = modelo.get_pergunta(9999); // ID inexistente
  expect(pergunta).toBeUndefined();
});

test('Testando respostas para pergunta sem respostas', () => {
  const idPergunta = modelo.cadastrar_pergunta('1+1 = ?');

  const respostas = modelo.get_respostas(idPergunta);

  expect(respostas.length).toBe(0);
});

test('Testando cadastro de tres respostas', () => {
  const idPergunta = modelo.cadastrar_pergunta('1+1 = ?')

  modelo.cadastrar_resposta(idPergunta, "Sim!")
  modelo.cadastrar_resposta(idPergunta, "Sim!")
  modelo.cadastrar_resposta(idPergunta, "Nao?")

  const respostas = modelo.get_respostas(idPergunta)

  expect(respostas.length).toBe(3)
  expect(respostas[0].texto).toBe("Sim!")
  expect(respostas[1].texto).toBe("Sim!")
  expect(respostas[2].texto).toBe("Nao?")
})

test('Testando total de respostas para uma pergunta', () => {
  const idPergunta = modelo.cadastrar_pergunta('1+1 = ?')

  modelo.cadastrar_resposta(idPergunta, "Sim!")
  modelo.cadastrar_resposta(idPergunta, "Sim!")
  modelo.cadastrar_resposta(idPergunta, "Nao?")

  const total = modelo.get_num_respostas(idPergunta)

  expect(total).toBe(3)
})
