import { useId } from "react"
import {
  HashIcon,
  HouseIcon,
  MailIcon,
  SearchIcon,
  UsersRound,
} from "lucide-react"

import Logo from "@/components/sidebar/logo"
import NotificationMenu from "@/components/sidebar/notification-menu"
import UserMenu from "@/components/sidebar/user-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button"
import { Link, NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { to: "/dashboard", label: "Home", icon: HouseIcon },
  { to: "/dashboard/hash", label: "Hash", icon: HashIcon },
  { to: "/dashboard/groups", label: "Groups", icon: UsersRound },
]

export default function Component() {
  const id = useId()

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
                aria-label="Toggle menu"
                type="button"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>Menu</title>
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink asChild>
                          <NavLink
                            to={link.to}
                            end={link.to === "/dashboard"}
                            className={({ isActive }) =>
                              cn(
                                "flex w-full flex-row items-center gap-2 rounded-md py-1.5 px-2",
                                isActive
                                  ? "bg-muted text-foreground"
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                              )
                            }
                            aria-label={link.label}
                          >
                            <Icon
                              size={16}
                              className="text-current"
                              aria-hidden="true"
                            />
                            <span>{link.label}</span>
                          </NavLink>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-primary hover:text-primary/90">
              <Logo />
            </Link>
            {/* Search form */}
            <div className="relative">
              <Input
                id={id}
                className="peer h-8 ps-8 pe-2"
                placeholder="Search..."
                type="search"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
                <SearchIcon size={16} />
              </div>
            </div>
          </div>
        </div>
        {/* Middle area */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-2">
            {navigationLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to={link.to}
                      end={link.to === "/dashboard"}
                      title={link.label}
                      className={({ isActive }) =>
                        cn(
                          "flex size-8 items-center justify-center rounded-md p-1.5",
                          isActive
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )
                      }
                      aria-label={link.label}
                    >
                      <Icon aria-hidden="true" />
                      <span className="sr-only">{link.label}</span>
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <ThemeToggleButton start="top-right" variant="circle-blur" buttonVariant="ghost" />
            {/* Messages */}
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground relative size-8 rounded-full shadow-none"
              aria-label="Open notifications"
              type="button"
            >
              <MailIcon size={16} aria-hidden="true" />
              <div
                aria-hidden="true"
                className="bg-primary absolute top-0.5 right-0.5 size-1 rounded-full"
              />
            </Button>
            {/* Notification menu */}
            <NotificationMenu />
          </div>
          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
