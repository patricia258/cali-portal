// Campos opcionais da proposta: sem alterar a matriz comercial nem o briefing público.
export const ACTIVATION_DESCRIPTION = 'Inclui a preparação para o início da operação: organização de insumos e acessos, configuração da dinâmica de trabalho, planejamento do primeiro ciclo e preparação do kickoff. É uma cobrança única na assinatura, separada das mensalidades, não abatida e não reembolsável.';
export const COVERAGE_FIELDS = [
  ['company','Empresa contratante'],['units','Unidades incluídas'],['unitCount','Quantidade de unidades atendidas','number'],['audience','Público ou funções abrangidas'],['excluded','Empresas, franquias ou unidades excluídas'],['expansion','Condições para expansão futura'],
];
export const MODULE_FIELDS = [
  ['name','Nome do módulo','input'],['description','Descrição e finalidade'],['amount','Valor adicional (R$)','number'],['billingLabel','Condição de cobrança personalizada'],['coverage','Abrangência: unidades, áreas e públicos'],['deliverables','Entregas e atividades incluídas'],['capacity','Capacidade ou quantidade contratada'],['periodicity','Periodicidade'],['caliResponsibilities','Responsabilidades da CALI'],['clientResponsibilities','Responsabilidades do cliente'],['exclusions','Limites e exclusões'],['conditions','Condições específicas'],['guarantee','Garantias, quando aplicáveis'],['term','Vigência do módulo'],
];
export const RECRUITING_FIELDS = [
  ['processes','Processos seletivos incluídos por período','number'],['period','Período de contratação'],['eligibleRoles','Cargos e níveis elegíveis'],['units','Unidades atendidas'],['simultaneous','Máximo de processos simultâneos','number'],['stages','Etapas contempladas'],['technicalAssessment','Avaliação técnica'],['behavioralAssessment','Entrevista estruturada e avaliação comportamental não clínica'],['candidateCriteria','Critérios de apresentação de candidatos'],['finalDecision','Responsável pela entrevista e decisão final'],['extraCosts','Custos adicionais de divulgação e ferramentas'],['replacementGuarantee','Garantia de reposição'],['maxReplacements','Máximo de reposições','number'],['replacementDeadline','Prazo para solicitar reposição'],['invalidGuarantee','Condições que invalidam a garantia'],['profileChanges','Alterações de perfil após abertura'],['unfinishedProcesses','Processos não concluídos no período'],['unusedVacancies','Vagas não utilizadas'],
];
export function newModule(kind='custom', id=crypto.randomUUID()) {
  return {id,kind,type:'recurring',name:kind==='recruiting'?'Recrutamento e Seleção':'',amount:0,periodicity:kind==='recruiting'?'Mensal':'',recruiting:kind==='recruiting'?{processes:1,period:'Mensal'}:{}};
}
export function activationAmount(base, percent=20) {
  return Math.round(Number(base)*Number(percent))/100;
}
export function extensionTotals(base, modules=[], percent=20) {
  const sum = type => modules.filter(m=>m.type===type).reduce((v,m)=>v+Number(m.amount||0),0);
  return {packageMonthly:Number(base), recurring:sum('recurring'), oneTime:sum('one_time'), custom:sum('custom'), monthly:Number(base)+sum('recurring'),activation:activationAmount(base,percent)};
}
export function validateExtensions(modules, activation) {
  if (!Number.isFinite(activation.percent) || activation.percent<0 || activation.percent>100) throw new Error('A ativação deve estar entre 0% e 100%.');
  for (const m of modules) {
    if (!m.name?.trim()) throw new Error('Informe o nome de cada módulo incluído.');
    if (!['recurring','one_time','custom'].includes(m.type) || !Number.isFinite(Number(m.amount)) || Number(m.amount)<0) throw new Error('Revise o tipo e o valor do módulo.');
    if (m.type==='custom' && !m.billingLabel?.trim()) throw new Error('Descreva como será cobrado o módulo personalizado.');
    for (const [k,,kind] of RECRUITING_FIELDS) if (kind==='number' && m.recruiting?.[k]!=='' && m.recruiting?.[k]!=null && (!Number.isInteger(Number(m.recruiting[k])) || Number(m.recruiting[k])<0)) throw new Error('As quantidades de R&S devem ser inteiros a partir de zero.');
  }
}
export function commercialDefaults(months,hours,payment,hasScope=true) {
  const due=payment?.monthlyDue || '1º dia útil de cada mês';
  return [
    `Contrato mínimo de ${months||1} ${Number(months)===1?'mês':'meses'}, com renovação automática e vigência por prazo indeterminado após o período mínimo.`,
    'Cancelamento após o prazo mínimo mediante aviso prévio de 30 dias.',
    'Reajuste a cada 12 meses, conforme índice e condições definidos em contrato.',
    'Demandas fora da carga mensal, visitas adicionais e projetos extraordinários são orçados separadamente.',
    'A priorização das frentes é revista com a liderança ao longo do ciclo.',
    `Mensalidades pagas antecipadamente, com vencimento ${due}.`,
    `A mensalidade considera a atuação dentro das ${hours||1} horas mensais contratadas${hasScope?' e das frentes priorizadas':''}. Ampliações relevantes de escopo ou volume serão previamente alinhadas entre as partes.`,
  ];
}
export const recurringSteps = [
  ['Avaliação e aprovação da proposta','Confirmação do escopo, investimento e condições desta versão.'],
  ['Assinatura + pagamento da Ativação','Formalização do contrato e pagamento da Ativação para abertura da operação CALI.'],
  ['Kickoff','Reunião de início para organizar insumos, responsáveis e o primeiro ciclo.'],
];

// Apenas a página 3 do CALI Partner possui composição editorial com espaço delimitado.
export const PARTNER_PAGE3_LIMITS = {
  scope:{label:'Escopo incluído',characters:800,items:8},
  cadence:{label:'Cadência e formato',characters:320,items:4},
  cycles:{label:'Ciclos e fases',characters:420,items:6},
  caliResponsibilities:{label:'Responsabilidades da CALI',characters:220,items:3},
  clientResponsibilities:{label:'Responsabilidades do cliente',characters:220,items:3},
};
export function partnerPage3Report(content) {
  const fields=Object.entries(PARTNER_PAGE3_LIMITS).map(([key,limit])=>{
    const items=(content[key]||[]).map((item,i)=>{
      if(key!=='cycles') return String(item);
      const parts=typeof item==='string'?item.split('|').map(s=>s.trim()).filter(Boolean):[item.title,item.focus,item.objective,item.duration].filter(Boolean);
      if(parts[0]&&!/^ciclo\b/i.test(parts[0])) parts[0]=`Ciclo ${i+1} · ${parts[0]}`;
      return parts.join(' · ');
    });
    const characters=items.join('\n').length;
    return {key,...limit,used:characters,count:items.length,valid:characters<=limit.characters && items.length<=limit.items};
  });
  return {valid:fields.every(field=>field.valid),fields};
}
export function validatePartnerPage3(content) {
  const report=partnerPage3Report(content);
  if(!report.valid) throw new Error('Página 3 do CALI Partner: '+report.fields.filter(field=>!field.valid).map(field=>`${field.label}: ${field.used}/${field.characters} caracteres e ${field.count}/${field.items} itens`).join('; ')+'. Encurte os textos para manter escopo e responsabilidades na mesma página.');
  return report;
}
