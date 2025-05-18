import { AccountType } from "@/enums/roles";
import { RouteGroup } from "@/enums/routes";
import { SVGProps } from "react";

export type AppRoute = {
  label: string;
  href: string;
  icon?: React.ComponentType<SVGProps<SVGSVGElement>>;
  protected: boolean;
  roles?: Role[];
  group: RouteGroup[];
};

export type Role = AccountType;
