import * as React from "react"
import { AudioWaveform, Command, Settings2, SquareTerminal } from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { type User } from '@/services/auth.api'

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: AudioWaveform,
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
      title: "Dashboard",
      url: "/admin",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Interment Setup",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Customer",
          url: "/admin/interment/customer",
        },
        {
          title: "Lot Owner",
          url: "/admin/interment/lot-owner",
        },
        {
          title: "Deceased Record",
          url: "/admin/interment/deceased",
        },
      ],
    },
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          ...user,
          avatar: "/avatars/shadcn.jpg"
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

