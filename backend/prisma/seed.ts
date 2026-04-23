import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nomes = [
  'Joao Silva Santos','Maria Oliveira Lima','Pedro Costa Ferreira',
  'Ana Paula Rodrigues','Carlos Eduardo Mendes','Fernanda Cristina Alves',
  'Roberto Carlos Souza','Juliana Beatriz Pereira','Marcos Antonio Gomes',
  'Luciana Reis Carvalho','Daniel Felipe Martins','Patricia Helena Barbosa',
  'Ricardo Luiz Teixeira','Debora Cristiane Nascimento','Gustavo Henrique Ribeiro',
  'Simone Aparecida Castro','Thiago Alexandre Moreira','Vanessa Lima Ferreira',
  'Andre Luiz Cardoso','Camila Souza Machado','Bruno Rodrigues Medeiros',
  'Aline Gomes Cunha','Leandro Alves Pinto','Priscila Fernandes Araujo',
  'Diego Costa Vieira','Renata Marques Oliveira','Felipe Santos Cruz',
  'Cristiane Pereira Ramos','Eduardo Melo Correia','Marcia Aparecida Dias',
  'Vinicius Lima Monteiro','Tatiana Rodrigues Moraes','Rodrigo Costa Freitas',
  'Bianca Almeida Nogueira','Fabio Henrique Telles','Natalia Souza Carvalho',
  'Alex Ferreira Andrade','Leticia Gomes Campos','Wendell Lima Ribeiro',
  'Jessica Oliveira Pires','Guilherme Santos Lopes','Erica Rodrigues Neves',
  'Otavio Costa Borges','Isabela Martins Sousa','Celso Aparecido Ferreira',
  'Bruna Alves Cavalcanti','Marcelo Lima Duarte','Amanda Costa Vilaca',
  'Sergio Roberto Dias','Carolina Mendes Azevedo',
];

const cpfs = [
  '384.752.190-41','521.873.640-52','267.194.830-63','948.371.260-74',
  '135.627.890-85','782.435.190-96','459.183.670-07','826.594.130-18',
  '317.462.850-29','694.218.730-30','183.749.260-41','547.832.190-52',
  '921.564.380-63','368.145.790-74','754.293.180-85','192.847.360-96',
  '436.918.270-07','875.243.190-18','294.617.380-29','631.582.940-30',
  '178.394.620-41','563.271.840-52','927.483.160-63','384.196.750-74',
  '751.829.430-85','218.473.960-96','694.352.810-07','137.826.490-18',
  '483.619.270-29','926.473.810-30','351.284.790-41','784.162.930-52',
  '219.846.570-63','467.293.810-74','832.641.590-85','195.374.820-96',
  '678.142.390-07','421.893.760-18','864.537.290-29','237.164.890-30',
  '593.728.410-41','176.439.280-52','824.163.590-63','391.742.860-74',
  '647.281.930-85','182.693.470-96','539.428.160-07','276.841.930-18',
  '918.364.720-29','453.187.260-30',
];

const operadores = ['Carlos Mendes','Ana Paula Souza','Roberto Lima','Fernanda Costa','Diego Alves','Juliana Reis','Marcelo Santos','Patricia Gomes'];
const ambientes = ['extrajudicial', 'judicial'] as const;
const tabulacoesEJ = ['NAO_ASSOCIADO','ESGOTADO_TENTATIVAS','TELEFONE_OCUPADO','OBITO_901','ASSINATURA_DOCUMENTO','DESCONHECIDO','BOLETO_PAGO_308','RETORNO_FILA_713'] as const;
const tabulacoesJD = ['OCUPADO','ACORDO_REALIZADO','BOLETO_ENVIADO_306','RECADO','RCS_EM_LOTE','SEM_PROPOSTA_201','DESCONHECE_CLIENTE','NAO_ATENDE_101','COM_PROMESSA_302','PEDIU_LIGAR_DEPOIS','EMAIL_EM_LOTE','COM_PROPOSTA_301','WHATSAPP_EM_LOTE'] as const;
const statusDiv = ['em_aberto','negociando','acordo','pago','perdido'] as const;
const statusBol = ['emitido','pago','vencido','cancelado'] as const;
const formasPag = ['boleto','pix','deposito','acordo'] as const;
const tiposAcordo = ['a_vista','parcelado'] as const;
const statusAcordo = ['ativo','quebrado','quitado'] as const;
const dominios = ['gmail.com','hotmail.com','yahoo.com.br','outlook.com'];
const cidades = ['Sao Paulo','Rio de Janeiro','Belo Horizonte','Curitiba','Salvador','Fortaleza','Recife','Porto Alegre'];
const estados = ['SP','RJ','MG','PR','BA','CE','PE','RS'];
const ruas = ['das Flores','Principal','do Comercio','Brasil','das Acacias','Sete de Setembro','da Paz','Independencia'];

