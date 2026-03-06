# Gerador de Assinatura

Pequeno gerador de assinaturas de email que sobrepõe texto personalizado sobre uma imagem de fundo.

## Estrutura

- `index.html` - página principal com formulários e canvas
- `css/global.css` - estilos globais (variáveis, layout, ícones)
- `js/main.js` - lógica de desenho, carregamento de fundos e exportação
- `assets/lib/signatures.json` - array de objetos com configurações por empresa (nome, posições, cores, tamanhos de fonte, dimensões do canvas e arquivo de fundo)
- `assets/images/` - imagens de fundo usadas pelo canvas
- `assets/*.jpg` - imagens de fundo (copiar para `assets/images`)

## Como usar

1. Abra `index.html` no navegador.
2. Preencha nome e cargo.
3. Escolha o fundo desejado (se houver mais de um).
4. Clique em **Exportar como JPG** e salve a imagem.

## Possíveis melhorias

- Usar `config.json` para posicionar texto dinamicamente.
- Adicionar opção de cor/fonte nas entradas.
- Mover recursos para servidor ou build tool.
