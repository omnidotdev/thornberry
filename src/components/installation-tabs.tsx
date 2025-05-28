import { Tab, Tabs } from "fumadocs-ui/components/tabs";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface Props {
  filename: string;
}

const InstallationTabs = ({ filename }: Props) => {
  const importUrl = `${baseUrl}/r/${filename}`;

  const packageManagers = [
    { name: "bun", command: `bunx --bun shadcn@latest add ${importUrl}` },
    { name: "pnpm", command: `pnpm dlx shadcn@latest add ${importUrl}` },
    { name: "yarn", command: `npx shadcn@latest add ${importUrl}` },
    { name: "npm", command: `npx shadcn@latest add ${importUrl}` },
  ];

  return (
    <Tabs items={packageManagers.map((pm) => pm.name)} className="mt-4">
      {packageManagers.map(({ name, command }) => (
        <Tab key={name} value={name}>
          {command}
        </Tab>
      ))}
    </Tabs>
  );
};

export default InstallationTabs;
