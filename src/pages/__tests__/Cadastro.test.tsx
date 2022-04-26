import { Cadastro } from '../Cadastro';

import { render, screen } from '@testing-library/react'
import faker from '@faker-js/faker';
import { validaErroApresentadoEmTela } from '../../helpers/teste/validaErroApresentadoEmTela';
import { validaErroNaoApresentadoEmTela } from '../../helpers/teste/validaErroNaoApresentadoEmTela';
import { setValorInput } from '../../helpers/teste/setValorInput';
import { preencheFormCorretamente } from '../../helpers/teste/preencheFormCorretamente';
import axios from 'axios';

const makeSut = () => {
  return render(
    <Cadastro />
  );
}

describe('Cadastro Page', () => {
  beforeEach(jest.clearAllMocks);
  beforeEach(makeSut);

  it('deve bloquear o submit caso os campos não estejam válidos', () => {
    // setup
    const button = screen.getByText('Cadastrar');
    // construcao do cenário e expects
    expect(button).toBeDisabled();
  });

  it('deve validar o formato de e-mail no cadastro', () => {
    const inputEmail = screen.getByPlaceholderText('e-mail');
    const emailErrado = 'teste@teste';
    const emailCorreto = faker.internet.email();
    const mensagemDeValidacao = 'Formato de e-mail inválido';

    setValorInput(inputEmail, emailErrado);
    screen.getByText(mensagemDeValidacao);
    validaErroNaoApresentadoEmTela(inputEmail, emailCorreto, mensagemDeValidacao);
  });

  describe('deve validar os critérios de aceitação da senha', () => {
    let input: HTMLElement;
    beforeEach(() => {
      input = screen.getByPlaceholderText('Senha');
    });

    it('senha deve ter 8 dígitos ou mais', () => {
      const value = faker.lorem.paragraph();
      const mensagemDeValidacao = 'Senha deve ter ao menos 8 caracteres';
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it('senha deve ter letra maiuscula', () => {
      const value = 'Teste';
      const mensagemDeValidacao = 'Senha deve conter pelo menos uma letra maiúscula';
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it('senha deve ter letra minúscula', () => {
      const value = 'Teste';
      const mensagemDeValidacao = 'Senha deve conter pelo menos uma letra minúscula';
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it('senha deve ter números', () => {
      const value = 'Teste 1';
      const mensagemDeValidacao = 'Senha deve conter pelo menos um número';
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });

    it('senha deve ter caracteres especiais', () => {
      const value = 'Teste@1';
      const mensagemDeValidacao = 'Senha deve conter pelo menos um caractere especial';
      validaErroApresentadoEmTela(input, mensagemDeValidacao);
      validaErroNaoApresentadoEmTela(input, value, mensagemDeValidacao);
    });
  });

  it('deve garantir que senha e confirmação sejam iguais', () => {
    const senha = screen.getByPlaceholderText('Senha');
    const confirmacaoSenha = screen.getByPlaceholderText('Confirmação de Senha');
    const mensagemDeValidacao = 'Senhas não conferem';
    const senhaTeste1 = 'Teste@1';
    const senhaTeste2 = 'Teste@2';
    setValorInput(senha, senhaTeste1);
    setValorInput(confirmacaoSenha, senhaTeste2);

    screen.getByText(mensagemDeValidacao);
    validaErroNaoApresentadoEmTela(confirmacaoSenha, senhaTeste1, mensagemDeValidacao);
  });

  it('deve enviar o formulário se todos os dados estiverem preenchidos corretamente', () => {
    // setup
    jest.spyOn(axios, 'post').mockResolvedValue('ok');
    const dados = {
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha: 'S3nh@!123',
      codigoAcesso: faker.lorem.paragraph(),
    };

    // construcao
    preencheFormCorretamente(dados);
    const botao = screen.getByText('Cadastrar');
    botao.click();

    // asserts
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/auth/cadastrar'),
      dados
    );
  });

  it('deve notificar o usuário que o cadastro foi efetuado com sucesso', async () => {
    // setup
    jest.spyOn(axios, 'post').mockResolvedValue('ok');
    const dados = {
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha: 'S3nh@!123',
      codigoAcesso: faker.lorem.paragraph(),
    };

    // construcao
    preencheFormCorretamente(dados);
    const botao = screen.getByText('Cadastrar');
    botao.click();

    const mensagemDeConfirmacao = await screen.findByText('Cadastro realizado com sucesso');

    // asserts
    expect(mensagemDeConfirmacao).toBeInTheDocument();
  });

  it('deve apresentar os erros de validação para o usuário, caso a API retorne erro', async () => {
    // setup
    const mensagemDeErro = "Usuário já existe";
    jest.spyOn(axios, 'post').mockRejectedValue({
      response: {
        data: {
          statusCode: 400,
          message: mensagemDeErro,
          error: "Bad Request"
        },
      },
    });
    const dados = {
      nome: faker.name.firstName(),
      email: faker.internet.email(),
      senha: 'S3nh@!123',
      codigoAcesso: faker.lorem.paragraph(),
    };

    // construcao
    preencheFormCorretamente(dados);
    const botao = screen.getByText('Cadastrar');
    botao.click();

    const mensagem = await screen.findByText(mensagemDeErro);
    // asserts
    expect(mensagem).toBeInTheDocument();
  });
});
