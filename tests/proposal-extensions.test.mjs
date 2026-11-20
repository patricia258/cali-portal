import test from 'node:test';
import assert from 'node:assert/strict';
import {newModule,extensionTotals,validateExtensions} from '../js/proposal-extensions.js';
test('pacote e ativação preservam base, descontos e centavos',()=>{
 assert.equal(extensionTotals(3910,[],20).activation,782);
 assert.equal(extensionTotals(3910,[],15).activation,586.5);
 assert.equal(extensionTotals(3900,[],20).activation,780);
 assert.equal(extensionTotals(3910.55,[],20).activation,782.11);
 assert.equal(extensionTotals(3910,[],0).activation,0);
});
test('módulos opcionais, zero, múltiplos e cobrança personalizada ficam separados',()=>{
 const rs=newModule('recruiting','rs');assert.equal(rs.recruiting.processes,1);assert.equal(rs.amount,0);
 const modules=[rs,{...newModule('custom','2'),name:'Treinamento',amount:400,type:'one_time'},{...newModule('custom','3'),name:'Adicional',amount:1000},{...newModule('custom','4'),name:'Especial',amount:300,type:'custom',billingLabel:'Após aprovação da etapa'}];
 validateExtensions(modules,{percent:15});
 assert.deepEqual(extensionTotals(3910,modules,15),{packageMonthly:3910,recurring:1000,oneTime:400,custom:300,monthly:4910,activation:586.5});
 assert.equal(extensionTotals(3910,modules.filter(m=>m.id!=='3'),15).monthly,3910);
 const restored=JSON.parse(JSON.stringify(modules));assert.deepEqual(restored,modules);
});
test('configuração inválida é recusada antes da persistência',()=>{
 assert.throws(()=>validateExtensions([],{percent:101}));
 assert.throws(()=>validateExtensions([{name:'R&S',amount:-1,type:'recurring'}],{percent:20}));
 assert.throws(()=>validateExtensions([{name:'R&S',amount:0,type:'custom'}],{percent:20}));
 assert.throws(()=>validateExtensions([{name:'R&S',amount:0,type:'recurring',recruiting:{processes:1.5}}],{percent:20}));
});

test('Partner limita só a composição da página 3, sem cortar conteúdo',async()=>{
 const {partnerPage3Report,validatePartnerPage3}=await import('../js/proposal-extensions.js');
 const content={scope:['Entrega contratada'],cadence:['Encontro mensal'],cycles:[{title:'Ciclo 1',focus:'Prioridade',objective:'Implantar',duration:'Mês 1'}],caliResponsibilities:['Orientar'],clientResponsibilities:['Executar']};
 assert.equal(partnerPage3Report(content).valid,true);
 const piped={...content,cycles:['Ciclo 1 | Prioridade | Implantar | Mês 1']};assert.equal(partnerPage3Report(content).fields[2].used,partnerPage3Report(piped).fields[2].used);
 const tooMany={...content,scope:Array.from({length:9},()=> 'Entrega')};assert.throws(()=>validatePartnerPage3(tooMany),/Página 3/);assert.equal(tooMany.scope.length,9);
 assert.throws(()=>validatePartnerPage3({...content,clientResponsibilities:['a'.repeat(221)]}),/Responsabilidades do cliente/);
});
