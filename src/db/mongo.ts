import { MongoClient, Database } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { EventSchema } from "./schemas.ts";
import "https://deno.land/x/dotenv/load.ts";


const connectMongoDB = async (): Promise<Database> => {
  const mongo_url = Deno.env.get("URL_MONGO")
  console.log("url de mongo: " + mongo_url)
  const client = new MongoClient();
  if(mongo_url)
  await client.connect(mongo_url);
  const db = client.database("ExtraordinariaBack");
  return db; //brings the collection from mongo
};

const db = await connectMongoDB(); //we save the collection into const db
console.info(`MongoDB ${db.name} connected`); 

export const EventsCollection = db.collection<EventSchema>("Eventos")
