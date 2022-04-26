import { screen } from "@testing-library/react";
import { setValorInput } from "./setValorInput";

type Dados = {
  nome: string;
  email: string;
  senha: string;
  codigoAcesso: string;
};

export const preencheFormCorretamente = (dados: Dados) => {
  const nome = screen.getByPlaceholderText('Nome');
  const email = screen.getByPlaceholderText('e-mail');
  const senha = screen.getByPlaceholderText('Senha');
  const confirmacaoSenha = screen.getByPlaceholderText('Confirmação de Senha');
  const codigoAcesso = screen.getByPlaceholderText('Código de Acesso');

  // construcao
  setValorInput(nome, dados.nome);
  setValorInput(email, dados.email);
  setValorInput(senha, dados.senha);
  setValorInput(confirmacaoSenha, dados.senha);
  setValorInput(codigoAcesso, dados.codigoAcesso);
};
