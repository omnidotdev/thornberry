import { afterEach, describe, expect, mock, test } from "bun:test";

import { cleanup, fireEvent, render } from "@testing-library/react";

import {
  AiChatThread,
  shouldSendOnKey,
} from "@/registry/thornberry/components/ai-chat-thread";

import type {
  ChatMessage,
  ComposerKeyEvent,
} from "@/registry/thornberry/components/ai-chat-thread";

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

  test("renderAvatar replaces the default role icon for every message", () => {
    const { getAllByText } = render(
      <AiChatThread
        messages={messages}
        status="streaming"
        input=""
        onInputChange={noop}
        onSend={noop}
        renderAvatar={(m) => <span>avatar:{m.role}</span>}
      />,
    );
    // Two messages (user + assistant) plus the streaming assistant row
    expect(getAllByText(/^avatar:/)).toHaveLength(3);
  });

  test("renders the composer accessory, actions, and footer hint slots", () => {
    const { getByText } = render(
      <AiChatThread
        messages={messages}
        input=""
        onInputChange={noop}
        onSend={noop}
        composerAccessory={<div>model picker</div>}
        composerActions={<button type="button">voice</button>}
        footerHint="Shift+Enter for a new line"
      />,
    );
    expect(getByText("model picker")).toBeDefined();
    expect(getByText("voice")).toBeDefined();
    expect(getByText("Shift+Enter for a new line")).toBeDefined();
  });

  test("hides the keyboard hint on touch-first devices", () => {
    const { getByText } = render(
      <AiChatThread
        messages={messages}
        input=""
        onInputChange={noop}
        onSend={noop}
        footerHint="Shift+Enter for a new line"
      />,
    );
    expect(getByText("Shift+Enter for a new line").className).toContain(
      "pointer-coarse:hidden",
    );
  });

  test("drafts a picked example prompt into the composer, without sending", () => {
    const onInputChange = mock();
    const onSend = mock();
    const { getByText, getByRole } = render(
      <AiChatThread
        messages={[]}
        input=""
        onInputChange={onInputChange}
        onSend={onSend}
        suggestions={["A booking site for a dog groomer"]}
      />,
    );

    expect(getByRole("group", { name: "Example prompts" })).toBeDefined();

    fireEvent.click(getByText("A booking site for a dog groomer"));

    expect(onInputChange).toHaveBeenCalledWith(
      "A booking site for a dog groomer",
    );
    expect(onSend).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(getByRole("textbox"));
  });

  test("hides the examples once the user types or the thread has messages", () => {
    const suggestions = ["A booking site for a dog groomer"];
    const { queryByRole, rerender } = render(
      <AiChatThread
        messages={[]}
        input="a bakery"
        onInputChange={noop}
        onSend={noop}
        suggestions={suggestions}
      />,
    );

    expect(queryByRole("group", { name: "Example prompts" })).toBeNull();

    rerender(
      <AiChatThread
        messages={messages}
        input=""
        onInputChange={noop}
        onSend={noop}
        suggestions={suggestions}
      />,
    );

    expect(queryByRole("group", { name: "Example prompts" })).toBeNull();

    rerender(
      <AiChatThread
        messages={[]}
        input=""
        onInputChange={noop}
        onSend={noop}
        suggestions={suggestions}
      />,
    );

    expect(queryByRole("group", { name: "Example prompts" })).not.toBeNull();
  });
});

describe("shouldSendOnKey", () => {
  const key = (
    overrides: Partial<ComposerKeyEvent> = {},
  ): ComposerKeyEvent => ({
    key: "Enter",
    shiftKey: false,
    altKey: false,
    metaKey: false,
    ctrlKey: false,
    isComposing: false,
    ...overrides,
  });

  test("Enter sends with a hardware keyboard", () => {
    expect(shouldSendOnKey(key(), false)).toBe(true);
    expect(shouldSendOnKey(key({ shiftKey: true }), false)).toBe(false);
    expect(shouldSendOnKey(key({ altKey: true }), false)).toBe(false);
  });

  test("Enter inserts a newline on a touch keyboard", () => {
    expect(shouldSendOnKey(key(), true)).toBe(false);
  });

  test("Cmd/Ctrl+Enter always sends", () => {
    expect(shouldSendOnKey(key({ metaKey: true }), true)).toBe(true);
    expect(shouldSendOnKey(key({ ctrlKey: true }), false)).toBe(true);
  });

  test("never sends while an IME is composing", () => {
    expect(shouldSendOnKey(key({ isComposing: true }), false)).toBe(false);
    expect(shouldSendOnKey(key({ keyCode: 229 }), false)).toBe(false);
  });

  test("ignores other keys", () => {
    expect(shouldSendOnKey(key({ key: "a" }), false)).toBe(false);
  });
});
