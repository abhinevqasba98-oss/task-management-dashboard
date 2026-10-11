/// <reference types="vite/client" />

declare module "*.css" {
  const content: { [key: string]: string };
  export default content;
}

declare module "react-toastify/dist/ReactToastify.css" {
  const content: { [key: string]: string };
  export default content;
}
