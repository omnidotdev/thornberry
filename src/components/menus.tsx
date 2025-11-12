"use client";

import { Circle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/registry/thornberry/components/button";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemIndicator,
  MenuItemShortcut,
  MenuItemText,
  MenuPositioner,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  MenuTriggerItem,
  PrimitiveMenuIndicator,
} from "@/registry/thornberry/components/menu";

export const DemoMenu = () => (
  <div className="flex justify-center">
    <MenuRoot>
      <MenuTrigger asChild className="my-8">
        <Button variant="outline">Open Menu</Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent className="w-48">
          <MenuItemGroup>
            <MenuItemGroupLabel>My Account</MenuItemGroupLabel>
            <MenuItem value="profile">
              <MenuItemText>Profile</MenuItemText>
            </MenuItem>
            <MenuItem value="billing">
              <MenuItemText>Billing</MenuItemText>
              <MenuItemShortcut>⌘B</MenuItemShortcut>
            </MenuItem>
            <MenuItem value="settings">
              <MenuItemText>Settings</MenuItemText>
              <MenuItemShortcut>⌘S</MenuItemShortcut>
            </MenuItem>
          </MenuItemGroup>

          <MenuSeparator />
          <MenuItemGroup>
            <MenuItemGroupLabel>My Team</MenuItemGroupLabel>
            <MenuItem value="members" asChild>
              <a
                href="https://reactjs.org"
                className="cursor-pointer font-normal no-underline"
              >
                <MenuItemText>Team Members</MenuItemText>
                <MenuItemShortcut>↗</MenuItemShortcut>
              </a>
            </MenuItem>
            <MenuItem value="invites">
              <MenuItemText>Invitations</MenuItemText>
            </MenuItem>
            <MenuItem value="permissions">
              <MenuItemText>Permissions</MenuItemText>
            </MenuItem>
          </MenuItemGroup>
          <MenuSeparator />
          <MenuItemGroup>
            <MenuItem value="logout">
              <MenuItemText>Log out</MenuItemText>
              <MenuItemShortcut>⇧⌘Q</MenuItemShortcut>
            </MenuItem>
          </MenuItemGroup>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  </div>
);

export const CheckboxMenu = () => {
  const [checkedOptions, setCheckedOptions] = useState<string[]>([]);
  const checkboxOptions = [
    { label: "Enable notifications", value: "notifications" },
    { label: "Dark mode", value: "darkMode" },
    { label: "Auto-save drafts", value: "autoSave" },
    { label: "Receive weekly emails", value: "weeklyEmails" },
    { label: "Beta features", value: "betaFeatures" },
  ];

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent className="w-60">
          <MenuItemGroup className="space-y-1">
            <MenuItemGroupLabel>Preferences</MenuItemGroupLabel>
            {checkboxOptions.map((option) => (
              <MenuCheckboxItem
                key={option.value}
                closeOnSelect={false}
                checked={checkedOptions.includes(option.value)}
                onCheckedChange={(checked) =>
                  setCheckedOptions((prev: string[]) =>
                    checked
                      ? [...prev, option.value]
                      : prev.filter((v) => v !== option.value),
                  )
                }
                value={option.value}
              >
                <MenuItemText className="flex items-center gap-2">
                  {option.label}
                </MenuItemText>
                <MenuItemIndicator />
              </MenuCheckboxItem>
            ))}
          </MenuItemGroup>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

export const RadioGroupMenu = () => {
  const [value, setValue] = useState("React");
  const radioOptions = ["Apollo", "Voyager", "Artemis", "Odyssey"];

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent className="w-60">
          <MenuRadioItemGroup
            value={value}
            onValueChange={(e) => setValue(e.value)}
          >
            <MenuItemGroupLabel>Space Programs</MenuItemGroupLabel>
            {radioOptions.map((program) => (
              <MenuRadioItem key={program} value={program}>
                <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                  <PrimitiveMenuIndicator>
                    <Circle className="size-2 fill-current" />
                  </PrimitiveMenuIndicator>
                </span>

                <MenuItemText>{program}</MenuItemText>
              </MenuRadioItem>
            ))}
          </MenuRadioItemGroup>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

export const NestedMenu = () => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent className="w-48">
          <MenuItemGroup>
            <MenuItemGroupLabel>Organization</MenuItemGroupLabel>
            <MenuRoot>
              <MenuTriggerItem>Members</MenuTriggerItem>
              <MenuPositioner>
                <MenuContent className="w-48">
                  <MenuItemGroup>
                    <MenuItem value="alpha">
                      <MenuItemText>Alpha</MenuItemText>
                    </MenuItem>
                    <MenuItem value="beta">
                      <MenuItemText>Beta</MenuItemText>
                    </MenuItem>
                    <MenuItem value="gamma">
                      <MenuItemText>Gamma</MenuItemText>
                    </MenuItem>
                  </MenuItemGroup>
                  <MenuSeparator />
                  <MenuItem value="invite">
                    <MenuItemText>Invite member</MenuItemText>
                    <MenuItemShortcut>⌘+M</MenuItemShortcut>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
            <MenuRoot>
              <MenuTriggerItem>Teams</MenuTriggerItem>
              <MenuPositioner>
                <MenuContent className="w-48">
                  <MenuItemGroup>
                    <MenuItem value="alpha">
                      <MenuItemText>Alpha</MenuItemText>
                    </MenuItem>
                    <MenuItem value="beta">
                      <MenuItemText>Beta</MenuItemText>
                    </MenuItem>
                    <MenuItem value="gamma">
                      <MenuItemText>Gamma</MenuItemText>
                    </MenuItem>
                  </MenuItemGroup>
                  <MenuSeparator />
                  <MenuItem value="create">
                    <MenuItemText>Create team</MenuItemText>
                    <MenuItemShortcut>⌘+T</MenuItemShortcut>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </MenuItemGroup>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};
