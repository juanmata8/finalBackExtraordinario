import { Application, Context, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import "https://deno.land/x/dotenv/load.ts";
import { addEvent } from "./resolvers/post.ts";
import { event, events } from "./resolvers/get.ts";
import { deleteEvent } from "./resolvers/delete.ts";
import { updateEvent } from "./resolvers/put.ts";

const router = new Router();

//en la medida que no usemos una collection, no nos conectamos a la bd
router
    .get("/events", events)
    .get("/event/:id", event)
    .post("/addEvent", addEvent)
    .delete("/deleteEvent/:id", deleteEvent)
    .put("/updateEvent", updateEvent)


const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
const port = Deno.env.get("PORT");

if(port)await app.listen({ port:parseInt(port, 10) });//port:parseInt(port, 10)

console.log(`Server listening to port ${port}`);


