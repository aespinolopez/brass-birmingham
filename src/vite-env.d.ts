/// <reference types="vite/client" />

// CSS Modules type definition
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}