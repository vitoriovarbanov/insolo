# Icons

Imported as Astro SVG components (`import Icon from '@/assets/icons/x.svg'`),
inlined at build time. No icon library is installed — see
`docs/plans/2026-09-05-services-icons-design.md` for why.

Size and stroke weight are passed as props at the call site, not baked into
these files, so the whole set stays consistent from one place.

## Provenance

`clipboard-check`, `drafting-compass`, `hard-hat`, `activity` and
`chevron-left` are from
[Lucide](https://lucide.dev) v1.41.0, used under the **ISC licence**:

> Copyright (c) 2020, Lucide Contributors
>
> Permission to use, copy, modify, and/or distribute this software for any
> purpose with or without fee is hereby granted, provided that the above
> copyright notice and this permission notice appear in all copies.

The licence comment Lucide ships in each file sits outside `<svg>` and is
stripped when Astro inlines the markup, which is why the notice is kept here.

`shield-bolt.svg` is ours. Lucide has no `shield-zap`, so the shield-and-bolt
composite for lightning protection is hand-authored to match Lucide's 24px
grid and stroke conventions.
