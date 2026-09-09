const OPEN = '1fr';
const CLOSED = '0fr';

function panelOf(row: HTMLDetailsElement): HTMLElement | null {
  return row.querySelector<HTMLElement>('[data-method-panel]');
}

function durationOf(panel: HTMLElement): number {
  const seconds = Number.parseFloat(
    getComputedStyle(panel).transitionDuration || '0',
  );
  return Number.isFinite(seconds) ? seconds * 1000 : 0;
}

function onSettled(panel: HTMLElement, done: () => void): void {
  let finished = false;
  const finish = (): void => {
    if (finished) {
      return;
    }
    finished = true;
    panel.removeEventListener('transitionend', handler);
    done();
  };
  const handler = (event: TransitionEvent): void => {
    if (event.target === panel && event.propertyName === 'grid-template-rows') {
      finish();
    }
  };

  panel.addEventListener('transitionend', handler);
  window.setTimeout(finish, durationOf(panel) + 80);
}

function syncDiagram(root: ParentNode, layerId: string | null): void {
  if (layerId === null) {
    return;
  }
  const layers = root.querySelectorAll<SVGGElement>('[data-layer]');
  for (const layer of layers) {
    layer.classList.toggle(
      'is-active',
      layer.getAttribute('data-layer') === layerId,
    );
  }
}

function collapse(row: HTMLDetailsElement): void {
  const panel = panelOf(row);
  if (panel === null) {
    row.open = false;
    return;
  }

  panel.style.gridTemplateRows = OPEN;
  requestAnimationFrame(() => {
    panel.style.gridTemplateRows = CLOSED;
    onSettled(panel, () => {
      row.open = false;
      panel.style.removeProperty('grid-template-rows');
    });
  });
}

function expand(row: HTMLDetailsElement): void {
  const panel = panelOf(row);
  row.open = true;
  if (panel === null) {
    return;
  }

  panel.style.gridTemplateRows = CLOSED;
  requestAnimationFrame(() => {
    panel.style.gridTemplateRows = OPEN;
    onSettled(panel, () => panel.style.removeProperty('grid-template-rows'));
  });
}

export function initMethodAccordion(selector = '[data-method-row]'): void {
  const rows = Array.from(
    document.querySelectorAll<HTMLDetailsElement>(selector),
  );
  if (rows.length === 0) {
    return;
  }

  const scope = rows[0]?.closest('.method') ?? document;

  for (const row of rows) {
    const summary = row.querySelector('summary');
    if (summary === null) {
      continue;
    }

    summary.addEventListener('click', (event) => {
      event.preventDefault();

      if (row.open) {
        collapse(row);
        return;
      }

      for (const other of rows) {
        if (other !== row && other.open) {
          collapse(other);
        }
      }
      expand(row);
      syncDiagram(scope, row.getAttribute('data-layer-id'));
    });
  }
}
