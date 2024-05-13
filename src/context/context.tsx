import React from "react";
import { ThemeContextProvider } from "./themeContext";

export interface IThemeComponents {
  ThemeProvider: React.ElementType;
}

export const ApplicationContext: React.FC & IThemeComponents = () => <div />;

ApplicationContext.ThemeProvider = ThemeContextProvider;
