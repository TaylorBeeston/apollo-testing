import { startStandaloneServer } from "@apollo/server/standalone";

import { server } from "./server";

const { url } = await startStandaloneServer(server);

console.log("Server running at", url);
