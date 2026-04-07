const fs = require('fs');
const path = require('path');

const raiz = process.cwd();
const pastaFuncoes = path.join(raiz, 'funcoes');
const regexPasta = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function erro(msg) {
  console.error(`Erro: ${msg}`);
}

if (!fs.existsSync(pastaFuncoes)) {
  erro('A pasta funcoes/ nao existe.');
  process.exit(1);
}

const entradas = fs.readdirSync(pastaFuncoes, { withFileTypes: true });
const pastas = entradas.filter((e) => e.isDirectory()).map((e) => e.name);

if (pastas.length === 0) {
  console.log('Aviso: Nenhuma funcao criada ainda em funcoes/.');
  process.exit(0);
}

let encontrouErro = false;

for (const nomePasta of pastas) {
  const caminhoPasta = path.join(pastaFuncoes, nomePasta);
  const indexJs = path.join(caminhoPasta, 'index.js');

  if (!regexPasta.test(nomePasta)) {
    erro(`Nome de pasta invalido: ${nomePasta}`);
    encontrouErro = true;
  }

  if (!fs.existsSync(indexJs)) {
    erro(`Arquivo index.js ausente em: funcoes/${nomePasta}`);
    encontrouErro = true;
    continue;
  }

  const conteudo = fs.readFileSync(indexJs, 'utf-8');
  const temFunction = /function\s+[a-zA-Z_$][\w$]*\s*\(/.test(conteudo);
  const temExport = /module\.exports\s*=/.test(conteudo);

  if (!temFunction) {
    erro(`index.js sem declaracao de funcao em: funcoes/${nomePasta}`);
    encontrouErro = true;
  }

  if (!temExport) {
    erro(`index.js sem module.exports em: funcoes/${nomePasta}`);
    encontrouErro = true;
  }

  if (temFunction && temExport) {
    console.log(`OK: Estrutura valida em: funcoes/${nomePasta}`);
  }
}

if (encontrouErro) {
  process.exit(1);
}

console.log('Validacao finalizada sem erros.');
