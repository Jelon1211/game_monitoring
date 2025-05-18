import { AccountType } from "@/enums/roles";
import { Route, RouteLabel, RouteGroup } from "@/enums/routes";
import { AppRoute } from "@/types/router";
import { DashboardIcon, SettingsIcon } from "@/components/icons";

export const appRoutes: AppRoute[] = [
  {
    label: RouteLabel.HOME,
    href: Route.HOME,
    protected: false,
    group: [RouteGroup.MAIN],
  },
  {
    label: RouteLabel.DASHBOARD,
    href: Route.PANEL + Route.DASHBOARD,
    icon: DashboardIcon,
    protected: true,
    roles: [
      AccountType.FREE,
      AccountType.STANDARD,
      AccountType.PREMIUM,
      AccountType.ADMIN,
    ],
    group: [RouteGroup.SIDEBAR],
  },
  {
    label: RouteLabel.SETTINGS,
    href: Route.PANEL + Route.SETTINGS,
    icon: SettingsIcon,
    protected: true,
    roles: [
      AccountType.FREE,
      AccountType.STANDARD,
      AccountType.PREMIUM,
      AccountType.ADMIN,
    ],
    group: [RouteGroup.USER],
  },
];
