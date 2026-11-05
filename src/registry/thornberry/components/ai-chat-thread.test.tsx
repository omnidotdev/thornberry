import { afterEach, describe, expect, mock, test } from "bun:test";

import { cleanup, fireEvent, render } from "@testing-library/react";

import { AiChatThread } from "@/registry/thornberry/components/ai-chat-thread";

import type { ChatMessage } from "@/registry/thornberry/components/ai-chat-thread";

afterEach(cleanup);

const messages: ChatMessage[] = [
  { id: "m1", role: "user", parts: [{ type: "text", text: "make a cube" }] },
  {
    id: "m2",
    role: "assistant",
    parts: [
      { type: "text", text: "Here you go" },
      { type: "tool-call", name: "run_cad_script", status: "done" },
    ],
  },
];

const noop = () => {};

describe("AiChatThread", () => {
  test("renders messages, their text, and tool-call parts", () => {
    const { getByText } = render(
      <AiChatThread
        messages={messages}
        input=""
        onInputChange={noop}
        onSend={noop}
      />,
    );
    expect(getByText("make a cube")).toBeDefined();
    expect(getByText("Here you go")).toBeDefined();
    expect(getByText("run_cad_script")).toBeDefined();
  });

  test("shows the empty state when there are no messages", () => {
    const { getByText } = render(
      <AiChatThread
        messages={[]}
        input=""
        onInputChange={noop}
        onSend={noop}
        emptyState="Start a conversation"
      />,
    );
    expect(getByText("Start a conversation")).toBeDefined();
  });

  test("Enter sends when the input is non-empty; Shift+Enter does not", () => {
    const onSend = mock(() => {});
    const { getByLabelText } = render(
      <AiChatThread
        messages={messages}
        input="hello"
        onInputChange={noop}
        onSend={onSend}
      />,
    );
    const composer = getByLabelText("Message");

    fireEvent.keyDown(composer, { key: "Enter", shiftKey: true });
    expect(onSend).toHaveBeenCalledTimes(0);

    fireEvent.keyDown(composer, { key: "Enter" });
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  test("does not send an empty/whitespace input on Enter", () => {
    const onSend = mock(() => {});
    const { getByLabelText } = render(
      <AiChatThread
        messages={messages}
        input="   "
        onInputChange={noop}
        onSend={onSend}
      />,
    );
    fireEvent.keyDown(getByLabelText("Message"), { key: "Enter" });
    expect(onSend).toHaveBeenCalledTimes(0);
  });

  test("shows a typing indicator while streaming", () => {
    const { getByLabelText } = render(
      <AiChatThread
        messages={messages}
        status="streaming"
        input=""
        onInputChange={noop}
        onSend={noop}
      />,
    );
    expect(getByLabelText("Assistant is typing")).toBeDefined();
  });
});
