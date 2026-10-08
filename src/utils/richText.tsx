import type { RichTextField, RTInlineNode } from "@prismicio/client";
import { Fragment, type ReactNode } from "react";

type SpanType = RTInlineNode["type"];
type SpanRenderer = (children: ReactNode, key: string) => ReactNode;

/** Span types rendered as inline formatting. Extend this to support more. */
const spanRenderers: Partial<Record<SpanType, SpanRenderer>> = {
  strong: (children, key) => <strong key={key}>{children}</strong>,
  em: (children, key) => <em key={key}>{children}</em>,
};

/** Cut points for a block's text: every span boundary, plus every `\n`. */
function getCutPoints(text: string, spans: RTInlineNode[]): number[] {
  const cuts = new Set<number>([0, text.length]);

  for (const span of spans) {
    cuts.add(span.start);
    cuts.add(span.end);
  }
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") {
      cuts.add(i);
      cuts.add(i + 1);
    }
  }

  return [...cuts].sort((a, b) => a - b);
}

/** Wraps a text segment with whichever renderable spans cover it, innermost first. */
function renderSegment(
  slice: string,
  spans: RTInlineNode[],
  segStart: number,
  segEnd: number,
  key: string,
): ReactNode {
  const covering = spans
    .filter(
      (span) =>
        span.type in spanRenderers && span.start <= segStart && span.end >= segEnd,
    )
    .sort((a, b) => a.end - a.start - (b.end - b.start));

  return covering.reduce<ReactNode>(
    (content, span, i) => spanRenderers[span.type]!(content, `${key}-${i}`),
    slice,
  );
}

/** Renders one block's text as inline nodes, splitting on span/line boundaries. */
function renderBlockText(text: string, spans: RTInlineNode[], blockIdx: number): ReactNode[] {
  const cuts = getCutPoints(text, spans);
  const nodes: ReactNode[] = [];

  for (let i = 0; i < cuts.length - 1; i++) {
    const segStart = cuts[i];
    const segEnd = cuts[i + 1];
    const slice = text.slice(segStart, segEnd);
    if (!slice) continue;

    if (slice === "\n") {
      nodes.push(<br key={`br-${blockIdx}-${i}`} />);
      continue;
    }

    nodes.push(
      <Fragment key={`seg-${blockIdx}-${i}`}>
        {renderSegment(slice, spans, segStart, segEnd, `${blockIdx}-${i}`)}
      </Fragment>,
    );
  }

  return nodes;
}

/**
 * Renders a rich text field as flat inline React nodes: block boundaries and
 * soft returns become <br />, and strong/em spans become <strong>/<em>. Other
 * formatting (links, labels, ...) is flattened to plain text — use
 * @prismicio/react's PrismicRichText if you need those too.
 */
export function richTextAsText(field: RichTextField | null | undefined): ReactNode {
  if (!field || field.length === 0) return null;

  const nodes: ReactNode[] = [];

  field.forEach((block, blockIdx) => {
    if (!("text" in block)) return;

    if (blockIdx > 0) {
      nodes.push(<br key={`block-br-${blockIdx}`} />);
    }

    nodes.push(...renderBlockText(block.text, block.spans ?? [], blockIdx));
  });

  return nodes.length > 0 ? nodes : null;
}