const rnd = (max: number) => Math.floor(Math.random() * max);
const pick = <T>(arr: readonly T[]): T => arr[rnd(arr.length)];
const randDate = (daysBack: number) => new Date(Date.now() - rnd(daysBack) * 86400000);

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  console.log('Iniciando seed...');

  await prisma.recuperacao.deleteMany();
  await prisma.acordo.deleteMany();
  await prisma.boleto.deleteMany();
  await prisma.acionamento.deleteMany();
  await prisma.divida.deleteMany();
  await prisma.devedor.deleteMany();

  let contratoNum = 1;

  for (let i = 0; i < 50; i++) {
    const nomeCompleto = nomes[i];
    const parts = nomeCompleto.split(' ');
    const nomeFirst = parts[0].toLowerCase();
    const nomeLast = (parts[1] || 'user').toLowerCase();
    const cidadeIdx = rnd(8);
    const ddd = ['11','11','21','31','41','51','61','85'][rnd(8)];

    const devedor = await prisma.devedor.create({
      data: {
        nome: nomeCompleto,
        cpf_cnpj: cpfs[i],
        telefone: `(${ddd}) 9${1000 + rnd(8999)}-${1000 + rnd(8999)}`,
        email: `${nomeFirst}.${nomeLast}${rnd(99)}@${pick(dominios)}`,
        endereco: `Rua ${pick(ruas)}, ${100 + rnd(900)} - ${cidades[cidadeIdx]} - ${estados[cidadeIdx]}`,
      },
    });

    const nDividas = 2 + rnd(3);

    for (let j = 0; j < nDividas; j++) {
      const valDiv = 1500 + rnd(48500);
      const sDiv = pick(statusDiv);
      const vencimento = addDays(new Date(), -rnd(700));
      const vAmbiente = pick(ambientes);

      const divida = await prisma.divida.create({
        data: {
          devedor_id: devedor.id,
          contrato: `CTR-${String(contratoNum++).padStart(6, '0')}`,
          valor_original: valDiv,
          valor_atualizado: parseFloat((valDiv * (1 + Math.random() * 0.35)).toFixed(2)),
          data_vencimento: vencimento,
          status: sDiv,
          ambiente: vAmbiente,
          numero_processo: vAmbiente === 'judicial' ? `PROC-${String(rnd(999999)).padStart(6, '0')}` : null,
          tentativas_acionamento: rnd(10),
        },
      });

      const nAciona = 3 + rnd(6);
      for (let k = 0; k < nAciona; k++) {
        await prisma.acionamento.create({
          data: {
            devedor_id: devedor.id,
            divida_id: divida.id,
            ambiente: vAmbiente,
            tabulacao: vAmbiente === 'extrajudicial' ? pick(tabulacoesEJ) : pick(tabulacoesJD),
            operador: pick(operadores),
            observacao: pick([
              'Devedor atendeu mas recusou negociacao.',
              'Sem contato. Tentativa realizada fora do horario comercial.',
              'Promessa de pagamento confirmada.',
              'Contato realizado com sucesso. Aguardando retorno.',
              'Numero nao existe mais. Atualizar cadastro.',
            ]),
            data_acionamento: randDate(60),
          },
        });
      }

      if (Math.random() > 0.35) {
        const valBol = parseFloat((valDiv * (0.7 + Math.random() * 0.3)).toFixed(2));
        const sBol = pick(statusBol);
        const vencBoleto = addDays(new Date(), rnd(90) - 30);

        const boleto = await prisma.boleto.create({
          data: {
            divida_id: divida.id,
            devedor_id: devedor.id,
            valor: valBol,
            vencimento: vencBoleto,
            status: sBol,
            codigo_barras: `34191.09008 60766.${Math.random().toString().slice(2,8)} 88107.590008 1 ${Math.random().toString().slice(2,16)}`,
            linha_digitavel: `34191090086076686906688107590008${Math.random().toString().slice(2,12)}`,
            pago_em: sBol === 'pago' ? randDate(30) : null,
          },
        });

        if (sBol === 'pago' || Math.random() > 0.6) {
          await prisma.recuperacao.create({
            data: {
              divida_id: divida.id,
              devedor_id: devedor.id,
              boleto_id: boleto.id,
              ambiente: vAmbiente,
              valor_recuperado: parseFloat((valBol * (0.8 + Math.random() * 0.2)).toFixed(2)),
              forma_pagamento: pick(formasPag),
              data_pagamento: randDate(45),
              operador: pick(operadores),
            },
          });
        }
      }

      if (Math.random() > 0.65) {
        const nParc = 2 + rnd(10);
        const vTotal = parseFloat((valDiv * (0.85 + Math.random() * 0.15)).toFixed(2));
        const vTipo = pick(tiposAcordo);
        
        await prisma.acordo.create({
          data: {
            divida_id: divida.id,
            devedor_id: devedor.id,
            ambiente: vAmbiente,
            tipo_acordo: vTipo,
            valor_total: vTotal,
            num_parcelas: vTipo === 'parcelado' ? nParc : null,
            valor_entrada: vTipo === 'a_vista' ? vTotal : null,
            valor_parcela: vTipo === 'parcelado' ? parseFloat((vTotal / nParc).toFixed(2)) : null,
            data_primeiro_venc: addDays(new Date(), rnd(30)),
            desconto_aplicado: parseFloat(((valDiv - vTotal) / valDiv * 100).toFixed(2)),
            status: pick(statusAcordo),
            operador: pick(operadores),
            numero_processo: vAmbiente === 'judicial' ? `PROC-${String(rnd(999999)).padStart(6, '0')}` : null,
            audiencia_prevista: vAmbiente === 'judicial' ? addDays(new Date(), rnd(180)) : null,
          },
        });
      }
    }
  }

  console.log('Seed concluido com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
