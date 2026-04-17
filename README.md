# Onofriana — Site

Site institucional da **Onofriana — Curadoria, Produção e Programação de Fado**.

> A Herança Feminina do Fado.

---

## Estrutura do projeto

```
onofriana/
├── index.html              ← página principal
├── 404.html                ← página de erro
├── CNAME                   ← domínio próprio (onofriana.pt)
├── robots.txt              ← indexação motores de busca
├── sitemap.xml             ← mapa do site
├── llms.txt                ← ficheiro para LLMs (GEO)
├── css/
│   └── style.css
├── js/
│   └── main.js             ← nav, reveal, modal, FAB, cookie banner
├── svg/
│   ├── logo.svg
│   ├── guitarra.svg
│   └── favicon.svg
└── images/
    ├── formacaosevera.png
    ├── formacaomariquinhas.png
    ├── formacaoguitarradas.png
    ├── formacaovimioso.png
    ├── marta_rosa.png
    └── apple-touch-icon.png
```

---

## Antes de publicar — TO-DO

### 1. Google Analytics 4 (opcional mas recomendado)
No `index.html` há um bloco comentado com `TODO: Google Analytics 4`. Quando tiver o ID GA4 (formato `G-XXXXXXXXXX`):
1. Crie a propriedade em [analytics.google.com](https://analytics.google.com).
2. Copie o ID.
3. No `index.html`, descomente o bloco e substitua `G-XXXXXXXXXX` pelo ID real (nas **duas** ocorrências).
4. O **Consent Mode v2** já está implementado — o GA só envia dados depois do utilizador aceitar no banner.

### 2. Imagem Open Graph
Criar `images/og-image.jpg` (1200×630 px) para partilhas em redes sociais. Recomenda-se uma composição com o logo + guitarra&rosa sobre fundo creme.

### 3. Versão inglesa (segunda fase)
Estrutura preparada (botão EN desativado, `hreflang`, metadata bilingue). Textos a adicionar quando necessário.

---

## Funcionalidades implementadas

### Acessibilidade (WCAG 2.1 AA)
- Skip link para o conteúdo principal
- `<h1>` oculto (sr-only) para SEO sem impacto visual
- Focus visível em todos os elementos interativos (teclado)
- Focus trap no modal da política de privacidade
- ARIA labels em nav, secções, botões de idioma e redes
- `prefers-reduced-motion` respeitado
- Contraste AA em todo o texto (stone darkened para #5C5650)
- Idioma declarado (`lang="pt"`)
- Estrutura semântica (`<main>`, `<section>`, `<article>`, `<figure>`)

### SEO
- Title e meta description otimizados para "Fado + Lisboa"
- Canonical + hreflang (pt + x-default)
- Open Graph + Twitter Card completos
- JSON-LD: `Organization`, `FAQPage` (aparece em SERP rica), `WebSite`, `Person` (Marta)
- Sitemap + robots.txt
- Imagens com `alt`, `loading="lazy"`, `width`/`height`

### GEO (Generative Engine Optimization)
- Ficheiro `llms.txt` na raiz, em markdown estruturado
- FAQs fraseadas em linguagem natural (para LLMs indexarem bem)
- Factos verificáveis e explícitos (universidades, cargos, diferenciadores)

### RGPD / Privacidade
- Banner de cookies no fundo do site, com peso igual entre "Aceitar" e "Recusar"
- 3 categorias granulares (Essenciais / Analíticos / Marketing)
- Google **Consent Mode v2** (padrão denied → update após consentimento)
- `anonymize_ip` ativado
- Política de privacidade completa em modal (10 secções)
- Link no footer para reabrir as definições de cookies

### UX
- Botão flutuante "Contactar" (mailto) no canto inferior direito
- Desaparece automaticamente na secção de contacto
- Desaparece enquanto o banner de cookies estiver visível
- Redes sociais com secção dedicada "Siga-nos" + repetidas no footer
- Frase-assinatura "É esse o meu nome para o mundo" em destaque pull-quote

---

## Deploy no GitHub Pages com domínio onofriana.pt

### 1. Subir ao GitHub
```bash
git init
git add .
git commit -m "Primeira versão"
git branch -M main
git remote add origin https://github.com/<utilizador>/<repo>.git
git push -u origin main
```

### 2. Ativar GitHub Pages
Settings → Pages → Deploy from branch `main` / `/root`.

### 3. Configurar DNS do onofriana.pt
4 registos A na raiz (`@`):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
CNAME para subdomínio `www`: `<utilizador>.github.io.`

### 4. No GitHub
Settings → Pages → Custom domain: `onofriana.pt`. Ativar "Enforce HTTPS" quando disponível.

---

## Como editar

**Textos**: abrir `index.html`, as secções estão comentadas.
**Cores e tipografia**: abrir `css/style.css`, variáveis no topo (`:root`).
**Fotos**: substituir os ficheiros em `images/` mantendo o nome.
**FAQ**: cada pergunta é um `<details class="faq__item">`. Sempre que adicionar uma, adicione também a mesma entrada no JSON-LD `FAQPage` (no `<head>`) para manter consistência com o Google.

---

## Créditos

- **Foto Marta Rosa**: © [Robnu Creative Studio](https://www.behance.net/robnucreativestudio)
- **Foto formação Severa**: © Emilio Fraile
- **Outras fotografias**: arquivo Onofriana

---

*A tradição não existe sem um sentido.*
