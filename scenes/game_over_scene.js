export function renderGameOverScene(state) {
  const run = state.run;

  return `
    <main class="game-over-screen">
      <section class="game-over-card">
        <h1>GAME OVER</h1>
        <p>${run.collapse_reason}</p>

        <div class="game-over-grid">
          <div>
            <span>Tickets resolvidos</span>
            <strong>${run.resolved}</strong>
          </div>
          <div>
            <span>Reputacao final</span>
            <strong>${run.reputation}</strong>
          </div>
          <div>
            <span>Stress final</span>
            <strong>${Math.round(run.stress)}%</strong>
          </div>
          <div>
            <span>Satisfacao</span>
            <strong>${Math.round(run.satisfaction)}%</strong>
          </div>
        </div>

        <div class="game-over-actions">
          <button class="pixel-button pixel-button--primary" data-dispatch="game/restart">Novo plantao</button>
          <button class="pixel-button" data-dispatch="office/back-to-menu">Voltar ao menu</button>
        </div>
      </section>
    </main>
  `;
}
