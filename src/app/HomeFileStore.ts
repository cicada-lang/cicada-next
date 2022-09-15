import os from "os"
import Path from "path"
import process from "process"
import { LocalFileStore } from "../framework/file-stores/local-file-store"

export class HomeFileStore extends LocalFileStore {
  constructor() {
    super({
      dir: process.env["CICADA_HOME"] || Path.resolve(os.homedir(), ".cicada"),
    })
  }
}
