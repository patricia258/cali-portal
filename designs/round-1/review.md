GATE: OPEN 32 (rounds used up)

# Revisão da rodada 1 — Portal CALI

## Escopo e estado
Três propostas de identidade e hero, para escolha da proprietária. Nenhuma foi publicada em produção. Não são versões aprovadas para lançamento. O gate automático foi executado na opção A; B e C receberam revisão visual e verificação de geometria/destinos em navegador.

## Resultado verificado
- Três opções em 1440, 1024, 768, 390 e 320px: sem rolagem horizontal nem imagens quebradas; nove destinos únicos de briefing em cada opção.
- Copy-lint: zero falhas e zero avisos nas três opções.
- Capturas de 1440×900 e 390×844 com dimensões verificadas.
- Texto de apoio escurecido e foco reforçado após revisão de contraste.
- Camada de movimento copiada da skill sem edição; preferência de movimento reduzido respeitada pelo CSS.
- Fontes: Inter (A), Archivo (B), Manrope (C). Paleta própria da CALI. Retrato e logos existentes, sem imagens de terceiros.
- Nenhuma estatística, depoimento, cliente ou promessa inventados. Nenhuma alteração no backend, formulário, painel, proposta ou e-mails.

## Limites e próximos passos
O gate aplica também requisitos de página final, imagem por seção, grade própria e ritmo de telas inteiras. Há achados que exigem refinamento ou decisão de projeto na direção selecionada. O índice de serviços e o rodapé ainda são suporte de navegação desta rodada. Não foram executados perf.mjs nem uma auditoria integral de acessibilidade. A verificação manual de overflow não substitui esses checks.
O WhatsApp sinalizado pelo checker é o contato oficial já existente no repositório. Não foi substituído por um contato fictício. Nenhuma waiver foi usada.

## Achados automáticos abertos (inclui repetições por viewport)
- 1440px · no-visual · section#inicio: no picture, effect or mock in this section; a feature section needs a visual
- 1440px · no-visual · section#momentos: no picture, effect or mock in this section; a feature section needs a visual
- 1440px · text-only · section#todos: the closing section is only text: no picture, icon, mock or effect in it
- 1440px · cta · section#todos: the last section before the footer ends with no button
- 1440px · copy-headline · div.wrap > div.a-grid > div.hero-copy > h1: "O próximo passo do seu RH." does not name what is sold (portal de servicos de rh, portal, servicos, from flags); only the line under it does
- 1440px · heading-scale · section#momentos > div.wrap > div.section-head > h2: h2 headings in 2 sizes, 32px ("Todos os serviços") to 57.6px (x1.80)
- 1440px · phone-number · div.wrap > div.foot-top > div.foot-links > a:nth-of-type(2): a WhatsApp link calls a number in a real dialable format: "https://wa.me/5541987791933"; a visitor can dial it and reach a stranger
- 1440px · focus-visible · div#direcao > a.service:nth-of-type(1): Tab stop 11, a "Assessoria Estratégica Direção recorrente de RH ju": the focus lands on something you cannot see
- 1440px · run-on · div.wrap > div.a-grid:nth-of-type(1) > div.hero-copy:nth-of-type(1) > h1: "do seu | RH.": the heading runs its first sentence into the grey second one with no stop
- 1440px · section-height · footer: the section is 279px tall (0.3 screens), 621px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
- 1440px · section-height · section#todos: the section is 331px tall (0.4 screens), 569px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
- 1440px · section-height · section#momentos: the section is 1031px tall (1.1 screens), 131px over one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
- 1440px · section-height · footer: the section starts at 2262px, 438px above the screen grid (3 x 900px): sections start on whole screens (SR-2)
- 1440px · section-height · section#todos: the section starts at 1931px, 131px below the screen grid (2 x 900px): sections start on whole screens (SR-2)
- 1440px · section-height · footer: the section's content does not fit it: its lowest content ends 243px below its top, past 207px (the section less 72px of bottom padding) (SR-2)
- 1440px · section-air · section#momentos > div.wrap > div.custom: a top border across 100% of the container, between the section's content: sections and their parts are told apart by air and ground, not lines (SR-3)
- 1440px · one-section · section#momentos: the screen at scroll 1641px (the top of section 3) shows 290px of section 2 and the content of 3 sections, over 24px each beside section 3: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
- 1440px · container-edges · a.skip: a <a> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
- 1440px · container-edges · footer: a <footer> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
- 1440px · container-edges · section#inicio > div.wrap: the hero's .wrap holds 2 children, 0 of them .hero-text: one .hero-text and at most one strip (SR-6)
- 1440px · container-edges · div.hero-copy > div.person > div > strong: 1 text block starts on a left line at x 134, 54px from the container's left: text starts on the container's left, or on one split line (x 623, 732, 841) (SR-6)
- 1440px · container-edges · div.wrap > div.a-grid > div.hero-copy > p.eyebrow: 1 text block starts on a left line at x 112, 32px from the container's left: text starts on the container's left, or on one split line (x 623, 732, 841) (SR-6)
- 1440px · split-pair · section#inicio > div.wrap > div.a-grid: the two columns of the split start 62px apart at the top (centred on each other): a split's columns are top-aligned, 8px either way (SR-8)
- 1440px · split-pair · section#inicio > div.wrap > div.a-grid: the split's columns are off the page's one pair of lines: its right column starts at x 775, on none of the split lines 623 (k=5), 732 (k=6), 841 (k=7) (SR-8)
- 390px · no-visual · section#inicio: no picture, effect or mock in this section; a feature section needs a visual
- 390px · no-visual · section#momentos: no picture, effect or mock in this section; a feature section needs a visual
- 390px · text-only · section#todos: the closing section is only text: no picture, icon, mock or effect in it
- 390px · cta · section#todos: the last section before the footer ends with no button

## Waivers
Nenhuma.

## Referências de processo
uxui-workflow, fase 3 (fallback HTML, três opções por rodada), e design-taste-frontend. O requisito de três direções e a paleta CALI vieram do briefing aprovado. Não há sistema de design fechado.
