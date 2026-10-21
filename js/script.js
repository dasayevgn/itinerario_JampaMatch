const ROTULOS = {natureza:"Natureza",trilha:"Trilha",praia:"Praia",historia:"História",cultura:"Cultura",tranquilo:"Tranquilo",aventura:"Aventura",gratis:"Grátis",familia:"Família",porDoSol:"Pôr do sol",gastronomia:"Gastronomia"};

const PERGUNTAS = [
  {q:"Que cenário combina mais com você?", o:[
    {t:"Mata e verde", tags:["natureza","trilha"]},
    {t:"Mar e areia", tags:["praia"]},
    {t:"Ruas e construções antigas", tags:["historia","cultura"]},
    {t:"Um pouco de tudo", tags:["natureza","praia","historia"]}]},
  {q:"Qual é o seu ritmo de passeio?", o:[
    {t:"Gosto de caminhar e explorar", tags:["trilha","aventura"]},
    {t:"Prefiro ir com calma", tags:["tranquilo"]},
    {t:"Quero só ver o pôr do sol", tags:["porDoSol","tranquilo"]}]},
  {q:"Você gosta de história e cultura?", o:[
    {t:"Muito", tags:["historia","cultura"]},
    {t:"Um pouco", tags:["cultura"]},
    {t:"Prefiro outras coisas", tags:[]}]},
  {q:"Com quem você vai?", o:[
    {t:"Sozinho(a)", tags:["tranquilo"]},
    {t:"Em casal", tags:["porDoSol","tranquilo"]},
    {t:"Com a família", tags:["familia"]},
    {t:"Com amigos", tags:["gastronomia","aventura"]}]},
  {q:"E o bolso?", o:[
    {t:"Quero passeios gratuitos", tags:["gratis"]},
    {t:"Posso gastar um pouco", tags:[]}]}
];

/* Dados de exemplo: confirmar horários, valores e regras de cada local antes de publicar. */
const LOCAIS = [
  {n:"Jardim Botânico Benjamin Maranhão", tags:["natureza","trilha","tranquilo","familia"], d:"Trilhas na Mata do Buraquinho, um dos maiores remanescentes de Mata Atlântica dentro de uma capital.", v:"Fique nas trilhas sinalizadas e leve o lixo de volta."},
  {n:"Parque Arruda Câmara (Bica)", tags:["natureza","familia","tranquilo"], d:"Parque arborizado no centro da cidade, ótimo para caminhar à sombra com as crianças.", v:"Não alimente os animais e respeite as áreas de preservação."},
  {n:"Picãozinho", tags:["praia","natureza","aventura","familia"], d:"Piscinas naturais que se formam na maré baixa, com peixes e corais a poucos metros da areia.", v:"Não pise nos corais nem leve nada do recife. Passe protetor solar biodegradável."},
  {n:"Ponta do Seixas", tags:["praia","natureza","tranquilo","gratis","porDoSol"], d:"Falésia e mirante no ponto mais a leste das Américas. Vale chegar cedo para o nascer do sol.", v:"Fique longe da borda da falésia e não deixe resíduos no mirante."},
  {n:"Praia do Jacaré", tags:["porDoSol","cultura","gastronomia","tranquilo"], d:"Pôr do sol no Rio Paraíba com saxofonista tocando Bolero de Ravel e restaurantes à beira d'água.", v:"Prefira passeios de barco que respeitem o manguezal e a fauna do rio."},
  {n:"Centro Histórico", tags:["historia","cultura","familia","gastronomia"], d:"Igrejas barrocas, praças e casarões que contam a história da terceira cidade mais antiga do Brasil.", v:"Vá a pé ou de transporte coletivo e evite sujar o patrimônio."},
  {n:"Estação Cabo Branco", tags:["cultura","porDoSol","familia","tranquilo"], d:"Complexo cultural projetado por Oscar Niemeyer, com vista aberta para o mar na Ponta do Cabo Branco.", v:"Use as lixeiras seletivas e respeite a vegetação do entorno."},
  {n:"Parque Solon de Lucena (Lagoa)", tags:["familia","tranquilo","gratis","historia"], d:"Praça com a lagoa cercada de ficus centenários, boa para caminhada leve e para ver a vida da cidade.", v:"Não jogue lixo nem comida na lagoa."},
  {n:"Orla de Tambaú e Cabo Branco", tags:["praia","familia","gratis","gastronomia"], d:"Calçadão à beira-mar para caminhar, tomar água de coco e provar tapioca.", v:"Deixe a praia limpa e evite plásticos descartáveis."}
];

const area = document.getElementById("area"), prog = document.getElementById("prog"), voltar = document.getElementById("voltar");
let passo = 0, resp = [];

function barra(){
  prog.innerHTML = PERGUNTAS.map((_,i)=>`<i class="${i<=passo?"on":""}"></i>`).join("");
}

function mostrar(){
  if(passo >= PERGUNTAS.length){ return resultado(); }
  const p = PERGUNTAS[passo];
  barra(); voltar.hidden = passo === 0;
  area.innerHTML = `<h3 class="pergunta">${p.q}</h3><div class="opcoes">${
    p.o.map((o,i)=>`<button class="opcao${resp[passo]===i?" sel":""}" data-i="${i}">${o.t}</button>`).join("")}</div>`;
}

area.addEventListener("click", e=>{
  const b = e.target.closest(".opcao");
  if(b){
    resp[passo] = +b.dataset.i;
    area.querySelectorAll(".opcao").forEach(x=>x.classList.toggle("sel", x===b));
    setTimeout(()=>{ passo++; mostrar(); }, 220);
  }
  if(e.target.id === "refazer"){ passo = 0; resp = []; mostrar(); document.getElementById("quiz").scrollIntoView(); }
});
voltar.addEventListener("click", ()=>{ if(passo>0){ passo--; mostrar(); } });

function resultado(){
  const pesos = {}; let total = 0;
  resp.forEach((r,i)=> PERGUNTAS[i].o[r].tags.forEach(t=>{ pesos[t]=(pesos[t]||0)+1; total++; }));
  const rank = LOCAIS.map(l=>{
    const pts = l.tags.reduce((s,t)=>s+(pesos[t]||0),0);
    const iguais = l.tags.filter(t=>pesos[t]);
    return {...l, pts, iguais};
  }).sort((a,b)=>b.pts-a.pts).slice(0,3);
  barra(); voltar.hidden = true;
  area.innerHTML = `<h3 class="pergunta">Seus 3 melhores matches</h3>
  <div class="cards">${rank.map(l=>{
    const pct = total ? Math.min(98, Math.round(l.pts/total*100)+30) : 50;
    return `<article class="card"><header><h3>${l.n}</h3><span class="pct">${pct}% de match</span></header>
      <div class="barra"><i style="width:${pct}%"></i></div>
      <p>${l.d}</p>
      ${l.iguais.length?`<div class="chips" aria-label="Combina com">${l.iguais.map(t=>`<span>${ROTULOS[t]}</span>`).join("")}</div>`:""}
      <p class="verde"><b>Dica verde:</b> ${l.v}</p></article>`;}).join("")}</div>
  <div class="acoes"><button class="btn sec" id="refazer">Refazer o quiz</button></div>
  <p class="nota">Os locais e as descrições são exemplos. Confirme horários, valores e regras de cada lugar.</p>`;
}

mostrar();
