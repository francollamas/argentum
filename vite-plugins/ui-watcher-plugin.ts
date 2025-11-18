import { exec } from "node:child_process";
import type { Plugin } from "vite";

export const uiWatcherPlugin = (): Plugin => ({
	name: "texpacker-ui-watcher",
	configureServer(server) {
		const watchPath = "./tools/texpacker/ui";
		server.watcher.add(watchPath);

		server.watcher.on("change", (file) => {
			if (!file.endsWith(".svg")) return;

			exec("pnpm --silent generate-ui", () => {
				server.ws.send({
					type: "full-reload",
					path: "*",
				});
			});
		});
	},
});
