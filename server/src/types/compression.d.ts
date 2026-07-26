declare module "compression" {
  import type { RequestHandler } from "express";

  function compression(options?: unknown): RequestHandler;

  export default compression;
}
