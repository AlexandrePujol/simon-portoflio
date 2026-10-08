import dynamic from "next/dynamic";

// Isolated behind a dynamic import (ssr: false) so dialkit/styles.css and
// the panel itself are only ever fetched in the browser, never rendered
// server-side.
const DialPanel = dynamic(() => import("./DialPanel"), { ssr: false });

export default function DevTools() {
  return <DialPanel />;
}
