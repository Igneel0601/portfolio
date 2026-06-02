import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount React trees between tests so jsdom doesn't accumulate DOM.
afterEach(() => cleanup());
