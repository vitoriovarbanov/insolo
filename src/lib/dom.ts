type Attrs = Record<string, string>;
type Child = string | Node;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: readonly Child[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  for (const [name, value] of Object.entries(attrs)) {
    node.setAttribute(name, value);
  }

  for (const child of children) {
    node.append(
      typeof child === 'string' ? document.createTextNode(child) : child,
    );
  }

  return node;
}

/** Query a single element, throwing with the selector if it is absent. */
export function qs<T extends Element = HTMLElement>(
  selector: string,
  root: ParentNode = document,
): T {
  const found = root.querySelector<T>(selector);
  if (found === null) {
    throw new Error(`No element matches selector "${selector}".`);
  }
  return found;
}
