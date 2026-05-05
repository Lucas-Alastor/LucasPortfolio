Como adicionar novos projetos:

1. Coloque o GIF do projeto nesta pasta.
   Exemplo: meu-projeto.gif

2. No index.html, duplique um bloco:

<a class="project-card" href="https://link-do-projeto.com" target="_blank" rel="noopener noreferrer" data-title="Nome do Projeto" data-description="Descrição curta do projeto." data-preview="image/projects/meu-projeto.gif">
    <div class="project-media">
        <img src="image/projects/meu-projeto.gif" alt="Prévia em GIF do Nome do Projeto">
        <div class="project-fallback"><i class="fa-solid fa-code"></i></div>
    </div>
    <div class="project-content">
        <h3>Nome do Projeto</h3>
        <p>Descrição curta do projeto.</p>
        <div class="tag-list"><span>HTML</span><span>CSS</span><span>JS</span></div>
        <span class="project-link-label">Ver projeto <i class="fa-solid fa-arrow-up-right-from-square"></i></span>
    </div>
</a>

3. Troque:
   - href pelo link real do projeto/site.
   - data-preview e img src pelo caminho do GIF.
   - h3, p e tags pelas informações reais.

A grade mostra 3 cards por linha no desktop e limita a altura a 2 linhas. Ao passar de 6 projetos, o scroll aparece dentro da própria grade.
