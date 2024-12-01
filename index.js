const form = document.getElementById('match-form');
const scoreboard = document.getElementById('scoreboard').querySelector('tbody');
const teams = new Map();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const date = document.getElementById('date').value;
  const matchDay = document.getElementById('match-day').value;
  const team1 = {
    name: document.getElementById('team1-name').value.trim(),
    score: parseInt(document.getElementById('team1-score').value, 10),
    yellow: parseInt(document.getElementById('team1-yellow').value || 0, 10),
    red: parseInt(document.getElementById('team1-red').value || 0, 10),
  };
  const team2 = {
    name: document.getElementById('team2-name').value.trim(),
    score: parseInt(document.getElementById('team2-score').value, 10),
    yellow: parseInt(document.getElementById('team2-yellow').value || 0, 10),
    red: parseInt(document.getElementById('team2-red').value || 0, 10),
  };

  // Validazione: una squadra deve avere punteggio 3, ma non entrambe
  if ((team1.score === 3 && team2.score === 3) || (team1.score < 3 && team2.score < 3)) {
    alert('Una delle due squadre deve avere punteggio 3, ma non entrambe!');
    return;
  }

  // Verifica che il punteggio non sia già registrato per questa giornata
  const uniqueKey1 = `${team1.name}-${matchDay}`;
  const uniqueKey2 = `${team2.name}-${matchDay}`;
  if (teams.has(uniqueKey1) || teams.has(uniqueKey2)) {
    alert('Punteggio già registrato per questa giornata e squadra!');
    return;
  }

  // Calcolo dei punti
  const points1 = calculatePoints(team1.score, team1.yellow, team1.red);
  const points2 = calculatePoints(team2.score, team2.yellow, team2.red);

  // Aggiorna i dati delle squadre
  updateTeamData(team1.name, points1, team1.yellow, team1.red);
  updateTeamData(team2.name, points2, team2.yellow, team2.red);

  // Salva i dati
  teams.set(uniqueKey1, team1);
  teams.set(uniqueKey2, team2);

  // Aggiorna la classifica
  updateScoreboard();
});

function calculatePoints(score, yellow, red) {
  let points = score === 3 ? 3 : 0; // Solo punteggio 3 dà punti
  points -= yellow * 0.5; // Penalità per ammonizioni
  points -= red; // Penalità per espulsioni
  return Math.max(points, 0); // Nessun punteggio negativo
}

function updateTeamData(name, points, yellow, red) {
  if (!teams.has(name)) {
    teams.set(name, { points: 0, yellow: 0, red: 0 });
  }
  const team = teams.get(name);
  team.points += points;
  team.yellow += yellow;
  team.red += red;
}

function updateScoreboard() {
  const sortedTeams = Array.from(teams.entries())
    .map(([name, data]) => data.points !== undefined ? { name, ...data } : null) // Filtra dati incompleti
    .filter(Boolean) // Rimuovi valori nulli
    .sort((a, b) => b.points - a.points); // Ordina per punteggio decrescente

  scoreboard.innerHTML = sortedTeams.map(team => `
    <tr>
      <td>${team.name}</td>
      <td>${team.points}</td>
      <td>${team.yellow}</td>
      <td>${team.red}</td>
    </tr>
  `).join('');
}