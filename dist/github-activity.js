(() => {
  const card = document.querySelector('.activity-card');
  if (!card) return;
  const graph = card.querySelector('.activity-scroll');
  const summary = card.querySelector('[data-activity-count]');
  const updated = card.querySelector('[data-activity-updated]');
  const endpoint = 'https://github-contributions-api.jogruber.de/v4/mighelsterzkdev?y=last';
  const dayMs = 86400000;
  const months = new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' });
  const dates = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const consultedDates = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' });
  let rendered = false;

  function svgElement(tag, attributes, content) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
    if (content !== undefined) element.textContent = content;
    return element;
  }

  function validate(data) {
    if (!Array.isArray(data?.contributions) || data.contributions.length < 7 || data.contributions.length > 400) throw new Error('Invalid calendar');
    const days = data.contributions.map(day => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date) || !Number.isInteger(day.count) || day.count < 0 || !Number.isInteger(day.level) || day.level < 0 || day.level > 4) throw new Error('Invalid day');
      const time = Date.parse(`${day.date}T00:00:00Z`);
      if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== day.date) throw new Error('Invalid date');
      return { ...day, time };
    }).sort((a, b) => a.time - b.time);
    for (let i = 1; i < days.length; i++) {
      if (days[i].time - days[i - 1].time !== dayMs) throw new Error('Incomplete calendar');
    }
    return days;
  }

  function render(data, fetchedAt) {
    const todayParts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Sao_Paulo' }).formatToParts(new Date()).map(part => [part.type, part.value]));
    const today = Date.parse(`${todayParts.year}-${todayParts.month}-${todayParts.day}T00:00:00Z`);
    const days = validate(data).filter(day => day.time <= today && day.time > today - 365 * dayMs);
    if (!days.length) throw new Error('Calendar outside current period');
    const origin = days[0].time - new Date(days[0].time).getUTCDay() * dayMs;
    const columns = Math.floor((days.at(-1).time - origin) / (7 * dayMs)) + 1;
    const total = days.reduce((sum, day) => sum + day.count, 0);
    const count = `${total.toLocaleString('pt-BR')} ${total === 1 ? 'contribuição' : 'contribuições'} no último ano`;
    const svg = svgElement('svg', { viewBox: `0 0 ${28 + columns * 12} 108`, role: 'img', 'aria-label': `${count}. De ${dates.format(days[0].time)} a ${dates.format(days.at(-1).time)}.` });
    let lastMonthX = -40;
    for (const [index, day] of days.entries()) {
      const date = new Date(day.time);
      const column = Math.floor((day.time - origin) / (7 * dayMs));
      const x = 28 + column * 12;
      if ((index === 0 || date.getUTCDate() === 1) && x - lastMonthX >= 24) {
        svg.append(svgElement('text', { x, y: 11 }, months.format(date).replace('.', '')));
        lastMonthX = x;
      }
      const rect = svgElement('rect', { x, y: 22 + date.getUTCDay() * 12, width: 10, height: 10, rx: 2, 'data-level': day.level });
      rect.append(svgElement('title', {}, `${day.count} ${day.count === 1 ? 'contribuição' : 'contribuições'} em ${dates.format(date)}`));
      svg.append(rect);
    }
    for (const [day, label] of [[1, 'Seg'], [3, 'Qua'], [5, 'Sex']]) svg.append(svgElement('text', { x: 0, y: 30 + day * 12 }, label));
    graph.replaceChildren(svg);
    summary.textContent = count;
    updated.textContent = `Consultado em ${consultedDates.format(new Date(fetchedAt))}`;
    rendered = true;
  }

  async function load() {
    try {
      const response = await fetch('assets/github-activity.json');
      if (!response.ok) throw new Error('Snapshot unavailable');
      const snapshot = await response.json();
      render(snapshot, snapshot.fetchedAt);
    } catch { /* The live request can still provide the graph. */ }
    try {
      const response = await fetch(endpoint, { credentials: 'omit', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error('GitHub activity unavailable');
      render(await response.json(), new Date().toISOString());
    } catch {
      if (!rendered) {
        summary.textContent = 'Contribuições indisponíveis no momento';
        updated.textContent = 'Veja a atividade no perfil do GitHub.';
      }
    }
  }
  load();
})();
