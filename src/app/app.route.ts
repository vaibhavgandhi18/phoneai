import { Routes } from "@angular/router";

// dashboard
import { IndexComponent } from "./index";

// widgets
import { WidgetsComponent } from "./widgets";

// tables
import { TablesComponent } from "./tables";

// font-icons
import { FontIconsComponent } from "./font-icons";

// charts
import { ChartsComponent } from "./charts";

// dragndrop
import { DragndropComponent } from "./dragndrop";

// layouts
import { AppLayout } from "./layouts/app-layout";
import { AuthLayout } from "./layouts/auth-layout";

// pages
import { KnowledgeBaseComponent } from "./pages/knowledge-base";
import { FaqComponent } from "./pages/faq";

import { PlaygroundComponent } from "./playground";
import { ServicePlaygroundComponent } from "./servicePlayground";
import { AskEVAPlaygroundComponent } from "./askEVAPlayground";

export const routes: Routes = [
  {
    path: "",
    component: AppLayout,
    children: [
      // dashboard
      { path: "", component: IndexComponent, title: "Phone AI Dashboard" },
      {
        path: "user-bot-playground",
        component: PlaygroundComponent,
        title: "Breezy Playground",
      },
      {
        path: "service-bot-playground",
        component: ServicePlaygroundComponent,
        title: "EVA Playground",
      },
      {
        path: "ask-eva-agent-playground",
        component: AskEVAPlaygroundComponent,
        title: "Ask EVA Agent Playground",
      },

      //apps
      {
        path: "",
        loadChildren: () =>
          import("./apps/apps.module").then((d) => d.AppsModule),
      },

      // widgets
      {
        path: "widgets",
        component: WidgetsComponent,
        title: "Widgets | VRISTO - Multipurpose Tailwind Dashboard Template",
      },

      // components
      {
        path: "",
        loadChildren: () =>
          import("./components/components.module").then(
            (d) => d.ComponentsModule
          ),
      },

      // elements
      {
        path: "",
        loadChildren: () =>
          import("./elements/elements.module").then((d) => d.ElementsModule),
      },

      // forms
      {
        path: "",
        loadChildren: () =>
          import("./forms/form.module").then((d) => d.FormModule),
      },

      // users
      {
        path: "",
        loadChildren: () =>
          import("./users/user.module").then((d) => d.UsersModule),
      },

      // tables
      {
        path: "tables",
        component: TablesComponent,
        title: "Tables | VRISTO - Multipurpose Tailwind Dashboard Template",
      },
      {
        path: "",
        loadChildren: () =>
          import("./datatables/datatables.module").then(
            (d) => d.DatatablesModule
          ),
      },

      // font-icons
      {
        path: "font-icons",
        component: FontIconsComponent,
        title: "Font Icons | VRISTO - Multipurpose Tailwind Dashboard Template",
      },

      // charts
      {
        path: "charts",
        component: ChartsComponent,
        title: "Charts | VRISTO - Multipurpose Tailwind Dashboard Template",
      },

      // dragndrop
      {
        path: "dragndrop",
        component: DragndropComponent,
        title: "Dragndrop | VRISTO - Multipurpose Tailwind Dashboard Template",
      },

      // pages
      {
        path: "pages/knowledge-base",
        component: KnowledgeBaseComponent,
        title:
          "Knowledge Base | VRISTO - Multipurpose Tailwind Dashboard Template",
      },
      {
        path: "pages/faq",
        component: FaqComponent,
        title: "FAQ | VRISTO - Multipurpose Tailwind Dashboard Template",
      },
    ],
  },

  {
    path: "",
    component: AuthLayout,
    children: [
      // pages
      {
        path: "",
        loadChildren: () =>
          import("./pages/pages.module").then((d) => d.PagesModule),
      },

      // auth
      {
        path: "",
        loadChildren: () =>
          import("./auth/auth.module").then((d) => d.AuthModule),
      },
    ],
  },
];
