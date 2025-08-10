import { JSX } from "react";

export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export type SideNavItemGroup = {
  title: string;
  menuList: SideNavItem[]
}

export type FilterCondition = {
  attribute: string
  operator: "=" | "<=" | ">=" | "=?" | "?=" | "!=" | "<" | ">" | "in" | "!in"
  type: "AND" | "OR"
  value: string
  secondValue?: string
}


export type SelectboxModal = {
  key: string
  value: string
} | undefined

export type ThemeItem = {
  name: string;
  theme:string
  icon: string;
}