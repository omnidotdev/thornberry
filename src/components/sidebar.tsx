"use client";

import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LogOut,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Avatar } from "@/registry/thornberry/components/avatar";
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@/registry/thornberry/components/collapsible";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItemShortcut,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/registry/thornberry/components/menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/registry/thornberry/components/sidebar";

import type { ComponentProps, ReactNode } from "react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export const SidebarExample = () => {
  return (
    <SidebarContext>
      <AppSidebar />
      <SidebarInset className="flex flex-1 overflow-hidden border bg-background">
        <SidebarTrigger />
      </SidebarInset>
    </SidebarContext>
  );
};

const AppSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const { isMobile, state } = useSidebar();

  const [activeTeam, setActiveTeam] = useState(data.teams[0]);

  if (!activeTeam) return null;

  return (
    <Sidebar className="relative" variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <MenuRoot>
              <MenuTrigger asChild>
                <SidebarMenuButton className="h-12 bg-sidebar-accent focus-visible:ring-offset-background">
                  <activeTeam.logo
                    className={cn(
                      "rotate-none!",
                      state === "expanded" ? "size-12" : "size-4",
                    )}
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs">{activeTeam.plan}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto rotate-none!" />
                </SidebarMenuButton>
              </MenuTrigger>
              <MenuPositioner>
                <MenuContent className="min-w-56 rounded-lg">
                  <MenuItemGroup>
                    <MenuItemGroupLabel>Teams</MenuItemGroupLabel>
                    {data.teams.map((team, index) => (
                      <MenuItem
                        key={team.name}
                        onClick={() => setActiveTeam(team)}
                        className="gap-2 p-2"
                        value={team.name}
                      >
                        <div className="flex size-6 items-center justify-center rounded-md border">
                          <team.logo className="size-3.5 shrink-0" />
                        </div>
                        {team.name}
                        <MenuItemShortcut>⌘{index + 1}</MenuItemShortcut>
                      </MenuItem>
                    ))}
                  </MenuItemGroup>

                  <MenuSeparator />

                  <MenuItem value="add team" className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add team
                    </div>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="py-1">
        <SidebarGroup>
          <SidebarGroupLabel>
            Platform
            <SidebarGroupAction className="ml-auto">
              <Plus />
            </SidebarGroupAction>
          </SidebarGroupLabel>
          <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
            {data.navMain.map((item) => (
              <MenuRoot key={item.title} defaultOpen={item.isActive}>
                <MenuTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className="relative">
                    {item.icon && <item.icon className="rotate-none!" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200" />
                  </SidebarMenuButton>
                </MenuTrigger>
                <MenuPositioner>
                  <MenuContent>
                    {item.items?.map((subItem) => (
                      <MenuItem
                        value={subItem.title}
                        key={subItem.title}
                        asChild
                      >
                        <a className="no-underline" href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </MenuItem>
                    ))}
                  </MenuContent>
                </MenuPositioner>
              </MenuRoot>
            ))}
          </SidebarMenu>

          <SidebarMenu className="group-data-[collapsible=icon]:hidden">
            {data.navMain.map((item) => (
              <CollapsibleRoot key={item.title} defaultOpen={item.isActive}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon className="rotate-none!" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto size-3! transition-transform duration-200" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="-mx-2 animate-none border-none">
                  <SidebarMenu className="my-1 ml-3 border-l px-2">
                    {item.items?.map((subItem) => (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton asChild>
                          <a className="no-underline" href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </CollapsibleRoot>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>
            Projects
            <SidebarGroupAction className="ml-auto">
              <Plus />
            </SidebarGroupAction>
          </SidebarGroupLabel>
          <SidebarMenu>
            {data.projects.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <a className="no-underline" href={item.url}>
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
                <MenuRoot>
                  <MenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </MenuTrigger>
                  <MenuPositioner>
                    <MenuContent className="min-w-56 flex-1 rounded-lg">
                      <MenuItem value="view project">
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </MenuItem>
                      <MenuItem value="share project">
                        <Forward className="text-muted-foreground" />
                        <span>Share Project</span>
                      </MenuItem>
                      <MenuSeparator />
                      <MenuItem variant="destructive" value="delete project">
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </MenuItem>
                    </MenuContent>
                  </MenuPositioner>
                </MenuRoot>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70">
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <MenuRoot
              positioning={{
                strategy: "fixed",
                placement: isMobile ? "bottom-end" : "right-start",
              }}
            >
              <MenuTrigger asChild>
                {/* TODO: fix avatar when sidebar is collapsed */}
                <SidebarMenuButton className="h-12 bg-sidebar-accent focus-visible:ring-offset-background">
                  <Avatar
                    src="/img/elon-musk.jpg"
                    alt="Elon Musk"
                    fallback="EM"
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Elon Musk</span>
                    <span className="truncate text-xs">emusk@x.com</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 rotate-none!" />
                </SidebarMenuButton>
              </MenuTrigger>
              <MenuPositioner>
                <MenuContent className="min-w-56 rounded-lg">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar
                      src="/img/elon-musk.jpg"
                      alt="Elon Musk"
                      fallback="EM"
                    />

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">Elon Musk</span>
                      <span className="truncate text-xs">emusk@x.com</span>
                    </div>
                  </div>
                  <MenuSeparator />
                  <MenuItemGroup>
                    <MenuItem value="upgrade">
                      <Sparkles />
                      Upgrade to Pro
                    </MenuItem>
                  </MenuItemGroup>
                  <MenuSeparator />
                  <MenuItemGroup>
                    <MenuItem value="account">
                      <BadgeCheck />
                      Account
                    </MenuItem>
                    <MenuItem value="billing">
                      <CreditCard />
                      Billing
                    </MenuItem>
                    <MenuItem value="notifications">
                      <Bell />
                      Notifications
                    </MenuItem>
                  </MenuItemGroup>
                  <MenuSeparator />
                  <MenuItem variant="destructive" value="log out">
                    <LogOut />
                    Log out
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export const SidebarContext = ({ children }: { children: ReactNode }) => (
  <SidebarProvider className="rounded-lg">{children}</SidebarProvider>
);
