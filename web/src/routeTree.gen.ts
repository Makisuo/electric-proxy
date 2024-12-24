/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AppImport } from './routes/_app'
import { Route as AppIndexImport } from './routes/_app/index'
import { Route as AuthLayoutImport } from './routes/auth/_layout'
import { Route as AppIdImport } from './routes/_app/$id'
import { Route as AuthLayoutSuccessImport } from './routes/auth/_layout.success'
import { Route as AuthLayoutSignupImport } from './routes/auth/_layout.signup'
import { Route as AuthLayoutSigninImport } from './routes/auth/_layout.signin'

// Create Virtual Routes

const AuthImport = createFileRoute('/auth')()

// Create/Update Routes

const AuthRoute = AuthImport.update({
  id: '/auth',
  path: '/auth',
  getParentRoute: () => rootRoute,
} as any)

const AppRoute = AppImport.update({
  id: '/_app',
  getParentRoute: () => rootRoute,
} as any)

const AppIndexRoute = AppIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AppRoute,
} as any)

const AuthLayoutRoute = AuthLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => AuthRoute,
} as any)

const AppIdRoute = AppIdImport.update({
  id: '/$id',
  path: '/$id',
  getParentRoute: () => AppRoute,
} as any)

const AuthLayoutSuccessRoute = AuthLayoutSuccessImport.update({
  id: '/success',
  path: '/success',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutSignupRoute = AuthLayoutSignupImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutSigninRoute = AuthLayoutSigninImport.update({
  id: '/signin',
  path: '/signin',
  getParentRoute: () => AuthLayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app': {
      id: '/_app'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppImport
      parentRoute: typeof rootRoute
    }
    '/_app/$id': {
      id: '/_app/$id'
      path: '/$id'
      fullPath: '/$id'
      preLoaderRoute: typeof AppIdImport
      parentRoute: typeof AppImport
    }
    '/auth': {
      id: '/auth'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/auth/_layout': {
      id: '/auth/_layout'
      path: '/auth'
      fullPath: '/auth'
      preLoaderRoute: typeof AuthLayoutImport
      parentRoute: typeof AuthRoute
    }
    '/_app/': {
      id: '/_app/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AppIndexImport
      parentRoute: typeof AppImport
    }
    '/auth/_layout/signin': {
      id: '/auth/_layout/signin'
      path: '/signin'
      fullPath: '/auth/signin'
      preLoaderRoute: typeof AuthLayoutSigninImport
      parentRoute: typeof AuthLayoutImport
    }
    '/auth/_layout/signup': {
      id: '/auth/_layout/signup'
      path: '/signup'
      fullPath: '/auth/signup'
      preLoaderRoute: typeof AuthLayoutSignupImport
      parentRoute: typeof AuthLayoutImport
    }
    '/auth/_layout/success': {
      id: '/auth/_layout/success'
      path: '/success'
      fullPath: '/auth/success'
      preLoaderRoute: typeof AuthLayoutSuccessImport
      parentRoute: typeof AuthLayoutImport
    }
  }
}

// Create and export the route tree

interface AppRouteChildren {
  AppIdRoute: typeof AppIdRoute
  AppIndexRoute: typeof AppIndexRoute
}

const AppRouteChildren: AppRouteChildren = {
  AppIdRoute: AppIdRoute,
  AppIndexRoute: AppIndexRoute,
}

const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren)

interface AuthLayoutRouteChildren {
  AuthLayoutSigninRoute: typeof AuthLayoutSigninRoute
  AuthLayoutSignupRoute: typeof AuthLayoutSignupRoute
  AuthLayoutSuccessRoute: typeof AuthLayoutSuccessRoute
}

const AuthLayoutRouteChildren: AuthLayoutRouteChildren = {
  AuthLayoutSigninRoute: AuthLayoutSigninRoute,
  AuthLayoutSignupRoute: AuthLayoutSignupRoute,
  AuthLayoutSuccessRoute: AuthLayoutSuccessRoute,
}

const AuthLayoutRouteWithChildren = AuthLayoutRoute._addFileChildren(
  AuthLayoutRouteChildren,
)

interface AuthRouteChildren {
  AuthLayoutRoute: typeof AuthLayoutRouteWithChildren
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthLayoutRoute: AuthLayoutRouteWithChildren,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof AppRouteWithChildren
  '/$id': typeof AppIdRoute
  '/auth': typeof AuthLayoutRouteWithChildren
  '/': typeof AppIndexRoute
  '/auth/signin': typeof AuthLayoutSigninRoute
  '/auth/signup': typeof AuthLayoutSignupRoute
  '/auth/success': typeof AuthLayoutSuccessRoute
}

export interface FileRoutesByTo {
  '/$id': typeof AppIdRoute
  '/auth': typeof AuthLayoutRouteWithChildren
  '/': typeof AppIndexRoute
  '/auth/signin': typeof AuthLayoutSigninRoute
  '/auth/signup': typeof AuthLayoutSignupRoute
  '/auth/success': typeof AuthLayoutSuccessRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_app': typeof AppRouteWithChildren
  '/_app/$id': typeof AppIdRoute
  '/auth': typeof AuthRouteWithChildren
  '/auth/_layout': typeof AuthLayoutRouteWithChildren
  '/_app/': typeof AppIndexRoute
  '/auth/_layout/signin': typeof AuthLayoutSigninRoute
  '/auth/_layout/signup': typeof AuthLayoutSignupRoute
  '/auth/_layout/success': typeof AuthLayoutSuccessRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/$id'
    | '/auth'
    | '/'
    | '/auth/signin'
    | '/auth/signup'
    | '/auth/success'
  fileRoutesByTo: FileRoutesByTo
  to: '/$id' | '/auth' | '/' | '/auth/signin' | '/auth/signup' | '/auth/success'
  id:
    | '__root__'
    | '/_app'
    | '/_app/$id'
    | '/auth'
    | '/auth/_layout'
    | '/_app/'
    | '/auth/_layout/signin'
    | '/auth/_layout/signup'
    | '/auth/_layout/success'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AppRoute: typeof AppRouteWithChildren
  AuthRoute: typeof AuthRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  AppRoute: AppRouteWithChildren,
  AuthRoute: AuthRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_app",
        "/auth"
      ]
    },
    "/_app": {
      "filePath": "_app.tsx",
      "children": [
        "/_app/$id",
        "/_app/"
      ]
    },
    "/_app/$id": {
      "filePath": "_app/$id.tsx",
      "parent": "/_app"
    },
    "/auth": {
      "filePath": "auth",
      "children": [
        "/auth/_layout"
      ]
    },
    "/auth/_layout": {
      "filePath": "auth/_layout.tsx",
      "parent": "/auth",
      "children": [
        "/auth/_layout/signin",
        "/auth/_layout/signup",
        "/auth/_layout/success"
      ]
    },
    "/_app/": {
      "filePath": "_app/index.tsx",
      "parent": "/_app"
    },
    "/auth/_layout/signin": {
      "filePath": "auth/_layout.signin.tsx",
      "parent": "/auth/_layout"
    },
    "/auth/_layout/signup": {
      "filePath": "auth/_layout.signup.tsx",
      "parent": "/auth/_layout"
    },
    "/auth/_layout/success": {
      "filePath": "auth/_layout.success.tsx",
      "parent": "/auth/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
